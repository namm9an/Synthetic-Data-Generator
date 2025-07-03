"""FastAPI application entry point for Phase 3.

Provides RESTful API endpoints to generate and retrieve synthetic datasets,
including preview of generated samples.
"""
# Set Hugging Face cache directory to D: drive before any imports
import os
os.environ["HF_HOME"] = r"D:\Academics\.cache\huggingface"
os.environ["HUGGINGFACE_HUB_CACHE"] = r"D:\Academics\.cache\huggingface\hub"
os.environ["TRANSFORMERS_CACHE"] = r"D:\Academics\.cache\huggingface\transformers"
os.environ["HF_DATASETS_CACHE"] = r"D:\Academics\.cache\huggingface\datasets"
import uuid
import tempfile
import time
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from config.database import Base, engine, get_db
from models.generator import SyntheticDataGenerator
from models.generation_db import Generation
from schemas.generation import (
    GenerationRequest, 
    GenerationResponse, 
    DatasetListResponse,
    PreviewResponse
)
from utils.utils import (
    get_preview_images,
    ensure_directory_exists,
    count_files_in_directory,
    create_zip_archive
)

app = FastAPI(
    title="Synthetic Data Generator",
    version="0.3.0",
    description="Phase 3: Backend API Endpoints for Synthetic Data Generation"
)

# Initialize the synthetic data generator (without database dependency)
try:
    # Try to create database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database setup warning: {e}")
    print("The API will still work but without persistent storage")

# Initialize the synthetic data generator
try:
    generator = SyntheticDataGenerator()
    print(f"✅ Generator initialized on device: {generator.device}")
except Exception as e:
    print(f"⚠️ Generator initialization warning: {e}")
    generator = None


@app.get("/health", tags=["Meta"])
async def health() -> dict[str, str]:
    """Health-check endpoint used by deployments and CI."""
    return {"status": "OK"}


@app.post("/generate", response_model=GenerationResponse, tags=["Generation"])
async def generate_synthetic_data(
    request: GenerationRequest,
    db: Session = Depends(get_db)
) -> GenerationResponse:
    """Generate synthetic data based on the provided request parameters.
    
    Accepts class_label, noise_level, output_size and generates synthetic images.
    Returns response with id, download link, and preview of first 3 samples.
    
    Args:
        request: Generation parameters
        db: Database session dependency
        
    Returns:
        GenerationResponse with generated dataset metadata and previews
        
    Raises:
        HTTPException: If generation fails (400/500)
    """
    # Validate request parameters
    if not request.class_label.strip():
        raise HTTPException(status_code=400, detail="class_label cannot be empty")
    
    # Generate unique ID for this generation
    generation_id = str(uuid.uuid4())
    
    # Create output directory for this generation
    output_base_dir = "data/generations"
    output_dir = os.path.join(output_base_dir, generation_id)
    ensure_directory_exists(output_dir)
    
    start_time = time.time()
    
    try:
        # Generate multiple images based on output_size
        generated_files = []
        
        for i in range(request.output_size):
            # Create filename for this image
            filename = f"{request.class_label}_{i+1:03d}.png"
            file_path = os.path.join(output_dir, filename)
            
            # Create prompt based on class label and add some variation
            prompt = f"{request.class_label}, high quality, detailed"
            if i > 0:
                prompt += f", variation {i+1}"
            
            # Generate the image using the existing generator
            image, metadata = generator.generate(
                prompt=prompt,
                num_inference_steps=20,  # Fast generation for demo
                guidance_scale=7.5,
                width=512,
                height=512,
                seed=None  # Random seed for variation
            )
            
            # Save the image
            image.save(file_path)
            generated_files.append(file_path)
        
        generation_time = time.time() - start_time
        
        # Count generated files
        file_count = count_files_in_directory(output_dir, ['.png', '.jpg', '.jpeg'])
        
        # Get preview images (first 3)
        preview_images = get_preview_images(output_dir, max_count=3)
        
        # Create database record
        db_generation = Generation(
            id=generation_id,
            class_label=request.class_label,
            noise_level=request.noise_level,
            output_size=request.output_size,
            output_directory=output_dir,
            file_count=file_count,
            generation_time=generation_time,
            device_used=generator.device,
            is_successful=True
        )
        
        db.add(db_generation)
        db.commit()
        db.refresh(db_generation)
        
        # Return response with preview
        return GenerationResponse(
            id=generation_id,
            class_label=request.class_label,
            noise_level=request.noise_level,
            output_size=request.output_size,
            preview=preview_images,
            download_link=f"/download/{generation_id}"
        )
        
    except Exception as e:
        # Log failed generation attempt to database
        try:
            failed_generation = Generation(
                id=generation_id,
                class_label=request.class_label,
                noise_level=request.noise_level,
                output_size=request.output_size,
                output_directory=output_dir,
                file_count=0,
                generation_time=time.time() - start_time,
                device_used=getattr(generator, 'device', 'unknown'),
                is_successful=False,
                error_message=str(e)
            )
            db.add(failed_generation)
            db.commit()
        except Exception:
            # If database logging also fails, just pass
            pass
            
        raise HTTPException(
            status_code=500,
            detail=f"Image generation failed: {str(e)}"
        )


@app.get("/datasets", response_model=List[DatasetListResponse], tags=["Datasets"])
async def list_datasets(db: Session = Depends(get_db)) -> List[DatasetListResponse]:
    """List all generations from database.
    
    Returns list of all generations with metadata including id, class_label,
    noise_level, output_size, created_at, and file_count.
    
    Args:
        db: Database session dependency
        
    Returns:
        List of DatasetListResponse objects
        
    Raises:
        HTTPException: If database query fails (500)
    """
    try:
        # Query all generations from database
        generations = db.query(Generation).order_by(Generation.created_at.desc()).all()
        
        # Convert to response format
        response = []
        for gen in generations:
            response.append(DatasetListResponse(
                id=gen.id,
                class_label=gen.class_label,
                noise_level=gen.noise_level,
                output_size=gen.output_size,
                created_at=gen.created_at,
                file_count=gen.file_count
            ))
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch datasets: {str(e)}"
        )


@app.get("/preview/{id}", response_model=PreviewResponse, tags=["Preview"])
async def preview_dataset(id: str, db: Session = Depends(get_db)) -> PreviewResponse:
    """Return preview of first 3 samples from a generation.
    
    Returns decoded preview from saved files as base64 encoded PNGs.
    
    Args:
        id: Generation ID
        db: Database session dependency
        
    Returns:
        PreviewResponse with base64 encoded preview images
        
    Raises:
        HTTPException: If generation not found (404)
    """
    try:
        # Find generation in database
        generation = db.query(Generation).filter(Generation.id == id).first()
        
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        # Get preview images from the output directory
        preview_images = get_preview_images(generation.output_directory, max_count=3)
        
        return PreviewResponse(
            id=generation.id,
            class_label=generation.class_label,
            preview=preview_images
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get preview: {str(e)}"
        )


@app.get("/download/{id}", tags=["Download"])
async def download_dataset(id: str, db: Session = Depends(get_db)) -> FileResponse:
    """Return ZIP of generated files for a specific generation.
    
    Creates a ZIP archive containing all generated files for the specified
    generation and returns it for download.
    
    Args:
        id: Generation ID
        db: Database session dependency
        
    Returns:
        FileResponse with ZIP file
        
    Raises:
        HTTPException: If generation not found (404) or file creation fails (500)
    """
    try:
        # Find generation in database
        generation = db.query(Generation).filter(Generation.id == id).first()
        
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        if not generation.is_successful:
            raise HTTPException(status_code=404, detail="Generation was not successful")
        
        # Get all files in the generation directory
        if not os.path.exists(generation.output_directory):
            raise HTTPException(status_code=404, detail="Generated files not found")
        
        # Collect all image files
        image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp')
        file_paths = []
        
        for filename in os.listdir(generation.output_directory):
            if filename.lower().endswith(image_extensions):
                file_path = os.path.join(generation.output_directory, filename)
                if os.path.exists(file_path):
                    file_paths.append(file_path)
        
        if not file_paths:
            raise HTTPException(status_code=404, detail="No image files found")
        
        # Create temporary ZIP file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
            zip_path = temp_zip.name
        
        # Create ZIP archive
        success = create_zip_archive(file_paths, zip_path)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to create ZIP archive")
        
        # Return ZIP file as download
        return FileResponse(
            path=zip_path,
            media_type='application/zip',
            filename=f"{generation.class_label}_{generation.id}.zip"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create download: {str(e)}"
        )

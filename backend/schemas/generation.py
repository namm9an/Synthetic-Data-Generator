"""Pydantic schemas for synthetic data generation endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class GenerationRequest(BaseModel):
    """Request schema for synthetic data generation.
    
    Attributes:
        class_label: The class or category label for the synthetic data
        noise_level: Level of noise to add (0.0 to 1.0)
        output_size: Number of images to generate
    """
    class_label: str = Field(..., description="Class or category label for the synthetic data")
    noise_level: float = Field(0.1, ge=0.0, le=1.0, description="Noise level between 0.0 and 1.0")
    output_size: int = Field(1, ge=1, le=10, description="Number of images to generate")


class GenerationResponse(BaseModel):
    """Response schema for synthetic data generation.
    
    Attributes:
        id: Unique identifier for the generation
        class_label: The class label used for generation
        noise_level: Noise level applied
        output_size: Number of images generated
        preview: List of base64 encoded preview images (first 3)
        download_link: Link to download the full dataset
    """
    id: str
    class_label: str
    noise_level: float
    output_size: int
    preview: List[str] = Field(description="Base64 encoded preview images")
    download_link: str


class DatasetListResponse(BaseModel):
    """Response schema for listing datasets.
    
    Attributes:
        id: Unique identifier for the generation
        class_label: The class label used for generation
        noise_level: Noise level applied
        output_size: Number of images generated
        created_at: Timestamp when generated
        file_count: Number of files in the dataset
    """
    id: str
    class_label: str
    noise_level: float
    output_size: int
    created_at: datetime
    file_count: int


class PreviewResponse(BaseModel):
    """Response schema for dataset preview.
    
    Attributes:
        id: Generation ID
        class_label: The class label
        preview: List of base64 encoded preview images
    """
    id: str
    class_label: str
    preview: List[str]


class ErrorResponse(BaseModel):
    """Error response schema.
    
    Attributes:
        success: Always False for error responses
        error: Error message
        details: Optional additional error details
    """
    success: bool = False
    error: str
    details: Optional[str] = None

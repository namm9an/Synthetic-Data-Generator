"""SQLAlchemy model for generated image metadata.

This module defines the database schema for tracking generated synthetic images
and their associated metadata.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

from backend.config.database import Base


class GeneratedImage(Base):
    """Database model for storing generated image metadata.
    
    This table tracks all generated synthetic images along with their
    generation parameters and metadata.
    """
    
    __tablename__ = "generated_images"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Generation parameters
    prompt = Column(Text, nullable=False, comment="Text prompt used for generation")
    negative_prompt = Column(Text, nullable=True, comment="Negative prompt to avoid unwanted features")
    model_id = Column(String(255), nullable=False, comment="HuggingFace model identifier")
    
    # Image parameters
    width = Column(Integer, nullable=False, comment="Generated image width in pixels")
    height = Column(Integer, nullable=False, comment="Generated image height in pixels")
    
    # Generation settings
    num_inference_steps = Column(Integer, nullable=False, comment="Number of denoising steps")
    guidance_scale = Column(Float, nullable=False, comment="Guidance scale for prompt adherence")
    seed = Column(Integer, nullable=True, comment="Random seed for reproducible generation")
    
    # Performance metrics
    generation_time = Column(Float, nullable=False, comment="Time taken to generate image in seconds")
    device = Column(String(50), nullable=False, comment="Device used for generation (cuda/cpu)")
    
    # File information
    file_path = Column(String(500), nullable=True, comment="Relative path to saved image file")
    file_size = Column(Integer, nullable=True, comment="File size in bytes")
    
    # Status tracking
    is_successful = Column(Boolean, default=True, nullable=False, comment="Whether generation was successful")
    error_message = Column(Text, nullable=True, comment="Error message if generation failed")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self) -> str:
        """String representation of the GeneratedImage instance."""
        return f"<GeneratedImage(id={self.id}, prompt='{self.prompt[:50]}...', created_at={self.created_at})>"
    
    def to_dict(self) -> dict:
        """Convert the model instance to a dictionary.
        
        Returns:
            Dictionary representation of the generated image record.
        """
        return {
            "id": self.id,
            "prompt": self.prompt,
            "negative_prompt": self.negative_prompt,
            "model_id": self.model_id,
            "width": self.width,
            "height": self.height,
            "num_inference_steps": self.num_inference_steps,
            "guidance_scale": self.guidance_scale,
            "seed": self.seed,
            "generation_time": self.generation_time,
            "device": self.device,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "is_successful": self.is_successful,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

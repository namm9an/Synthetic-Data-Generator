"""SQLAlchemy model for generation metadata in Phase 3.

This module defines the database schema for tracking synthetic data generations
and their associated metadata.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.sql import func

from backend.config.database import Base


class Generation(Base):
    """Database model for storing generation metadata.
    
    This table tracks all synthetic data generations along with their
    generation parameters and metadata.
    """
    
    __tablename__ = "generations"
    
    # Primary key
    id = Column(String(36), primary_key=True, index=True)
    
    # Generation parameters
    class_label = Column(String(255), nullable=False, comment="Class label for the synthetic data")
    noise_level = Column(Float, nullable=False, comment="Noise level applied during generation")
    output_size = Column(Integer, nullable=False, comment="Number of images generated")
    
    # File information
    output_directory = Column(String(500), nullable=False, comment="Directory containing generated files")
    file_count = Column(Integer, nullable=False, default=0, comment="Number of files generated")
    
    # Generation metadata
    generation_time = Column(Float, nullable=False, comment="Time taken to generate dataset in seconds")
    device_used = Column(String(50), nullable=False, comment="Device used for generation (cuda/cpu)")
    
    # Status tracking
    is_successful = Column(Boolean, default=True, nullable=False, comment="Whether generation was successful")
    error_message = Column(Text, nullable=True, comment="Error message if generation failed")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self) -> str:
        """String representation of the Generation instance."""
        return f"<Generation(id={self.id}, class_label='{self.class_label}', output_size={self.output_size})>"
    
    def to_dict(self) -> dict:
        """Convert the model instance to a dictionary.
        
        Returns:
            Dictionary representation of the generation record.
        """
        return {
            "id": self.id,
            "class_label": self.class_label,
            "noise_level": self.noise_level,
            "output_size": self.output_size,
            "output_directory": self.output_directory,
            "file_count": self.file_count,
            "generation_time": self.generation_time,
            "device_used": self.device_used,
            "is_successful": self.is_successful,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

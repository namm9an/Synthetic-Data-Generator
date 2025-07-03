"""Synthetic data generator using diffusion models.

This module provides the SyntheticDataGenerator class that uses HuggingFace
Diffusers to generate high-fidelity synthetic images.
"""

import os
import logging
from typing import Optional, Dict, Any
from datetime import datetime
import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

# Set Hugging Face cache directory to D: drive
os.environ["HF_HOME"] = r"D:\Academics\.cache\huggingface"
os.environ["HUGGINGFACE_HUB_CACHE"] = r"D:\Academics\.cache\huggingface\hub"
os.environ["TRANSFORMERS_CACHE"] = r"D:\Academics\.cache\huggingface\transformers"
os.environ["HF_DATASETS_CACHE"] = r"D:\Academics\.cache\huggingface\datasets"


logger = logging.getLogger(__name__)


class SyntheticDataGenerator:
    """Generator class for creating synthetic images using diffusion models.
    
    This class handles loading pre-trained diffusion models and generating
    synthetic images based on text prompts.
    """
    
    def __init__(
        self,
        model_id: str = "runwayml/stable-diffusion-v1-5",
        device: Optional[str] = None,
        hf_token: Optional[str] = None
    ) -> None:
        """Initialize the synthetic data generator.
        
        Args:
            model_id: HuggingFace model identifier for the diffusion model.
            device: Device to run the model on ('cuda' or 'cpu'). Auto-detects if None.
            hf_token: HuggingFace authentication token for accessing private models.
        """
        self.model_id = model_id
        self.hf_token = hf_token or os.getenv("HF_TOKEN")
        
        # Auto-detect device if not specified
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
            
        logger.info(f"Initializing generator with model {model_id} on {self.device}")
        
        self.pipeline: Optional[StableDiffusionPipeline] = None
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the pre-trained diffusion model.
        
        Raises:
            RuntimeError: If model loading fails.
        """
        try:
            logger.info(f"Loading model {self.model_id}...")
            
            # Load the pipeline with authentication if token is provided
            if self.hf_token:
                self.pipeline = StableDiffusionPipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                    use_auth_token=self.hf_token
                )
            else:
                self.pipeline = StableDiffusionPipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
                )
            
            # Move model to specified device
            self.pipeline = self.pipeline.to(self.device)
            
            # Enable memory efficient attention if using CUDA
            if self.device == "cuda":
                self.pipeline.enable_attention_slicing()
                
            logger.info("Model loaded successfully")
            
        except Exception as e:
            error_msg = f"Failed to load model {self.model_id}: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg) from e
    
    def generate(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
        width: int = 512,
        height: int = 512,
        seed: Optional[int] = None
    ) -> tuple[Image.Image, Dict[str, Any]]:
        """Generate a synthetic image from a text prompt.
        
        Args:
            prompt: Text description of the desired image.
            negative_prompt: Text description of what to avoid in the image.
            num_inference_steps: Number of denoising steps.
            guidance_scale: How closely to follow the prompt (higher = more strict).
            width: Width of the generated image.
            height: Height of the generated image.
            seed: Random seed for reproducible generation.
            
        Returns:
            A tuple containing:
                - The generated PIL Image
                - Metadata dictionary with generation parameters
                
        Raises:
            RuntimeError: If generation fails or model is not loaded.
        """
        if self.pipeline is None:
            raise RuntimeError("Model not loaded. Call _load_model() first.")
        
        try:
            logger.info(f"Generating image with prompt: '{prompt[:50]}...'")
            
            # Set random seed if provided
            generator = None
            if seed is not None:
                generator = torch.Generator(device=self.device).manual_seed(seed)
            
            # Generate the image
            start_time = datetime.now()
            
            with torch.autocast(self.device):
                result = self.pipeline(
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    width=width,
                    height=height,
                    generator=generator
                )
            
            end_time = datetime.now()
            generation_time = (end_time - start_time).total_seconds()
            
            # Prepare metadata
            metadata = {
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "num_inference_steps": num_inference_steps,
                "guidance_scale": guidance_scale,
                "width": width,
                "height": height,
                "seed": seed,
                "model_id": self.model_id,
                "device": self.device,
                "generation_time": generation_time,
                "timestamp": end_time.isoformat()
            }
            
            logger.info(f"Image generated successfully in {generation_time:.2f}s")
            
            return result.images[0], metadata
            
        except Exception as e:
            error_msg = f"Failed to generate image: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg) from e
    
    def is_ready(self) -> bool:
        """Check if the generator is ready to generate images.
        
        Returns:
            True if the model is loaded and ready, False otherwise.
        """
        return self.pipeline is not None

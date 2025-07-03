"""Utility functions for the synthetic data generator backend."""

import base64
import io
import os
import zipfile
from typing import List, Optional
from PIL import Image


def base64_encode_image(image_path: str) -> Optional[str]:
    """Encode an image file to base64 string.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Base64 encoded string or None if file doesn't exist
    """
    try:
        if not os.path.exists(image_path):
            return None
            
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            base64_string = base64.b64encode(image_data).decode('utf-8')
            return base64_string
    except Exception:
        return None


def create_zip_archive(file_paths: List[str], zip_path: str) -> bool:
    """Create a ZIP archive from a list of files.
    
    Args:
        file_paths: List of file paths to include in the ZIP
        zip_path: Path where the ZIP file should be created
        
    Returns:
        True if successful, False otherwise
    """
    try:
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in file_paths:
                if os.path.exists(file_path):
                    # Add file to ZIP with just the filename (not full path)
                    zipf.write(file_path, os.path.basename(file_path))
        return True
    except Exception:
        return False


def get_preview_images(directory: str, max_count: int = 3) -> List[str]:
    """Get base64 encoded preview images from a directory.
    
    Args:
        directory: Directory containing images
        max_count: Maximum number of preview images to return
        
    Returns:
        List of base64 encoded image strings
    """
    previews = []
    
    if not os.path.exists(directory):
        return previews
    
    # Get all image files
    image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp')
    image_files = []
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(image_extensions):
            image_files.append(os.path.join(directory, filename))
    
    # Sort files and take first max_count
    image_files.sort()
    
    for image_path in image_files[:max_count]:
        base64_image = base64_encode_image(image_path)
        if base64_image:
            previews.append(base64_image)
    
    return previews


def ensure_directory_exists(directory: str) -> None:
    """Ensure a directory exists, creating it if necessary.
    
    Args:
        directory: Directory path to create
    """
    os.makedirs(directory, exist_ok=True)


def count_files_in_directory(directory: str, extensions: Optional[List[str]] = None) -> int:
    """Count files in a directory with optional extension filtering.
    
    Args:
        directory: Directory to count files in
        extensions: List of file extensions to count (e.g., ['.png', '.jpg'])
        
    Returns:
        Number of files found
    """
    if not os.path.exists(directory):
        return 0
    
    count = 0
    for filename in os.listdir(directory):
        if extensions:
            if any(filename.lower().endswith(ext) for ext in extensions):
                count += 1
        else:
            if os.path.isfile(os.path.join(directory, filename)):
                count += 1
    
    return count

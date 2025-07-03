#!/usr/bin/env python3
"""Startup script for the Synthetic Data Generator API server.

This script handles the server startup including database initialization,
model loading, and directory setup.
"""

import os
import sys
import logging
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def setup_directories():
    """Create necessary directories for the application."""
    directories = [
        "data/generations",
        "data/output",
        "logs"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        logger.info(f"Directory ensured: {directory}")

def main():
    """Main startup function."""
    logger.info("Starting Synthetic Data Generator API server...")
    
    # Ensure required directories exist
    setup_directories()
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        logger.warning(".env file not found. Using default settings.")
        logger.warning("Please create .env file with your database credentials.")
    
    # Import and start the server
    try:
        import uvicorn
        from config.settings import get_settings
        
        settings = get_settings()
        
        logger.info(f"Server configuration:")
        logger.info(f"  Host: {settings.app_host}")
        logger.info(f"  Port: {settings.app_port}")
        logger.info(f"  Environment: {settings.app_env}")
        logger.info(f"  Model: {settings.model_name}")
        
        # Start the server
        uvicorn.run(
            "main:app",
            host=settings.app_host,
            port=settings.app_port,
            reload=settings.debug,
            log_level=settings.log_level.lower()
        )
        
    except ImportError as e:
        logger.error(f"Missing dependencies: {e}")
        logger.error("Please install required packages: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

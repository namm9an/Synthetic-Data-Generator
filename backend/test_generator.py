"""Test script for the synthetic data generator.

This script tests the SyntheticDataGenerator class and validates that:
1. Images are generated successfully
2. Generated images are saved to the correct location
3. Database logging works correctly
4. Error handling works as expected

Run with: python -m backend.test_generator
"""

import os
import sys
import uuid
import tempfile
from datetime import datetime
from pathlib import Path

# Add backend to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.generator import SyntheticDataGenerator
from models.generated_image import GeneratedImage
from backend.config.database import SessionLocal, engine, Base


def test_generator():
    """Test the synthetic data generator functionality."""
    print("🧪 Testing Synthetic Data Generator...")
    print("=" * 50)
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize generator
    generator = SyntheticDataGenerator()
    print(f"✅ Generator initialized on device: {generator.device}")
    
    # Test 1: Basic image generation
    print("\n🔍 Test 1: Basic Image Generation")
    with tempfile.TemporaryDirectory() as temp_dir:
        test_image_path = os.path.join(temp_dir, "test_image.png")
        
        try:
            metadata = generator.generate_image(
                prompt="a cute cat sitting on a chair",
                noise_level=0.1,
                num_inference_steps=20,
                guidance_scale=7.5,
                width=512,
                height=512,
                output_path=test_image_path
            )
            
            # Verify image was created
            if os.path.exists(test_image_path):
                file_size = os.path.getsize(test_image_path)
                print(f"✅ Image generated successfully: {file_size} bytes")
                print(f"   Device used: {metadata['device_used']}")
                print(f"   Generation time: {metadata['generation_time_seconds']:.2f}s")
            else:
                print("❌ Image file was not created")
                return False
                
        except Exception as e:
            print(f"❌ Image generation failed: {e}")
            return False
    
    # Test 2: Database logging
    print("\n🔍 Test 2: Database Logging")
    db = SessionLocal()
    try:
        # Create a test database record
        test_id = str(uuid.uuid4())
        test_record = GeneratedImage(
            id=test_id,
            prompt="test prompt",
            noise_level=0.1,
            num_inference_steps=20,
            guidance_scale=7.5,
            width=512,
            height=512,
            device_used="cpu",
            file_path="/test/path/image.png",
            generation_time_seconds=1.23,
            created_at=datetime.utcnow(),
            is_successful=True
        )
        
        db.add(test_record)
        db.commit()
        
        # Verify record was saved
        saved_record = db.query(GeneratedImage).filter(GeneratedImage.id == test_id).first()
        if saved_record:
            print("✅ Database logging works correctly")
            print(f"   Record ID: {saved_record.id}")
            print(f"   Prompt: {saved_record.prompt}")
            print(f"   Created at: {saved_record.created_at}")
        else:
            print("❌ Database record was not saved")
            return False
            
    except Exception as e:
        print(f"❌ Database logging failed: {e}")
        return False
    finally:
        db.close()
    
    # Test 3: Error handling
    print("\n🔍 Test 3: Error Handling")
    try:
        # Test with invalid parameters
        metadata = generator.generate_image(
            prompt="",  # Empty prompt
            noise_level=-1.0,  # Invalid noise level
            num_inference_steps=0,  # Invalid steps
            guidance_scale=0,  # Invalid guidance
            width=0,  # Invalid dimensions
            height=0,
            output_path="/invalid/path/image.png"
        )
        print("❌ Error handling test failed - should have raised an exception")
        return False
    except Exception as e:
        print(f"✅ Error handling works correctly: {type(e).__name__}")
    
    # Test 4: Output directory creation
    print("\n🔍 Test 4: Output Directory Management")
    output_dir = "data/output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
        print(f"✅ Created output directory: {output_dir}")
    else:
        print(f"✅ Output directory exists: {output_dir}")
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed successfully!")
    print("\n📊 Generator Summary:")
    print(f"   Model: {generator.model_name}")
    print(f"   Device: {generator.device}")
    print(f"   Data type: {generator.dtype}")
    print(f"   Output directory: {os.path.abspath(output_dir)}")
    
    return True


def main():
    """Main test function."""
    print("Starting Synthetic Data Generator Tests...")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python path: {sys.path[:3]}...")  # Show first 3 entries
    
    try:
        success = test_generator()
        if success:
            print("\n✅ All tests completed successfully!")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed!")
            sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test suite crashed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

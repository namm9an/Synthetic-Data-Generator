#!/usr/bin/env python3
"""Comprehensive API test script for Phase 3 endpoints.

Tests all API endpoints manually to verify functionality:
- POST /generate
- GET /datasets 
- GET /preview/{id}
- GET /download/{id}
- GET /health
"""

import sys
import time
import requests
import json
import base64
from io import BytesIO
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API Configuration
BASE_URL = "http://127.0.0.1:8000"
TIMEOUT = 120  # seconds for generation requests

class APITester:
    """API testing class for all endpoints."""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.test_results = {}
        
    def test_health_endpoint(self) -> bool:
        """Test the health check endpoint."""
        logger.info("🔍 Testing /health endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "OK":
                    logger.info("✅ Health check passed")
                    return True
                else:
                    logger.error(f"❌ Health check failed: {data}")
                    return False
            else:
                logger.error(f"❌ Health check returned status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Health check failed with exception: {e}")
            return False
    
    def test_generate_endpoint(self) -> str:
        """Test the generation endpoint and return generation ID."""
        logger.info("🔍 Testing POST /generate endpoint...")
        
        # Test payload
        test_request = {
            "class_label": "cute cat",
            "noise_level": 0.1,
            "output_size": 2
        }
        
        try:
            logger.info(f"Sending generation request: {test_request}")
            response = requests.post(
                f"{self.base_url}/generate",
                json=test_request,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["id", "class_label", "noise_level", "output_size", "preview", "download_link"]
                for field in required_fields:
                    if field not in data:
                        logger.error(f"❌ Missing field in response: {field}")
                        return None
                
                # Validate preview images
                if len(data["preview"]) == 0:
                    logger.error("❌ No preview images returned")
                    return None
                
                # Try to decode first preview image
                try:
                    preview_data = base64.b64decode(data["preview"][0])
                    img = Image.open(BytesIO(preview_data))
                    logger.info(f"✅ Preview image decoded successfully: {img.size}")
                except Exception as e:
                    logger.error(f"❌ Failed to decode preview image: {e}")
                    return None
                
                logger.info(f"✅ Generation successful: ID = {data['id']}")
                logger.info(f"   Generated {len(data['preview'])} preview images")
                logger.info(f"   Download link: {data['download_link']}")
                
                return data["id"]
            else:
                logger.error(f"❌ Generation failed with status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Generation failed with exception: {e}")
            return None
    
    def test_datasets_endpoint(self) -> bool:
        """Test the datasets listing endpoint."""
        logger.info("🔍 Testing GET /datasets endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/datasets", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    logger.info(f"✅ Datasets endpoint returned {len(data)} generations")
                    
                    if len(data) > 0:
                        # Validate first dataset structure
                        first_dataset = data[0]
                        required_fields = ["id", "class_label", "noise_level", "output_size", "created_at", "file_count"]
                        
                        for field in required_fields:
                            if field not in first_dataset:
                                logger.error(f"❌ Missing field in dataset: {field}")
                                return False
                        
                        logger.info(f"   First dataset: {first_dataset['class_label']} ({first_dataset['file_count']} files)")
                    
                    return True
                else:
                    logger.error(f"❌ Datasets endpoint returned non-list data: {type(data)}")
                    return False
            else:
                logger.error(f"❌ Datasets endpoint failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Datasets endpoint failed with exception: {e}")
            return False
    
    def test_preview_endpoint(self, generation_id: str) -> bool:
        """Test the preview endpoint with a specific generation ID."""
        if not generation_id:
            logger.warning("⚠️ Skipping preview test - no generation ID provided")
            return False
            
        logger.info(f"🔍 Testing GET /preview/{generation_id} endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/preview/{generation_id}", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["id", "class_label", "preview"]
                for field in required_fields:
                    if field not in data:
                        logger.error(f"❌ Missing field in preview response: {field}")
                        return False
                
                # Validate preview images
                if len(data["preview"]) == 0:
                    logger.error("❌ No preview images returned")
                    return False
                
                # Try to decode preview images
                valid_images = 0
                for i, preview_b64 in enumerate(data["preview"]):
                    try:
                        preview_data = base64.b64decode(preview_b64)
                        img = Image.open(BytesIO(preview_data))
                        valid_images += 1
                    except Exception as e:
                        logger.warning(f"⚠️ Failed to decode preview image {i}: {e}")
                
                if valid_images > 0:
                    logger.info(f"✅ Preview endpoint successful: {valid_images} valid images")
                    return True
                else:
                    logger.error("❌ No valid preview images found")
                    return False
                
            elif response.status_code == 404:
                logger.error(f"❌ Preview not found for generation {generation_id}")
                return False
            else:
                logger.error(f"❌ Preview endpoint failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Preview endpoint failed with exception: {e}")
            return False
    
    def test_download_endpoint(self, generation_id: str) -> bool:
        """Test the download endpoint with a specific generation ID."""
        if not generation_id:
            logger.warning("⚠️ Skipping download test - no generation ID provided")
            return False
            
        logger.info(f"🔍 Testing GET /download/{generation_id} endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/download/{generation_id}", timeout=60)
            
            if response.status_code == 200:
                # Check if response is a ZIP file
                content_type = response.headers.get('content-type', '')
                content_disposition = response.headers.get('content-disposition', '')
                
                if 'application/zip' in content_type or 'zip' in content_disposition:
                    file_size = len(response.content)
                    logger.info(f"✅ Download endpoint successful: ZIP file ({file_size} bytes)")
                    return True
                else:
                    logger.error(f"❌ Download response is not a ZIP file: {content_type}")
                    return False
                
            elif response.status_code == 404:
                logger.error(f"❌ Download not found for generation {generation_id}")
                return False
            else:
                logger.error(f"❌ Download endpoint failed with status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Download endpoint failed with exception: {e}")
            return False
    
    def test_error_handling(self) -> bool:
        """Test error handling with invalid requests."""
        logger.info("🔍 Testing error handling...")
        
        # Test invalid generation request
        try:
            invalid_request = {
                "class_label": "",  # Empty label should fail
                "noise_level": 2.0,  # Invalid noise level
                "output_size": 0     # Invalid size
            }
            
            response = requests.post(
                f"{self.base_url}/generate",
                json=invalid_request,
                timeout=30
            )
            
            if response.status_code == 400:
                logger.info("✅ Error handling works: 400 for invalid request")
            else:
                logger.warning(f"⚠️ Expected 400 for invalid request, got {response.status_code}")
            
        except Exception as e:
            logger.warning(f"⚠️ Error handling test failed: {e}")
        
        # Test non-existent preview
        try:
            response = requests.get(f"{self.base_url}/preview/non-existent-id", timeout=10)
            
            if response.status_code == 404:
                logger.info("✅ Error handling works: 404 for non-existent preview")
                return True
            else:
                logger.warning(f"⚠️ Expected 404 for non-existent preview, got {response.status_code}")
                return False
                
        except Exception as e:
            logger.warning(f"⚠️ Error handling test failed: {e}")
            return False
    
    def run_all_tests(self) -> dict:
        """Run all API tests and return results."""
        logger.info("🚀 Starting comprehensive API tests...")
        logger.info("=" * 60)
        
        results = {}
        
        # Test 1: Health check
        results["health"] = self.test_health_endpoint()
        
        # Test 2: Generation (this may take a while)
        generation_id = self.test_generate_endpoint()
        results["generate"] = generation_id is not None
        
        # Wait a moment for database consistency
        if generation_id:
            time.sleep(2)
        
        # Test 3: List datasets
        results["datasets"] = self.test_datasets_endpoint()
        
        # Test 4: Preview (requires generation_id)
        results["preview"] = self.test_preview_endpoint(generation_id)
        
        # Test 5: Download (requires generation_id)
        results["download"] = self.test_download_endpoint(generation_id)
        
        # Test 6: Error handling
        results["error_handling"] = self.test_error_handling()
        
        # Summary
        logger.info("=" * 60)
        logger.info("📊 TEST RESULTS SUMMARY:")
        logger.info("=" * 60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            logger.info(f"  {test_name.upper():15} {status}")
        
        logger.info("-" * 60)
        logger.info(f"  TOTAL:           {passed}/{total} PASSED")
        
        if passed == total:
            logger.info("🎉 ALL TESTS PASSED! Phase 3 is fully functional.")
        else:
            logger.warning(f"⚠️ {total - passed} tests failed. Check logs above.")
        
        return results

def main():
    """Main test function."""
    try:
        # Check if server is running
        logger.info("Checking if API server is running...")
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            logger.error("❌ API server is not responding correctly")
            sys.exit(1)
    except Exception:
        logger.error("❌ API server is not running!")
        logger.error("Please start the server first: python run_server.py")
        sys.exit(1)
    
    # Run tests
    tester = APITester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()

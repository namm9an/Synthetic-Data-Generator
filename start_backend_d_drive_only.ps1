# D: Drive Python Backend Startup Script for Synthetic Data Generator
# Uses global Python installation with D: drive packages

Write-Host "Starting Synthetic Data Generator Backend (D: Drive Setup)..." -ForegroundColor Green

# Set environment variables for Hugging Face cache on D: drive
$env:HF_HOME = "D:\Academics\.cache\huggingface"
$env:HUGGINGFACE_HUB_CACHE = "D:\Academics\.cache\huggingface\hub"
$env:TRANSFORMERS_CACHE = "D:\Academics\.cache\huggingface\transformers"
$env:HF_DATASETS_CACHE = "D:\Academics\.cache\huggingface\datasets"

Write-Host "Hugging Face cache configured to D: drive:" -ForegroundColor Green
Write-Host "  HF_HOME: $env:HF_HOME" -ForegroundColor Cyan
Write-Host "  HUGGINGFACE_HUB_CACHE: $env:HUGGINGFACE_HUB_CACHE" -ForegroundColor Cyan
Write-Host "  TRANSFORMERS_CACHE: $env:TRANSFORMERS_CACHE" -ForegroundColor Cyan
Write-Host "  HF_DATASETS_CACHE: $env:HF_DATASETS_CACHE" -ForegroundColor Cyan

# Create HF cache directories if they don't exist
$hfCacheDirectories = @(
    $env:HF_HOME,
    $env:HUGGINGFACE_HUB_CACHE,
    $env:TRANSFORMERS_CACHE,
    $env:HF_DATASETS_CACHE
)

foreach ($dir in $hfCacheDirectories) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating directory: $dir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "`n✅ Hugging Face cache configured to use D: drive!" -ForegroundColor Green

# Check if required packages are available on D: drive
Write-Host "`nChecking if required packages are available on D: drive..." -ForegroundColor Yellow
try {
    python -c "import torch; print(f'✅ PyTorch {torch.__version__} found on D: drive')"
    python -c "import diffusers; print(f'✅ Diffusers found on D: drive')"
    python -c "import fastapi; print(f'✅ FastAPI found on D: drive')"
    python -c "import uvicorn; print(f'✅ Uvicorn found on D: drive')"
    python -c "import sys; d_drive_paths = [p for p in sys.path if 'D:' in p]; print(f'✅ D: drive paths: {len(d_drive_paths)} found')"
} catch {
    Write-Host "❌ Some required packages not found on D: drive." -ForegroundColor Red
    Write-Host "Please install requirements to D: drive using:" -ForegroundColor Yellow
    Write-Host "  pip install -r backend/requirements.txt" -ForegroundColor Cyan
    Read-Host "Press Enter to continue anyway or Ctrl+C to exit"
}

# Change to backend directory
Write-Host "`nChanging to backend directory..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Start the backend server
Write-Host "`nStarting FastAPI backend server..." -ForegroundColor Green
Write-Host "The backend will use:" -ForegroundColor White
Write-Host "  - Global Python with D: drive packages" -ForegroundColor Gray
Write-Host "  - D: drive for Hugging Face model cache" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray

try {
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
} catch {
    Write-Host "`n❌ Failed to start backend server: $_" -ForegroundColor Red
    Write-Host "Make sure you have installed the requirements to D: drive:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Cyan
} finally {
    # Return to original directory
    Set-Location -Path ".."
    Write-Host "`nBackend server stopped." -ForegroundColor Yellow
}

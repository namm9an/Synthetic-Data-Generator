# Hybrid startup script for Synthetic Data Generator Backend
# Uses virtual environment for PyTorch compatibility, but D: drive for Hugging Face cache

Write-Host "Starting Synthetic Data Generator Backend (Hybrid Mode)..." -ForegroundColor Green

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

# Check if virtual environment exists and activate it
$venvPath = ".\venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "`nActivating virtual environment for PyTorch compatibility..." -ForegroundColor Yellow
    & $venvPath
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Virtual environment not found at .\venv\" -ForegroundColor Red
    Write-Host "Attempting to use global Python..." -ForegroundColor Yellow
}

# Change to backend directory
Write-Host "`nChanging to backend directory..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Check if required packages are available
Write-Host "`nChecking if required packages are available..." -ForegroundColor Yellow
try {
    python -c "import torch; print(f'✅ PyTorch {torch.__version__} found')"
    python -c "import diffusers; print(f'✅ Diffusers found')"
    python -c "import fastapi; print(f'✅ FastAPI found')"
    python -c "import uvicorn; print(f'✅ Uvicorn found')"
} catch {
    Write-Host "❌ Some required packages not found." -ForegroundColor Red
    Write-Host "Please install requirements in the virtual environment:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Cyan
    Read-Host "Press Enter to continue anyway or Ctrl+C to exit"
}

# Start the backend server
Write-Host "`nStarting FastAPI backend server..." -ForegroundColor Green
Write-Host "The backend will use:" -ForegroundColor White
Write-Host "  - Virtual environment packages (for PyTorch compatibility)" -ForegroundColor Gray
Write-Host "  - D: drive for Hugging Face model cache" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray

try {
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
} catch {
    Write-Host "`n❌ Failed to start backend server: $_" -ForegroundColor Red
    Write-Host "Make sure you have installed the requirements:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Cyan
} finally {
    # Return to original directory
    Set-Location -Path ".."
    Write-Host "`nBackend server stopped." -ForegroundColor Yellow
}

# Combined PowerShell script to configure Hugging Face cache to D: drive and start backend
# This ensures the backend uses the existing cache on D: drive instead of reinstalling to C: drive

Write-Host "=== Synthetic Data Generator Backend Startup ===" -ForegroundColor Magenta
Write-Host "Configuring Hugging Face cache to use D: drive..." -ForegroundColor Green

# Set environment variables for current session
$env:HF_HOME = "D:\Academics\.cache\huggingface"
$env:HUGGINGFACE_HUB_CACHE = "D:\Academics\.cache\huggingface\hub"
$env:TRANSFORMERS_CACHE = "D:\Academics\.cache\huggingface\transformers"
$env:HF_DATASETS_CACHE = "D:\Academics\.cache\huggingface\datasets"

Write-Host "Environment variables configured:" -ForegroundColor Green
Write-Host "  HF_HOME: $env:HF_HOME" -ForegroundColor Cyan
Write-Host "  HUGGINGFACE_HUB_CACHE: $env:HUGGINGFACE_HUB_CACHE" -ForegroundColor Cyan
Write-Host "  TRANSFORMERS_CACHE: $env:TRANSFORMERS_CACHE" -ForegroundColor Cyan
Write-Host "  HF_DATASETS_CACHE: $env:HF_DATASETS_CACHE" -ForegroundColor Cyan

# Create cache directories if they don't exist
$cacheDirectories = @(
    $env:HF_HOME,
    $env:HUGGINGFACE_HUB_CACHE,
    $env:TRANSFORMERS_CACHE,
    $env:HF_DATASETS_CACHE
)

foreach ($dir in $cacheDirectories) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating directory: $dir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "`n✅ Hugging Face cache is configured to use D: drive!" -ForegroundColor Green

# Check if virtual environment exists
$venvPath = ".\venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "`nActivating virtual environment..." -ForegroundColor Yellow
    & $venvPath
} else {
    Write-Host "`n⚠️  Virtual environment not found at .\venv\" -ForegroundColor Red
    Write-Host "Please make sure you've created the virtual environment first." -ForegroundColor Red
    Read-Host "Press Enter to continue anyway or Ctrl+C to exit"
}

# Change to backend directory
Write-Host "`nChanging to backend directory..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Start the backend server
Write-Host "`nStarting FastAPI backend server..." -ForegroundColor Green
Write-Host "The backend will now use the existing Hugging Face cache on D: drive." -ForegroundColor White
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

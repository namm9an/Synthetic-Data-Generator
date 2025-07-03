# Startup script for Synthetic Data Generator Backend
# Configures everything to use D: drive - Hugging Face cache AND Python packages

Write-Host "Starting Synthetic Data Generator Backend..." -ForegroundColor Green

# Set environment variables for current session - Hugging Face cache
$env:HF_HOME = "D:\Academics\.cache\huggingface"
$env:HUGGINGFACE_HUB_CACHE = "D:\Academics\.cache\huggingface\hub"
$env:TRANSFORMERS_CACHE = "D:\Academics\.cache\huggingface\transformers"
$env:HF_DATASETS_CACHE = "D:\Academics\.cache\huggingface\datasets"

# Set environment variables for Python packages on D: drive
$env:PYTHONPATH = "D:\PythonPackages\lib\site-packages;$env:PYTHONPATH"
$env:PIP_TARGET = "D:\PythonPackages\lib\site-packages"
$env:PIP_CACHE_DIR = "D:\PythonPackages\pip-cache"

Write-Host "Environment variables configured:" -ForegroundColor Green
Write-Host "  HF_HOME: $env:HF_HOME" -ForegroundColor Cyan
Write-Host "  HUGGINGFACE_HUB_CACHE: $env:HUGGINGFACE_HUB_CACHE" -ForegroundColor Cyan
Write-Host "  TRANSFORMERS_CACHE: $env:TRANSFORMERS_CACHE" -ForegroundColor Cyan
Write-Host "  HF_DATASETS_CACHE: $env:HF_DATASETS_CACHE" -ForegroundColor Cyan
Write-Host "  PYTHONPATH: D:\PythonPackages\lib\site-packages (prepended)" -ForegroundColor Cyan
Write-Host "  PIP_TARGET: $env:PIP_TARGET" -ForegroundColor Cyan
Write-Host "  PIP_CACHE_DIR: $env:PIP_CACHE_DIR" -ForegroundColor Cyan

# Create cache directories if they don't exist
$cacheDirectories = @(
    $env:HF_HOME,
    $env:HUGGINGFACE_HUB_CACHE,
    $env:TRANSFORMERS_CACHE,
    $env:HF_DATASETS_CACHE,
    $env:PIP_TARGET,
    $env:PIP_CACHE_DIR
)

foreach ($dir in $cacheDirectories) {
    if (-not (Test-Path $dir)) {
        Write-Host "Creating directory: $dir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host "`n✅ All caches configured to use D: drive!" -ForegroundColor Green

# Check if packages are installed on D: drive
$packagePath = "D:\PythonPackages\lib\site-packages"
if (Test-Path $packagePath) {
    $packageCount = (Get-ChildItem $packagePath | Measure-Object).Count
    if ($packageCount -gt 0) {
        Write-Host "✅ Found $packageCount package directories on D: drive" -ForegroundColor Green
    } else {
        Write-Host "⚠️  D: drive package directory exists but is empty" -ForegroundColor Yellow
        Write-Host "Run the installation script first: .\install_dependencies_to_d.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  D: drive package directory doesn't exist yet" -ForegroundColor Yellow
    Write-Host "Run the installation script first: .\install_dependencies_to_d.ps1" -ForegroundColor Yellow
}

# Don't use virtual environment - we're using global Python with D: drive packages
Write-Host "`nSkipping virtual environment - using D: drive packages instead" -ForegroundColor Yellow

# Change to backend directory
Write-Host "`nChanging to backend directory..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Check if required packages are available
Write-Host "`nChecking if required packages are available..." -ForegroundColor Yellow
try {
    python -c "import fastapi, uvicorn; print('✅ Required packages found')"
} catch {
    Write-Host "❌ Required packages not found. Installing to D: drive..." -ForegroundColor Red
    Write-Host "Installing requirements to D: drive..." -ForegroundColor Yellow
    
    # Install packages to D: drive
    pip install --target="D:\PythonPackages\lib\site-packages" -r requirements.txt
    
    Write-Host "✅ Packages installed to D: drive" -ForegroundColor Green
}

# Start the backend server
Write-Host "`nStarting FastAPI backend server..." -ForegroundColor Green
Write-Host "The backend will use packages and cache from D: drive." -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray

try {
    # Use python directly since we're not using venv
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
} catch {
    Write-Host "`n❌ Failed to start backend server: $_" -ForegroundColor Red
    Write-Host "Make sure you have installed the requirements to D: drive:" -ForegroundColor Yellow
    Write-Host "  .\install_dependencies_to_d.ps1" -ForegroundColor Cyan
} finally {
    # Return to original directory
    Set-Location -Path ".."
    Write-Host "`nBackend server stopped." -ForegroundColor Yellow
}

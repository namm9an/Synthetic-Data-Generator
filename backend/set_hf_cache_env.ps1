# PowerShell script to set Hugging Face cache environment variables to D: drive
# Run this script before starting the backend to ensure all processes use D: drive

Write-Host "Setting Hugging Face cache environment variables..." -ForegroundColor Green

# Set environment variables for current session
$env:HF_HOME = "D:\Academics\.cache\huggingface"
$env:HUGGINGFACE_HUB_CACHE = "D:\Academics\.cache\huggingface\hub"
$env:TRANSFORMERS_CACHE = "D:\Academics\.cache\huggingface\transformers"
$env:HF_DATASETS_CACHE = "D:\Academics\.cache\huggingface\datasets"

Write-Host "Environment variables set successfully:" -ForegroundColor Green
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

Write-Host "`nHugging Face cache is now configured to use D: drive!" -ForegroundColor Green
Write-Host "You can now run the backend and it will use the existing cache on D: drive." -ForegroundColor White

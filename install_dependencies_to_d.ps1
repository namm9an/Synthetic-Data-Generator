# Script to install all dependencies to the D: drive
$requirementsFile = "D:\Academics\Synthetic-Data-Generator\backend\requirements.txt"
$targetDir = "D:\PythonPackages\lib\site-packages"
$cacheDir = "D:\PythonPackages\pip-cache"

Write-Host "Installing Python packages to D: drive..." -ForegroundColor Green
Write-Host "Target directory: $targetDir" -ForegroundColor Cyan
Write-Host "Cache directory: $cacheDir" -ForegroundColor Cyan

# Ensure target and cache directories exist
foreach ($dir in @($targetDir, $cacheDir)) {
    if (!(Test-Path $dir)) {
        Write-Host "Creating directory: $dir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Set environment variables for this session
$env:PIP_TARGET = $targetDir
$env:PIP_CACHE_DIR = $cacheDir

# Check if requirements file exists
if (!(Test-Path $requirementsFile)) {
    Write-Host "❌ Requirements file not found: $requirementsFile" -ForegroundColor Red
    exit 1
}

Write-Host "`nInstalling all requirements at once..." -ForegroundColor Yellow
try {
    # Install all requirements at once (more efficient)
    pip install --target=$targetDir --cache-dir=$cacheDir -r $requirementsFile --upgrade
    
    Write-Host "`n✅ All dependencies installed successfully to $targetDir" -ForegroundColor Green
    
    # Show installed packages
    $packageCount = (Get-ChildItem $targetDir -Directory | Measure-Object).Count
    Write-Host "📦 Total packages installed: $packageCount" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ Failed to install dependencies: $_" -ForegroundColor Red
    Write-Host "Trying individual package installation as fallback..." -ForegroundColor Yellow
    
    # Fallback: install packages individually
    $dependencies = Get-Content $requirementsFile
    $successCount = 0
    $failedPackages = @()
    
    foreach ($dep in $dependencies) {
        if ($dep -ne "" -and !$dep.StartsWith("#")) {
            Write-Host "Installing $dep..." -ForegroundColor White
            try {
                pip install --target=$targetDir --cache-dir=$cacheDir $dep --upgrade
                $successCount++
                Write-Host "  ✅ $dep installed" -ForegroundColor Green
            } catch {
                $failedPackages += $dep
                Write-Host "  ❌ Failed to install $dep" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "`n📊 Installation Summary:" -ForegroundColor Yellow
    Write-Host "  ✅ Successful: $successCount packages" -ForegroundColor Green
    if ($failedPackages.Count -gt 0) {
        Write-Host "  ❌ Failed: $($failedPackages.Count) packages" -ForegroundColor Red
        Write-Host "  Failed packages: $($failedPackages -join ', ')" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Ready to start backend with D: drive packages!" -ForegroundColor Green
Write-Host "Use: .\start_backend_d_drive_fixed.ps1" -ForegroundColor Cyan

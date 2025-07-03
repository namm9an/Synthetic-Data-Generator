# Script to install all dependencies to the D: drive
$requirementsFile = "D:\Academics\Synthetic-Data-Generator\backend\requirements.txt"
$targetDir = "D:\PythonPackages\lib\site-packages"

# Ensure target directory exists
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# Read requirements file and install each package
$dependencies = Get-Content $requirementsFile
foreach ($dep in $dependencies) {
    if ($dep -ne "") {
        Write-Host "Installing $dep to $targetDir..."
        pip install --target=$targetDir $dep
    }
}

Write-Host "All dependencies installed to $targetDir"

param (
    [Parameter(Mandatory=$true)]
    [string]$PackageName
)

# Install the package to the D:\ drive
pip install --target=D:\PythonPackages\lib\site-packages $PackageName

Write-Host "Package $PackageName installed to D:\PythonPackages\lib\site-packages"

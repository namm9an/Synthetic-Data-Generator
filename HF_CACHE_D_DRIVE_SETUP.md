# Hugging Face Cache Configuration

This guide explains how to configure Hugging Face models cache to use D: drive for optimized storage.

## Overview

By default, Hugging Face downloads models to `C:\Users\{username}\.cache\huggingface`. This configuration redirects the cache to D: drive to save space and improve performance.

## Quick Setup

### Automated Setup (Recommended)
```powershell
.\start_backend_d_drive.ps1
```

### Manual Setup
```powershell
# Set environment variables
.\set_hf_cache_env.ps1

# Start backend
cd backend
uvicorn main:app --reload
```

## Manual Usage

If you prefer to run the backend manually:

1. First, set the environment variables:
```powershell
.\set_hf_cache_env.ps1
```

2. Activate your virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

3. Start the backend:
```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Cache Locations
The following directories on D: drive will be used:
- **HF_HOME**: `D:\Academics\.cache\huggingface`
- **HUGGINGFACE_HUB_CACHE**: `D:\Academics\.cache\huggingface\hub`
- **TRANSFORMERS_CACHE**: `D:\Academics\.cache\huggingface\transformers`
- **HF_DATASETS_CACHE**: `D:\Academics\.cache\huggingface\datasets`

## Verification
To verify the configuration is working:

```powershell
cd backend
python test_cache_path.py
```

You should see output indicating that Hugging Face is configured to use D: drive.

## Benefits
- ✅ No more downloading models to C: drive
- ✅ Uses existing cache on D: drive
- ✅ Saves disk space on C: drive
- ✅ Faster startup times (no re-downloading)

## Troubleshooting

### If models still download to C: drive:
1. Make sure you run `.\set_hf_cache_env.ps1` before starting the backend
2. Check that the cache directories exist on D: drive
3. Verify environment variables are set: `echo $env:HF_HOME`

### If you get permission errors:
1. Run PowerShell as Administrator
2. Or set execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

# Synthetic-Data-Generator

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) ![Python](https://img.shields.io/badge/python-3.10%2B-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-green)

> **Phase 3 Complete!** Generate high-fidelity synthetic images using Stable Diffusion models, with a production-ready FastAPI backend and PostgreSQL storage.

## 🚀 Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL (Supabase)
- **ML:** PyTorch, HuggingFace Diffusers, Stable Diffusion XL-Turbo
- **Infrastructure:** Docker-ready, Git, Vercel (future frontend)
- **AI Models:** Stability AI SDXL-Turbo for fast, high-quality generation

## 🎯 Phase 3 Features (COMPLETED)

✅ **Synthetic Image Generation**
- Generate high-quality images using Stable Diffusion XL-Turbo
- Customizable parameters (noise level, steps, guidance scale)
- GPU/CPU auto-detection with memory optimization

✅ **Production-Ready API**
- RESTful API with FastAPI
- Complete CRUD operations for datasets
- Image preview and bulk download functionality
- Comprehensive error handling and logging

✅ **Database Integration**
- PostgreSQL with SQLAlchemy ORM
- Generation metadata tracking
- Supabase cloud database support

✅ **Smart Cache Management**
- Automatic Hugging Face cache configuration for D: drive
- Prevents re-downloading of large models
- Optimized storage usage

## 📦 Project Structure

```
├── backend/
│   ├── main.py                 # FastAPI application with all endpoints
│   ├── models/
│   │   ├── generator.py        # Stable Diffusion integration
│   │   ├── generation_db.py    # Database models
│   │   └── generated_image.py  # Image metadata model
│   ├── schemas/
│   │   └── generation.py       # Pydantic schemas for API
│   ├── utils/
│   │   └── utils.py           # File management utilities
│   ├── config/
│   │   ├── database.py        # Database configuration
│   │   └── settings.py        # Application settings
│   ├── requirements.txt       # Python dependencies
│   └── test_generator.py      # Generator unit tests
├── data/output/               # Generated images (git-ignored)
├── frontend/                  # Placeholder for React app (Phase 2)
├── set_hf_cache_env.ps1      # Environment setup script
├── start_backend_d_drive.ps1  # Complete backend startup script
├── HF_CACHE_D_DRIVE_SETUP.md # Cache configuration guide
├── .env.example              # Environment template
├── .env                      # Your local config (git-ignored)
└── README.md                 # This file
```

## ⚡ Quick Start

### Option 1: Automated Setup (Windows)

```powershell
# 1. Clone the repository
git clone https://github.com/namm9an/Synthetic-Data-Generator.git
cd Synthetic-Data-Generator

# 2. Create .env file from template
copy .env.example .env
# Edit .env with your database URL and HF token

# 3. Run the complete startup script
.\start_backend_d_drive.ps1
```

### Option 2: Manual Setup

1. **Clone and setup environment**

```bash
git clone https://github.com/namm9an/Synthetic-Data-Generator.git
cd Synthetic-Data-Generator

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt
```

2. **Configure environment**

```bash
# Copy and edit environment file
copy .env.example .env
# Edit .env with your database URL and optional HF token
```

3. **Start the backend**

```powershell
# Set HF cache to D: drive (Windows)
.\set_hf_cache_env.ps1

# Start the server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. **Test the API**

Visit `http://localhost:8000/health` ➜ `{ "status": "healthy" }`

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/generate` | Generate synthetic images |
| `GET` | `/datasets` | List all generations |
| `GET` | `/preview/{id}` | Preview generation (first 3 images) |
| `GET` | `/download/{id}` | Download generation as ZIP |

### Generate Synthetic Images

```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "class_label": "cats",
    "noise_level": 0.1,
    "output_size": 5,
    "prompt": "a cute orange cat sitting on a windowsill"
  }'
```

### List All Generations

```bash
curl "http://localhost:8000/datasets"
```

### Download Generated Dataset

```bash
curl "http://localhost:8000/download/{generation-id}" -o dataset.zip
```

## 🧪 Running Tests *(coming soon)*

```bash
pytest
```

## 📸 Screenshots *(placeholder)*

> (Add demo GIFs / images in later phases.)

---

© 2025 MIT License

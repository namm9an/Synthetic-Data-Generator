# Synthetic Data Generator

[![License: MIT](https://img.shields.io/github/license/namm9an/Synthetic-Data-Generator?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/namm9an/Synthetic-Data-Generator?style=social)](https://github.com/namm9an/Synthetic-Data-Generator/stargazers)
[![Backend](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61DAFB?logo=react)](#)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://synthetic-data-generator.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)

A production-ready synthetic image generator using Stable Diffusion models with FastAPI backend and PostgreSQL storage.

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL (Supabase)
- **ML:** PyTorch, HuggingFace Diffusers, Stable Diffusion XL-Turbo
- **Infrastructure:** Docker-ready, Git, Vercel (future frontend)
- **AI Models:** Stability AI SDXL-Turbo for fast, high-quality generation

## Live&nbsp;Demo

🌐 **Vercel:** <https://synthetic-data-generator.vercel.app>

> The site auto-deploys from `main` and connects to the FastAPI backend via `/api` proxy.

## Features

- **High-Quality Image Generation**
  - Stable Diffusion XL-Turbo for producing high-fidelity images.
  - Customizable parameters for generation.

- **Production-Ready API**
  - RESTful API with FastAPI.
  - Complete data handling operations.
  - Enhanced error handling and logging.

- **Database Integration**
  - Uses PostgreSQL with SQLAlchemy ORM.
  - Efficient metadata tracking.

- **Smart Cache Management**
  - Optimized Hugging Face model caching.
  - Prevents redundant downloads and maintains efficiency.

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

## 📸 Screenshots

| Page | Screenshot |
|------|------------|
| Home | ![Homepage](docs/images/homepage.png) |
| Generation Form | ![Generation Form](docs/images/generation_form.png) |
| Preview Gallery | ![Preview Gallery](docs/images/preview_gallery.png) |
| History Log | ![History Log](docs/images/history_log.png) |

_Screenshots live-generated in Phase 4. Replace these placeholders with high-resolution PNG/JPG files in `docs/images/`._

---

© 2025 MIT License

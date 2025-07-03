FROM python:3.10-slim

# Install system deps
RUN apt-get update && apt-get install -y build-essential git && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/
COPY backend/requirements.txt ./backend/requirements.txt

# Install Python deps
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r backend/requirements.txt

# Expose port
EXPOSE 8000

# Default envs
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000

# Entrypoint
CMD ["python", "backend/run_server.py"]

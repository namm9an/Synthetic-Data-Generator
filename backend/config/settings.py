"""Application settings loaded from environment variables using Pydantic.

Create a `.env` file next to this module with at least the following key:
    DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname

These settings are cached for the lifetime of the process.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """Base application settings."""

    database_url: str = Field(
        "postgresql+psycopg2://user:password@localhost:5432/postgres",
        env="DATABASE_URL",
        description="SQLAlchemy-compatible database URL",
    )

    # Application settings
    app_env: str = Field("development", env="APP_ENV")
    app_host: str = Field("127.0.0.1", env="APP_HOST")
    app_port: int = Field(8000, env="APP_PORT")

    # Debug
    log_level: str = Field("debug", env="LOG_LEVEL")
    debug: bool = Field(True, env="DEBUG")

    # ML configuration
    model_name: str = Field("stabilityai/sdxl-turbo", env="MODEL_NAME")
    generation_output_dir: str = Field("./data/output", env="GENERATION_OUTPUT_DIR")
    hf_token: str = Field("", env="HF_TOKEN")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:  # pragma: no cover
    """Return a cached Settings instance."""

    return Settings()

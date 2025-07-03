"""SQLAlchemy engine, session and Base declaration.

Any module that needs DB access should import `SessionLocal` for creating
sessions and `Base` for model definitions.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .settings import get_settings


class Base(DeclarativeBase):
    """Base class for ORM models."""

    pass


# Create engine using settings
settings = get_settings()
engine = create_engine(settings.database_url, echo=False, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():  # pragma: no cover
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from typing import Generator, Optional, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import SQLAlchemyError

from config import get_sqlalchemy_database_url, get_raw_database_url, mask_database_url

Base = declarative_base()

_engine = None
_SessionLocal = None


def get_engine():
    """Lazily initialize and return the SQLAlchemy engine."""
    global _engine, _SessionLocal
    db_url = get_sqlalchemy_database_url()
    if not db_url:
        raise ValueError(
            "DATABASE_URL is not configured. Please set DATABASE_URL in your backend/.env file."
        )

    if _engine is None:
        # pool_pre_ping checks if connection is alive before using it
        # pool_recycle helps refresh stale connections on serverless Neon Postgres
        _engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300,
            future=True,
        )
        _SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=_engine,
        )
    return _engine


def get_session_factory():
    """Return the sessionmaker instance."""
    global _SessionLocal
    if _SessionLocal is None:
        get_engine()
    return _SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency yielding a database session.
    Automatically closes the session after request completion.
    """
    session_factory = get_session_factory()
    db = session_factory()
    try:
        yield db
    finally:
        db.close()


def test_database_connection() -> Dict[str, Any]:
    """
    Perform a safe, non-destructive connectivity check against the Neon PostgreSQL database.
    Executes 'SELECT 1' and retrieves database metadata.
    Does NOT modify, delete, or create any tables.
    """
    raw_url = get_raw_database_url()
    if not raw_url:
        return {
            "connected": False,
            "error": "DATABASE_URL environment variable is missing in backend/.env",
            "instructions": (
                "Open backend/.env and set: DATABASE_URL=\"postgresql+psycopg://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require\""
            ),
        }

    try:
        engine = get_engine()
        with engine.connect() as connection:
            # Safe read-only metadata verification query
            result = connection.execute(
                text("SELECT 1 AS alive, current_database() AS db_name, version() AS version, now() AS server_time")
            ).mappings().first()

            return {
                "connected": True,
                "database_name": result["db_name"],
                "server_time": str(result["server_time"]),
                "postgres_version": result["version"].split(" on ")[0] if result else "PostgreSQL",
                "masked_url": mask_database_url(get_sqlalchemy_database_url()),
                "driver": "psycopg (SQLAlchemy)",
            }
    except SQLAlchemyError as exc:
        return {
            "connected": False,
            "error": str(exc),
            "masked_url": mask_database_url(get_sqlalchemy_database_url()),
            "instructions": "Verify your Neon credentials, host, and sslmode=require parameter.",
        }
    except Exception as exc:
        return {
            "connected": False,
            "error": str(exc),
            "instructions": "Ensure psycopg and SQLAlchemy are installed and DATABASE_URL is valid.",
        }

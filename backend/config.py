import os
from pathlib import Path
from dotenv import load_dotenv

# Locate the backend directory and load the backend/.env file
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

# Load the environment variables from backend/.env
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()


def get_raw_database_url() -> str:
    """Retrieve the raw DATABASE_URL environment variable."""
    return os.getenv("DATABASE_URL", "").strip()


def get_sqlalchemy_database_url() -> str:
    """
    Format and validate the database connection string for SQLAlchemy with the psycopg driver.
    
    Neon connection strings typically provide:
    'postgresql://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require'
    
    SQLAlchemy requires the 'postgresql+psycopg://' scheme when using psycopg v3.
    This helper automatically normalizes postgresql:// or postgres:// to postgresql+psycopg://
    and ensures sslmode=require is preserved for Neon.
    """
    raw_url = get_raw_database_url()
    if not raw_url:
        return ""

    url = raw_url

    # Strip surrounding quotes if present
    if (url.startswith('"') and url.endswith('"')) or (url.startswith("'") and url.endswith("'")):
        url = url[1:-1].strip()

    # Normalize driver scheme for psycopg v3
    if url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    elif not url.startswith("postgresql+psycopg://"):
        # If no scheme prefix matched, keep as is
        pass

    return url


def mask_database_url(url: str) -> str:
    """Mask password in the connection URL to prevent leaking credentials in logs."""
    if not url:
        return "<EMPTY>"
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        if parsed.password:
            masked = url.replace(f":{parsed.password}@", ":******@")
            return masked
        return url
    except Exception:
        return "postgresql+psycopg://*****:*****@... (masked)"

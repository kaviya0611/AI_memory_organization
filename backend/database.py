from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from settings import settings
import logging
import os

logger = logging.getLogger(__name__)

# Track active database info
ACTIVE_DB_TYPE = "postgresql"
ACTIVE_DB_URL = settings.database_url
DB_CONNECTED = False
DB_ERROR_MESSAGE = None

# Database URL with automatic SQLite fallback if PostgreSQL is not reachable
DATABASE_URL = settings.database_url
connect_args = {}

is_sqlite = DATABASE_URL.startswith("sqlite")
if not is_sqlite:
    try:
        import psycopg2
    except ImportError:
        logger.warning("psycopg2 not found; falling back to local SQLite database (org_memory.db)")
        DATABASE_URL = "sqlite:///./org_memory.db"
        is_sqlite = True

if is_sqlite:
    connect_args = {"check_same_thread": False}

try:
    # Attempt to connect to configured database (PostgreSQL by default)
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args=connect_args,
        pool_pre_ping=True if not is_sqlite else False,
        connect_timeout=3 if not is_sqlite else None
    )
    # Test connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    DB_CONNECTED = True
    ACTIVE_DB_TYPE = "sqlite" if is_sqlite else "postgresql"
    ACTIVE_DB_URL = DATABASE_URL
    logger.info(f"✅ Database connected successfully using {ACTIVE_DB_TYPE.upper()}: {DATABASE_URL}")
except Exception as err:
    DB_ERROR_MESSAGE = str(err)
    logger.warning(
        f"⚠️ Could not connect to primary database ({DATABASE_URL}): {err}. "
        "Falling back to local SQLite database: sqlite:///./org_memory.db"
    )
    DATABASE_URL = "sqlite:///./org_memory.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args=connect_args
    )
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    DB_CONNECTED = True
    ACTIVE_DB_TYPE = "sqlite"
    ACTIVE_DB_URL = DATABASE_URL
    logger.info("✅ Fallback SQLite database connected: org_memory.db")

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_status():
    """Return runtime database status for /health and diagnostics."""
    return {
        "connected": DB_CONNECTED,
        "type": ACTIVE_DB_TYPE,
        "url": ACTIVE_DB_URL.split("@")[-1] if "@" in ACTIVE_DB_URL else ACTIVE_DB_URL,
        "fallback_active": ACTIVE_DB_TYPE == "sqlite" and not settings.database_url.startswith("sqlite"),
        "error": DB_ERROR_MESSAGE
    }

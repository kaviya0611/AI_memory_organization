from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from settings import settings
import logging
import os

logger = logging.getLogger(__name__)

# Database URL with automatic SQLite fallback if PostgreSQL cannot be loaded
DATABASE_URL = settings.database_url
connect_args = {}

# Check if using SQLite or if Postgres driver is missing
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
    engine = create_engine(
        DATABASE_URL,
        echo=settings.debug,
        connect_args=connect_args,
        pool_pre_ping=True if not is_sqlite else False,
    )
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info(f"Database connected using: {DATABASE_URL}")
except Exception as err:
    logger.warning(f"Could not connect to {DATABASE_URL} ({err}). Switching to SQLite: sqlite:///./org_memory.db")
    DATABASE_URL = "sqlite:///./org_memory.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        DATABASE_URL,
        echo=settings.debug,
        connect_args=connect_args
    )

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


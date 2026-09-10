from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from settings import settings
import logging

logger = logging.getLogger(__name__)

# Database URL
DATABASE_URL = settings.database_url

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
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

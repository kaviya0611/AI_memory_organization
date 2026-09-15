from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Look for .env in current directory or parent directory
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
env_candidates = [BASE_DIR / ".env", ROOT_DIR / ".env"]
env_path = next((str(p) for p in env_candidates if p.exists()), ".env")

class Settings(BaseSettings):
    # Platform Information
    app_name: str = "Organizational Decision Intelligence"
    app_version: str = "1.0.0"

    # PostgreSQL Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/org_memory"
    )
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "password")
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", 5432))
    postgres_db: str = os.getenv("POSTGRES_DB", "org_memory")
    
    # Neo4j Graph Database (Optional)
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password")
    
    # Server & CORS
    server_host: str = os.getenv("SERVER_HOST", "0.0.0.0")
    server_port: int = int(os.getenv("SERVER_PORT", 8000))
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")
    
    class Config:
        env_file = env_path
        extra = "allow"

settings = Settings()

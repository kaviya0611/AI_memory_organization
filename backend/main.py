from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
from neo4j_db import neo4j_conn
from routes import decisions
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    logger.info(f"Neo4j connection: {'✅ Connected' if neo4j_conn.is_connected() else '⚠️  Not connected (graph features limited)'}")
    yield
    logger.info("Shutting down application...")
    neo4j_conn.close()

# Initialize FastAPI app
app = FastAPI(
    title="Organizational Memory & Decision Intelligence Platform",
    description="AI-powered decision capture and recommendation engine with knowledge graph",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(decisions.router, prefix="/api/decisions", tags=["decisions"])

@app.get("/")
async def root():
    return {
        "message": "Organizational Memory & Decision Intelligence Platform API",
        "version": "2.0.0",
        "features": ["Decision Capture", "AI Extraction", "Knowledge Graph", "Recommendations"],
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "neo4j": "connected" if neo4j_conn.is_connected() else "disconnected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

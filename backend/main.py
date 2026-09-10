from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base, SessionLocal
from neo4j_db import neo4j_conn
from routes import decisions
from services.seed_service import seed_enterprise_data
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables on startup and seed initial memory
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AI Organizational Memory & Decision Intelligence Platform...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")
    
    # Auto-seed enterprise data if empty
    try:
        db = SessionLocal()
        seed_enterprise_data(db, force=False)
        db.close()
        logger.info("Enterprise memory verified and seeded")
    except Exception as e:
        logger.warning(f"Could not auto-seed data: {e}")

    logger.info(f"Neo4j connection: {'✅ Connected' if neo4j_conn.is_connected() else '⚠️  Not connected (Graph fallbacks active)'}")
    yield
    logger.info("Shutting down application...")
    neo4j_conn.close()

# Initialize FastAPI app
app = FastAPI(
    title="AI Organizational Memory & Decision Intelligence Platform",
    description="A living organizational brain that captures reasoning, enforces guardrails, simulates councils, and continuously improves decision quality.",
    version="3.0.0",
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
        "platform": "AI Organizational Memory & Decision Intelligence Platform",
        "version": "3.0.0",
        "unique_features": [
            "1. Decision Memory (Full reasoning, triggers, constraints)",
            "2. Temporal Validity (Knowledge expiration & decay)",
            "3. Dead Ends Repository (Anti-patterns & Do Not Retry)",
            "4. Neuro-Symbolic Explainability (LLM + Logic Proof Trees)",
            "5. Real-Time Decision Guardrails (Proactive prevention)",
            "6. Decision Replay (Post-mortem time-travel replay)",
            "7. Multi-Agent Simulation (Virtual Expert Council)",
            "8. Explanation-First Architecture (5-layer explainability)",
            "9. Adaptive Learning (Outcome feedback loops)",
            "10. Dream Mode (Nightly self-improving memory)",
            "11. Governance-First Execution (Trust tiers & audit trail)",
            "12. Cross-Department Decision Connections (Break silos)"
        ],
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "neo4j": "connected" if neo4j_conn.is_connected() else "disconnected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


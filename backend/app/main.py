from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os
from app.api.v1.endpoints import router as api_router
from app.core.config import settings
from app.db.session import init_db
from dotenv import load_dotenv

load_dotenv()

_start_time = datetime.now(timezone.utc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if os.environ.get("FRONTEND_URL"):
    _allowed_origins.append(os.environ["FRONTEND_URL"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "active", "version": "1.0.0"}


@app.get("/api/v1/status")
def system_status():
    from app.services.rag_service import rag_service

    uptime_seconds = (datetime.now(timezone.utc) - _start_time).total_seconds()
    hours, remainder = divmod(int(uptime_seconds), 3600)
    minutes, secs = divmod(remainder, 60)

    agents = [
        {"name": "Supervisor", "role": "Lead Financial Strategist", "status": "active"},
        {"name": "Librarian", "role": "Fundamental Analyst (RAG)", "status": "active"},
        {"name": "Quant", "role": "Technical Analyst", "status": "active"},
        {"name": "Journalist", "role": "Sentiment Analyst", "status": "active"},
        {"name": "Aggregator", "role": "Report Synthesis", "status": "active"},
    ]

    db_ok = True
    try:
        from app.db.session import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    return {
        "status": "active",
        "version": "1.0.0",
        "uptime": f"{hours}h {minutes}m {secs}s",
        "uptime_seconds": int(uptime_seconds),
        "agents": agents,
        "rag": {
            "ready": rag_service.is_ready,
            "total_chunks": len(rag_service.chunks),
        },
        "database": {
            "connected": db_ok,
            "url_scheme": settings.DATABASE_URL.split("://")[0] if "://" in settings.DATABASE_URL else "unknown",
        },
        "api_keys": {
            "gemini": bool(settings.GEMINI_API_KEY),
            "tavily": bool(settings.TAVILY_API_KEY),
        },
        "model": settings.GEMINI_MODEL,
    }


app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""
Global configuration — reads from .env file or environment variables.
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Financial AI Analyst"

    # ── Database ──
    # Defaults to local SQLite for development.
    # In Docker, set DATABASE_URL=postgresql://user:pass@db:5432/financial_ai
    DATABASE_URL: str = "sqlite:///./financial_analyst.db"

    # ── LLM Keys ──
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: Optional[str] = None

    # ── Search Keys ──
    TAVILY_API_KEY: Optional[str] = None

    # ── RAG Settings ──
    FAISS_INDEX_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
        "data", "faiss_index"
    )
    RAW_PDF_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
        "data", "raw_pdfs"
    )

    # ── Agent Settings ──
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "models/embedding-001"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

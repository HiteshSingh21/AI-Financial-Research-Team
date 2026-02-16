"""
Pytest configuration and shared fixtures for all tests.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Override DATABASE_URL to use in-memory SQLite for tests
# MUST be set before any app module is imported
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["GEMINI_API_KEY"] = "test-key"

# Import models so SQLModel.metadata knows about them
from app.db.models import ChatHistory, AnalysisReport  # noqa: E402, F401


@pytest.fixture(scope="session")
def engine():
    """Return the app's own engine (shares the same in-memory DB)."""
    from app.db.session import engine as app_engine
    SQLModel.metadata.create_all(app_engine)
    return app_engine


@pytest.fixture
def db_session(engine):
    """Provide a clean database session for each test."""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    # Clean tables after each test
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


@pytest.fixture(scope="session")
def client():
    """Create a FastAPI test client."""
    from app.main import app
    with TestClient(app) as c:
        yield c

"""
Pytest configuration and shared fixtures for all tests.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Override DATABASE_URL to use in-memory SQLite for tests
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["GEMINI_API_KEY"] = "test-key"


@pytest.fixture(scope="session")
def engine():
    """Create a test database engine (in-memory SQLite)."""
    engine = create_engine("sqlite://", echo=False, connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    return engine


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

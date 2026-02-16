import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["GEMINI_API_KEY"] = "test-key"

from app.db.models import ChatHistory, AnalysisReport  # noqa: E402, F401


@pytest.fixture(scope="session")
def engine():
    from app.db.session import engine as app_engine
    SQLModel.metadata.create_all(app_engine)
    return app_engine


@pytest.fixture
def db_session(engine):
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


@pytest.fixture(scope="session")
def client():
    from app.main import app
    with TestClient(app) as c:
        yield c

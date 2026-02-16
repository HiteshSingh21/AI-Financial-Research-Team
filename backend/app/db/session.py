"""
Database Session Management.
"""
from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

# SQLite requires check_same_thread=False; Postgres does not support it
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

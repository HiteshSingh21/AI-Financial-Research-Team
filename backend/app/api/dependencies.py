from app.db.session import get_session

def get_db():
    session = next(get_session())
    try:
        yield session
    finally:
        session.close()

def get_current_user():
    return "default_user"

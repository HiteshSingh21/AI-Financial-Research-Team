from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.v1.endpoints import router as api_router
from app.core.config import settings
from app.db.session import init_db
from dotenv import load_dotenv

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern lifespan handler — replaces deprecated @app.on_event."""
    init_db()
    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS — Allow all for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "active", "version": "1.0.0"}

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
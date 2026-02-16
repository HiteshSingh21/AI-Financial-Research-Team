from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.agents.supervisor import supervisor_agent
from app.services.rag_service import rag_service
from app.db.models import ChatHistory
import shutil
import os
from app.core.config import settings

router = APIRouter()

@router.post("/analyze")
async def analyze_stock(
    query: str,
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    try:
        response = supervisor_agent.run(query)
        content = response.content
        
        history = ChatHistory(user_id=user_id, query=query, response=content)
        db.add(history)
        db.commit()
        
        return {"response": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    try:
        os.makedirs(settings.RAW_PDF_DIR, exist_ok=True)
        file_path = os.path.join(settings.RAW_PDF_DIR, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = rag_service.ingest_pdf(file_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{user_id}")
async def get_history(user_id: str, db: Session = Depends(get_db)):
    from sqlmodel import select
    statement = select(ChatHistory).where(ChatHistory.user_id == user_id).order_by(ChatHistory.timestamp.desc())
    results = db.exec(statement).all()
    return results

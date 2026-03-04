from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import get_current_user
from app.services.mock_interview_service import MockInterviewService
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class StartInterviewRequest(BaseModel):
    topic: str
    difficulty: str

class ChatRequest(BaseModel):
    session_id: int
    message: str

@router.post("/start")
async def start_interview(req: StartInterviewRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return await MockInterviewService.start_session(db, user["user_id"], req.topic, req.difficulty)

@router.post("/chat")
async def chat(req: ChatRequest, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    session = await MockInterviewService.chat(db, req.session_id, req.message)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or completed")
    return session

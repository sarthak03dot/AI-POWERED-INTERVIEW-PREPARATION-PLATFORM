from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.full_interview_service import FullInterviewService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/generate")
async def generate_interview(topic: str = "general", difficulty: str = "medium",
                             user: dict = Depends(get_current_user)):
    return await FullInterviewService.generate_full_interview(topic, difficulty)
    return await FullInterviewService.generate_full_interview(topic, difficulty)
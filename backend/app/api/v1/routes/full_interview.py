from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security
from app.services.full_interview_service import FullInterviewService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/generate")
async def generate_interview(topic: str = "general", difficulty: str = "medium",
                             auth: str = Header()):
    Security.decode_jwt(auth.replace("Bearer ", ""))
    return await FullInterviewService.generate_full_interview(topic, difficulty)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.evaluation_service import EvaluationService
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class EvaluationRequest(BaseModel):
    question_data: dict
    user_answer: str
    question_type: str
    topic: str

@router.post("/practice")
async def evaluate_practice_api(
    body: EvaluationRequest, 
    user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return await EvaluationService.evaluate_practice(
        db, 
        user["user_id"], 
        body.question_data, 
        body.user_answer, 
        body.question_type, 
        body.topic
    )

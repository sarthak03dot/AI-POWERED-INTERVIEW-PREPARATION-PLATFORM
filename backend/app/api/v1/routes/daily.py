from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.daily_service import DailyService
from app.services.progress_service import ProgressService
from app.services.leaderboard_service import LeaderboardService
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/today")
async def get_today(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    challenge = await DailyService.get_or_generate_today(db)
    attempt = DailyService.get_user_attempt(db, user["user_id"], challenge.id)
    
    return {
        "question": challenge.question,
        "already_solved": attempt is not None,
        "is_correct": attempt.is_correct if attempt else None,
        "user_answer": attempt.user_answer if attempt else None,
        "correct_answer": challenge.answer if attempt else None
    }


class SubmitDTO(BaseModel):
    user_answer: str

@router.post("/submit")
async def submit(body: SubmitDTO, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    challenge = await DailyService.get_or_generate_today(db)
    
    # Check if already solved
    existing = DailyService.get_user_attempt(db, user["user_id"], challenge.id)
    if existing:
        return {
            "is_correct": existing.is_correct,
            "msg": "You have already completed today's challenge.",
            "new_score": ProgressService.get_progress(db, user["user_id"]).total_score,
            "already_solved": True
        }

    # The answer in DB might be just the letter (A, B, C, D) or the full text
    is_correct = DailyService.evaluate(body.user_answer, challenge.answer)
    
    # Record the attempt
    DailyService.record_attempt(db, user["user_id"], challenge.id, body.user_answer, is_correct)
    
    if is_correct:
        progress = ProgressService.update_progress(db, user["user_id"], score_inc=10)
        return {
            "is_correct": True,
            "msg": "Correct! You've earned 10 XP.",
            "new_score": progress.total_score
        }
    
    # If incorrect, still return current stats but with fail message
    progress = ProgressService.get_progress(db, user["user_id"])
    return {
        "is_correct": False,
        "msg": f"Incorrect. The correct answer was {challenge.answer}.",
        "new_score": progress.total_score
    }
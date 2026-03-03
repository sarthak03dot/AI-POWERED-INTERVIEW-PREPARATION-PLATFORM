from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security
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
async def get_today(auth: str = Header(), db: Session = Depends(get_db)):
    user = Security.decode_jwt(auth.replace("Bearer ", ""))
    challenge = await DailyService.get_or_generate_today(db)
    return {"question": challenge.question}


class SubmitDTO(BaseModel):
    user_answer: str

@router.post("/submit")
async def submit(body: SubmitDTO, auth: str = Header(), db: Session = Depends(get_db)):
    user = Security.decode_jwt(auth.replace("Bearer ", ""))
    progress = ProgressService.update_progress(db, user["user_id"])
    LeaderboardService.update_leaderboard(db, user["user_id"], "username_here", 10)

    return {"msg": "Correct!", "new_score": progress.total_score}
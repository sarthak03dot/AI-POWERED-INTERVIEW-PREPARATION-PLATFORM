from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.stats_service import StatsService
from app.services.leaderboard_service import LeaderboardService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/me")
def my_stats(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return StatsService.get_stats(db, user["user_id"])

@router.get("/leaderboard")
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    return LeaderboardService.get_leaderboard(db, limit)
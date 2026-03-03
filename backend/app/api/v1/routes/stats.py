from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security
from app.services.stats_service import StatsService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/me")
def my_stats(auth: str = Header(), db: Session = Depends(get_db)):
    user = Security.decode_jwt(auth.replace("Bearer ", ""))
    return StatsService.get_stats(db, user["user_id"])
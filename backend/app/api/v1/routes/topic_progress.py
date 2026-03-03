from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.topic_service import TopicService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def my_topics(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return TopicService.get_topics(db, user["user_id"])
    return TopicService.get_topics(db, user["user_id"])
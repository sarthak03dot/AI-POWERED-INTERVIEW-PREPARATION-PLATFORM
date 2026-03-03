from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security
from app.services.topic_service import TopicService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me")
def my_topics(auth: str = Header(), db: Session = Depends(get_db)):
    user = Security.decode_jwt(auth.replace("Bearer ", ""))
    return TopicService.get_topics(db, user["user_id"])
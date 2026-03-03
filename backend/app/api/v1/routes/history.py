from fastapi import APIRouter, Header, Depends, Request
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import Security, get_current_user
from app.services.history_service import HistoryService

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/all")
def get_all_history(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return HistoryService.get_all(db, user["user_id"])

@router.get("/topic/{topic}")
def get_history_by_topic(topic: str, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return HistoryService.get_by_topic(db, user["user_id"], topic)

@router.get("/paginated")
def paginated(
    page: int = 1, limit: int = 10, user: dict = Depends(get_current_user), db: Session = Depends(get_db)
    ):
    return HistoryService.get_paginated(db, user["user_id"], page, limit)
from sqlalchemy.orm import Session
from app.models.question_history import QuestionHistory

class HistoryService:

    @staticmethod
    def save_history(db: Session, user_id: int, qtype: str, topic: str, question: str, answer: str, correct_answer=None):
        entry = QuestionHistory(
            user_id=user_id,
            question_type=qtype,
            topic=topic,
            question=question,
            answer=answer,
            correct_answer=correct_answer
        )
        db.add(entry)
        db.commit()
        return entry

    @staticmethod
    def get_all(db: Session, user_id: int):
        return db.query(QuestionHistory).filter(QuestionHistory.user_id == user_id).all()

    @staticmethod
    def get_by_topic(db: Session, user_id: int, topic: str):
        return (
            db.query(QuestionHistory)
            .filter(QuestionHistory.user_id == user_id, QuestionHistory.topic == topic)
            .all()
        )
        
    @staticmethod
    def get_paginated(db: Session, user_id: int, page: int, limit: int):
        offset = (page - 1) * limit
        query = db.query(QuestionHistory).filter(QuestionHistory.user_id == user_id)
        total = query.count()
        data = query.order_by(QuestionHistory.created_at.desc()).offset(offset).limit(limit).all()

        return {"total": total, "page": page, "limit": limit, "data": data}
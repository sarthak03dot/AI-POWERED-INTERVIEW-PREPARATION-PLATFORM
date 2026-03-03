from sqlalchemy.orm import Session
from app.models.topic_progress import TopicProgress

class TopicService:

    @staticmethod
    def update_topic(db: Session, user_id: int, topic: str, correct: bool):
        tp = db.query(TopicProgress).filter(
            TopicProgress.user_id == user_id, TopicProgress.topic == topic
        ).first()

        if not tp:
            tp = TopicProgress(user_id=user_id, topic=topic)
            db.add(tp)

        tp.total_attempts += 1
        if correct:
            tp.correct_attempts += 1

        db.commit()
        return tp

    @staticmethod
    def get_topics(db: Session, user_id: int):
        return db.query(TopicProgress).filter(TopicProgress.user_id == user_id).all()
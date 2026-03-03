from sqlalchemy.orm import Session
from app.models.progress import UserProgress
from app.models.question_history import QuestionHistory
from app.models.topic_progress import TopicProgress

class StatsService:

    @staticmethod
    def get_stats(db: Session, user_id: int):

        progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
        history_count = db.query(QuestionHistory).filter(QuestionHistory.user_id == user_id).count()
        topic_rows = db.query(TopicProgress).filter(TopicProgress.user_id == user_id).all()

        topic_stats = [
            {
                "topic": t.topic,
                "accuracy": round((t.correct_attempts / t.total_attempts) * 100, 2)
                if t.total_attempts > 0 else 0,
                "attempts": t.total_attempts
            }
            for t in topic_rows
        ]

        return {
            "total_score": progress.total_score if progress else 0,
            "challenges_solved": progress.challenges_solved if progress else 0,
            "total_questions_attempted": history_count,
            "topics": topic_stats
        }
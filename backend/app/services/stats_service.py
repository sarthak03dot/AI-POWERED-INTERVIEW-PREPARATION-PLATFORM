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

        # Get recent activity
        recent_activity_rows = db.query(QuestionHistory).filter(QuestionHistory.user_id == user_id).order_by(QuestionHistory.created_at.desc()).limit(5).all()
        recent_activity = [
            {
                "topic": r.topic,
                "type": r.question_type,
                "correct": r.answer.strip().lower() == r.correct_answer.strip().lower() if r.correct_answer else False,
                "created_at": r.created_at.isoformat()
            }
            for r in recent_activity_rows
        ]

        # Calculate Interview Readiness Score
        # Formula: Average accuracy weighted by volume (max 100)
        avg_accuracy = sum([t["accuracy"] for t in topic_stats]) / len(topic_stats) if topic_stats else 0
        volume_factor = min(1.0, history_count / 100) # 100 questions for full weight
        readiness_score = round(float(avg_accuracy * volume_factor), 1)

        return {
            "total_score": progress.total_score if progress else 0,
            "challenges_solved": progress.challenges_solved if progress else 0,
            "total_questions_attempted": history_count,
            "readiness_score": readiness_score,
            "topics": topic_stats,
            "recent_activity": recent_activity
        }
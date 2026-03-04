from sqlalchemy.orm import Session
from app.models.progress import UserProgress
from app.models.user import User

class LeaderboardService:
    @staticmethod
    def get_leaderboard(db: Session, limit: int = 10):
        # Join UserProgress with User to get names/emails
        results = db.query(
            User.username,
            UserProgress.total_score,
            UserProgress.challenges_solved
        ).join(
            User, User.id == UserProgress.user_id
        ).order_by(
            UserProgress.total_score.desc()
        ).limit(limit).all()

        return [
            {
                "username": r.username,
                "total_score": r.total_score,
                "challenges_solved": r.challenges_solved
            } for r in results
        ]
from sqlalchemy.orm import Session
from app.models.leaderboard import LeaderboardEntry

class LeaderboardService:

    @staticmethod
    def update_leaderboard(db: Session, user_id: int, username: str, score: int):
        entry = db.query(LeaderboardEntry).filter(LeaderboardEntry.user_id == user_id).first()
        if not entry:
            entry = LeaderboardEntry(user_id=user_id, username=username, score=0)
            db.add(entry)

        entry.score += score
        db.commit()
        return entry

    @staticmethod
    def get_top(db: Session, limit=10):
        return db.query(LeaderboardEntry).order_by(LeaderboardEntry.score.desc()).limit(limit).all()
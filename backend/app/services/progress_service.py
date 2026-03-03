from sqlalchemy.orm import Session
from app.models.progress import UserProgress

class ProgressService:

    @staticmethod
    def get_progress(db: Session, user_id: int):
        progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
        if not progress:
            progress = UserProgress(user_id=user_id, total_score=0, challenges_solved=0)
            db.add(progress)
            db.commit()
        return progress

    @staticmethod
    def update_progress(db: Session, user_id: int, score_inc: int = 10):
        progress = ProgressService.get_progress(db, user_id)
        progress.total_score += score_inc
        progress.challenges_solved += 1
        db.commit()
        return progress
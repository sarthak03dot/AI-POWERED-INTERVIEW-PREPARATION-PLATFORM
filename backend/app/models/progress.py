from sqlalchemy import Column, Integer
from app.database import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    total_score = Column(Integer, default=0)
    challenges_solved = Column(Integer, default=0)
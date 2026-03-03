from sqlalchemy import Column, Integer, String
from app.database import Base

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    username = Column(String)
    score = Column(Integer)
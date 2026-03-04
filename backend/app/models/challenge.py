from sqlalchemy import Column, Integer, String, Date, Boolean
from app.database import Base
import datetime

class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today, unique=True)
    question = Column(String)
    answer = Column(String)

class DailyAttempt(Base):
    __tablename__ = "daily_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    challenge_id = Column(Integer, index=True)
    user_answer = Column(String)
    is_correct = Column(Boolean)
    date = Column(Date, default=datetime.date.today)
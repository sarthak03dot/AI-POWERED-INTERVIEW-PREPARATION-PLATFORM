from sqlalchemy import Column, Integer, String, Date
from app.database import Base
import datetime

class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today, unique=True)
    question = Column(String)
    answer = Column(String)
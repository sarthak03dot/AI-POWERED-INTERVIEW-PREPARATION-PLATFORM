from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base
import datetime

class QuestionHistory(Base):
    __tablename__ = "question_history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    question_type = Column(String)      # mcq / coding / hr / system-design
    topic = Column(String)
    question = Column(Text)
    answer = Column(Text)
    correct_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
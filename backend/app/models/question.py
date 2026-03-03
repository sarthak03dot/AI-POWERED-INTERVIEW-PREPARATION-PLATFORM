from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_type = Column(String, index=True) # e.g., mcq, coding, hr, system-design
    topic = Column(String, index=True)
    difficulty = Column(String)
    content = Column(Text) # JSON string storing question details based on type
    expected_answer = Column(Text, nullable=True)

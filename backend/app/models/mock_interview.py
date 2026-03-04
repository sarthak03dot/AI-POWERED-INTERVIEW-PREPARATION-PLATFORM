from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class MockInterviewSession(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    topic = Column(String)
    difficulty = Column(String)
    status = Column(String, default="active") # active, completed
    history = Column(JSON, default=[]) # List of {"role": "ai/user", "content": ""}
    feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

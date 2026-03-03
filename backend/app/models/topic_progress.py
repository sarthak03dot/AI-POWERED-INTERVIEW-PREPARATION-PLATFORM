from sqlalchemy import Column, Integer, String
from app.database import Base

class TopicProgress(Base):
    __tablename__ = "topic_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    topic = Column(String)
    total_attempts = Column(Integer, default=0)
    correct_attempts = Column(Integer, default=0)
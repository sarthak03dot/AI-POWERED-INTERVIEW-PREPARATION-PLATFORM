from app.database import Base, engine
from app.models.user import User
from app.models.challenge import DailyChallenge
from app.models.progress import UserProgress
from app.models.leaderboard import LeaderboardEntry
from app.models.question_history import QuestionHistory
from app.models.topic_progress import TopicProgress
from app.models.question import Question

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("All tables created successfully!")
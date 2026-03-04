import datetime
from app.database import SessionLocal, engine, Base
from app.models.progress import UserProgress
from app.models.topic_progress import TopicProgress
from app.models.question_history import QuestionHistory
from app.models.challenge import DailyAttempt, DailyChallenge
from sqlalchemy.orm import Session

def seed_dashboard_data(db: Session, user_id: int):
    # 1. Seed UserProgress
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    if not progress:
        progress = UserProgress(user_id=user_id)
        db.add(progress)
    
    progress.total_score = 1450
    progress.challenges_solved = 48
    
    # 2. Seed TopicProgress
    topics_data = [
        ("Python", 35, 28),
        ("React", 28, 22),
        ("Backend", 22, 19),
        ("Database", 15, 10),
        ("System Design", 12, 7),
        ("HR", 8, 8)
    ]
    
    for topic_name, total, correct in topics_data:
        topic = db.query(TopicProgress).filter(
            TopicProgress.user_id == user_id, 
            TopicProgress.topic == topic_name
        ).first()
        if not topic:
            topic = TopicProgress(user_id=user_id, topic=topic_name)
            db.add(topic)
        topic.total_attempts = total
        topic.correct_attempts = correct

    # 3. Seed QuestionHistory (Recent Activity)
    # Clear old history for this user to make it clean
    db.query(QuestionHistory).filter(QuestionHistory.user_id == user_id).delete()
    
    history_items = [
        ("Python", "mcq", "What is a decorator?", "A tool to wrap functions", "A tool to wrap functions"),
        ("React", "mcq", "What is useMemo?", "Memoization hook", "Memoization hook"),
        ("Backend", "coding", "Implement a singleton", "class S:...", "class S:..."),
        ("Database", "mcq", "ACID properties", "A, C, I, D", "A, C, I, D"),
        ("System Design", "hr", "Talk about a complex project", "I built...", "N/A"),
        ("Python", "mcq", "List comprehension syntax", "[x for x in list]", "[x for x in list]"),
        ("React", "mcq", "Virtual DOM benefits", "Performance", "Performance"),
        ("HR", "hr", "What is your biggest weakness?", "Perfectionism lol", "N/A")
    ]
    
    for topic, qtype, q, a, ca in history_items:
        history = QuestionHistory(
            user_id=user_id,
            topic=topic,
            question_type=qtype,
            question=q,
            answer=a,
            correct_answer=ca,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=history_items.index((topic, qtype, q, a, ca)))
        )
        db.add(history)

    db.commit()
    print(f"Successfully seeded dashboard data for user_id {user_id}")

if __name__ == "__main__":
    db = SessionLocal()
    # Using user_id 2 based on previous research
    seed_dashboard_data(db, 2)
    db.close()

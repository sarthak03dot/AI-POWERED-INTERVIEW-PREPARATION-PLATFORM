import datetime
from sqlalchemy.orm import Session
from app.models.challenge import DailyChallenge
from app.services.llm_service import LLMService

class DailyService:

    @staticmethod
    async def get_or_generate_today(db: Session):
        today = datetime.date.today()
        challenge = db.query(DailyChallenge).filter(DailyChallenge.date == today).first()

        if challenge:
            return challenge

        prompt = """
        Generate 1 medium difficulty MCQ for a daily interview challenge.
        Return JSON:
        {
            "question": "",
            "options": ["A", "B", "C", "D"],
            "answer": ""
        }
        """

        data = await LLMService.ask_llm(prompt)

        challenge = DailyChallenge(
            date=today,
            question=data,
            answer="LLM-returned-answer"
        )

        db.add(challenge)
        db.commit()
        db.refresh(challenge)

        return challenge

    @staticmethod
    def evaluate(user_answer: str, correct_answer: str):
        return user_answer.strip().lower() == correct_answer.strip().lower()
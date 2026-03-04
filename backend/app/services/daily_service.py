import datetime
import json
from sqlalchemy.orm import Session
from app.models.challenge import DailyChallenge, DailyAttempt
from app.services.llm_service import LLMService
from app.services.csv_service import CSVService
from app.services.question_service import extract_json

class DailyService:

    @staticmethod
    async def get_or_generate_today(db: Session):
        today = datetime.date.today()
        challenge = db.query(DailyChallenge).filter(DailyChallenge.date == today).first()

        if challenge:
            return challenge

        # Try CSV first for a daily challenge (using random MCQ)
        row = CSVService.get_random_row('mcq.csv')
        if row:
            data = CSVService.parse_json_fields(row, ['options'])
            challenge = DailyChallenge(
                date=today,
                question=json.dumps(data),
                answer=data.get('answer', 'N/A')
            )
        else:
            # Fallback to LLM if CSV empty
            prompt = """
            Generate 1 medium difficulty MCQ for a daily interview challenge.
            Return JSON:
            {
                "question": "",
                "options": ["A", "B", "C", "D"],
                "answer": ""
            }
            """
            reply = await LLMService.ask_llm(prompt)
            clean_json = extract_json(reply)
            try:
                data = json.loads(clean_json)
                actual_answer = data.get('answer', 'N/A')
            except:
                actual_answer = 'N/A'
                
            challenge = DailyChallenge(
                date=today,
                question=clean_json,
                answer=actual_answer
            )

        db.add(challenge)
        db.commit()
        db.refresh(challenge)

        return challenge

    @staticmethod
    def evaluate(user_answer: str, correct_answer: str):
        return user_answer.strip().lower() == correct_answer.strip().lower()

    @staticmethod
    def get_user_attempt(db: Session, user_id: int, challenge_id: int):
        return db.query(DailyAttempt).filter(
            DailyAttempt.user_id == user_id,
            DailyAttempt.challenge_id == challenge_id
        ).first()

    @staticmethod
    def record_attempt(db: Session, user_id: int, challenge_id: int, user_answer: str, is_correct: bool):
        attempt = DailyAttempt(
            user_id=user_id,
            challenge_id=challenge_id,
            user_answer=user_answer,
            is_correct=is_correct
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return attempt
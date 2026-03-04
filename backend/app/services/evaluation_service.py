from app.services.llm_service import LLMService
from sqlalchemy.orm import Session
from app.models.question_history import QuestionHistory

class EvaluationService:

    @staticmethod
    async def evaluate_practice(db: Session, user_id: int, question_data: dict, user_answer: str, question_type: str, topic: str):
        
        feedback = ""
        is_correct = False
        score_delta = 0

        if question_type == 'mcq':
            correct_answer = question_data.get('answer', '')
            # Simple letter extraction 'A', 'B' etc if it's like "A. choice"
            user_clean = user_answer.strip().upper()[0] if user_answer else ""
            correct_clean = correct_answer.strip().upper()[0] if correct_answer else ""
            
            is_correct = (user_clean == correct_clean)
            feedback = f"Correct!" if is_correct else f"Incorrect. The correct answer was {correct_answer}."
            if is_correct: score_delta = 10
        else:
            # Free-form evaluation using LLM
            prompt = f"""
            Evaluate this interview answer.
            Question: {question_data.get('question') or question_data.get('title') or 'Unknown'}
            User's Answer: {user_answer}
            Question Type: {question_type}

            Provide a short response in JSON:
            {{
                "is_correct": true/false,
                "feedback": "constructive feedback and what was missing",
                "score": 0 to 10
            }}
            """
            eval_data = await LLMService.ask_llm(prompt)
            # Assuming LLM returns proper JSON (we should improve parsing like in DailyService)
            import json
            try:
                # Basic cleanup in case of markdown blocks
                clean_json = eval_data.replace("```json", "").replace("```", "").strip()
                parsed = json.loads(clean_json)
                is_correct = parsed.get("is_correct", False)
                feedback = parsed.get("feedback", "No feedback provided.")
                score_delta = parsed.get("score", 0)
            except:
                feedback = eval_data # Fallback to raw text
                is_correct = "correct" in eval_data.lower()
                score_delta = 5 if is_correct else 0

        # Create history entry
        new_history = QuestionHistory(
            user_id=user_id,
            question_type=question_type,
            topic=topic,
            question=str(question_data),
            answer=user_answer,
            correct_answer=question_data.get('answer') or "N/A"
        )
        db.add(new_history)
        db.commit()

        return {
            "is_correct": is_correct,
            "feedback": feedback,
            "score_delta": score_delta
        }

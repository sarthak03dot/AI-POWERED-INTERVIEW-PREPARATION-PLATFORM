import json
from sqlalchemy.orm import Session
from app.models.mock_interview import MockInterviewSession
from app.services.llm_service import LLMService

class MockInterviewService:

    @staticmethod
    async def start_session(db: Session, user_id: int, topic: str, difficulty: str):
        # Create a new session
        session = MockInterviewSession(
            user_id=user_id,
            topic=topic,
            difficulty=difficulty,
            history=[]
        )
        
        # Initial AI prompt to start the interview
        prompt = f"You are a technical interviewer for a {difficulty} level interview on {topic}. Start the interview by introducing yourself briefly and asking the first question."
        
        initial_message = await LLMService.ask_llm(prompt)
        
        session.history = [{"role": "assistant", "content": initial_message}]
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    async def chat(db: Session, session_id: int, user_message: str):
        session = db.query(MockInterviewSession).filter(MockInterviewSession.id == session_id).first()
        if not session or session.status == "completed":
            return None

        # Add user message to history
        updated_history = list(session.history)
        updated_history.append({"role": "user", "content": user_message})

        # Prepare prompt for AI
        system_prompt = f"You are a technical interviewer on {session.topic}. Maintain the context of the interview. " \
                        f"If the user has answered enough questions (usually 5-7), wrap up the interview and say 'The interview is now complete. Feel free to conclude.' " \
                        f"Otherwise, evaluate their answer briefly and ask the next follow-up or a new question."
        
        # Format history for LLM
        formatted_history = "\n".join([f"{m['role']}: {m['content']}" for m in updated_history])
        full_prompt = f"{system_prompt}\n\nHistory:\n{formatted_history}\n\nassistant:"

        ai_response = await LLMService.ask_llm(full_prompt)

        # Update session
        updated_history.append({"role": "assistant", "content": ai_response})
        session.history = updated_history
        
        if "interview is now complete" in ai_response.lower():
            session.status = "completed"
            # Generate final feedback
            feedback_prompt = f"Assess this interview on {session.topic}. Return a JSON with 'score' (0-100) and 'feedback' (string).\nHistory:\n{formatted_history}"
            feedback_data = await LLMService.ask_llm(feedback_prompt)
            try:
                # Clean JSON if necessary
                if "```json" in feedback_data:
                    feedback_data = feedback_data.split("```json")[1].split("```")[0].strip()
                session.feedback = json.loads(feedback_data)
            except:
                session.feedback = {"score": 70, "feedback": "Good effort."}

        db.commit()
        return session

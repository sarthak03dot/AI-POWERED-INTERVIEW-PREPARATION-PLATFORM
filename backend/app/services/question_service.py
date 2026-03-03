from app.services.llm_service import LLMService

class QuestionService:

    @staticmethod
    async def generate_mcq(topic: str, difficulty: str):
        prompt = f"""
        Generate 1 technical MCQ on {topic}.
        Difficulty: {difficulty}.
        Return JSON:
        {{
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "correct option",
          "explanation": "short explanation"
        }}
        """
        return await LLMService.ask_llm(prompt)

    @staticmethod
    async def generate_coding(topic: str, difficulty: str):
        prompt = f"""
        Generate 1 coding interview problem on {topic}.
        Difficulty: {difficulty}.
        Return JSON:
        {{
          "title": "",
          "description": "",
          "input_format": "",
          "output_format": "",
          "constraints": "",
          "example": ""
        }}
        """
        return await LLMService.ask_llm(prompt)

    @staticmethod
    async def generate_system_design():
        prompt = """
        Generate 1 system design interview question.
        Return JSON:
        {
          "question": "",
          "expectations": ["point1", "point2", "point3"],
          "hints": ["hint1", "hint2"]
        }
        """
        return await LLMService.ask_llm(prompt)

    @staticmethod
    async def generate_hr():
        prompt = """
        Generate 1 HR interview question with explanation of what interviewer expects.
        Return JSON:
        {
          "question": "",
          "expected_answer": ""
        }
        """
        return await LLMService.ask_llm(prompt)

    @staticmethod
    async def generate_resume_question(resume_text: str):
        prompt = f"""
        Based on this candidate resume:
        {resume_text}

        Generate 3 resume-based interview questions.
        Return JSON:
        {{
          "questions": ["q1", "q2", "q3"]
        }}
        """
        return await LLMService.ask_llm(prompt)
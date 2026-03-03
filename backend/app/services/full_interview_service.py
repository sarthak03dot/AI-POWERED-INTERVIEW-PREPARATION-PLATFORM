from app.services.question_service import QuestionService

class FullInterviewService:

    @staticmethod
    async def generate_full_interview(topic: str = "general", difficulty: str = "medium"):
        # 1. MCQ
        mcq = await QuestionService.generate_mcq(topic, difficulty)

        # 2. Coding
        coding = await QuestionService.generate_coding(topic, difficulty)

        # 3. System Design
        system_design = await QuestionService.generate_system_design()

        # 4. HR
        hr = await QuestionService.generate_hr()

        return {
            "mcq": mcq,
            "coding": coding,
            "system_design": system_design,
            "hr": hr
        }
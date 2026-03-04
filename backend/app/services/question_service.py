from app.services.llm_service import LLMService
from app.services.csv_service import CSVService
import json
import re

def extract_json(text):
    # Try to find JSON block in markdown
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    
    # Fallback: try to find anything that looks like a JSON object or array
    match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', text)
    if match:
        return match.group(1).strip()
        
    return text.strip()

class QuestionService:

    @staticmethod
    async def generate_mcq(topic: str, difficulty: str):
        # Try CSV first
        filters = {"topic": topic, "difficulty": difficulty}
        row = CSVService.get_random_row('mcq.csv', filters)
        
        if row:
            return CSVService.parse_json_fields(row, ['options'])
        
        # Fallback to LLM if not found in CSV
        prompt = f"""
        Generate 1 technical MCQ on {topic}.
        Difficulty: {difficulty}.
        Return JSON ONLY:
        {{
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "correct option",
          "explanation": "short explanation"
        }}
        """
        reply = await LLMService.ask_llm(prompt)
        # Parse and save to CSV for future use
        try:
            clean_json = extract_json(reply)
            data = json.loads(clean_json)
            CSVService.append_row('mcq.csv', {
                "topic": topic,
                "difficulty": difficulty,
                "question": data['question'],
                "options": json.dumps(data['options']),
                "answer": data['answer'],
                "explanation": data['explanation']
            })
            return data
        except:
            return reply

    @staticmethod
    async def generate_coding(topic: str, difficulty: str):
        # Try CSV first
        filters = {"topic": topic, "difficulty": difficulty}
        row = CSVService.get_random_row('coding.csv', filters)
        
        if row:
            return row

        # Fallback to LLM
        prompt = f"""
        Generate 1 coding interview problem on {topic}.
        Difficulty: {difficulty}.
        Return JSON ONLY:
        {{
          "title": "",
          "description": "",
          "input_format": "",
          "output_format": "",
          "constraints": "",
          "example": ""
        }}
        """
        reply = await LLMService.ask_llm(prompt)
        try:
            clean_json = extract_json(reply)
            data = json.loads(clean_json)
            CSVService.append_row('coding.csv', {
                "topic": topic,
                "difficulty": difficulty,
                **data
            })
            return data
        except:
            return reply

    @staticmethod
    async def generate_system_design():
        # Try CSV first
        row = CSVService.get_random_row('system_design.csv')
        if row:
            return CSVService.parse_json_fields(row, ['expectations', 'hints'])

        # Fallback
        prompt = """
        Generate 1 system design interview question.
        Return JSON ONLY:
        {
          "question": "",
          "expectations": ["point1", "point2", "point3"],
          "hints": ["hint1", "hint2"]
        }
        """
        reply = await LLMService.ask_llm(prompt)
        try:
            clean_json = extract_json(reply)
            data = json.loads(clean_json)
            CSVService.append_row('system_design.csv', {
                "question": data['question'],
                "expectations": json.dumps(data['expectations']),
                "hints": json.dumps(data['hints'])
            })
            return data
        except:
            return reply

    @staticmethod
    async def generate_hr():
        # Try CSV first
        row = CSVService.get_random_row('hr.csv')
        if row:
            return row

        # Fallback
        prompt = """
        Generate 1 HR interview question with explanation of what interviewer expects.
        Return JSON ONLY:
        {
          "question": "",
          "expected_answer": ""
        }
        """
        reply = await LLMService.ask_llm(prompt)
        try:
            clean_json = extract_json(reply)
            data = json.loads(clean_json)
            CSVService.append_row('hr.csv', data)
            return data
        except:
            return reply

    @staticmethod
    async def generate_resume_question(resume_text: str):
        # Resume questions are specific to text, so CSV serves as a cache of generic or previous ones if found, 
        # but here we'll just try to fetch a random set if LLM fails or for variety.
        row = CSVService.get_random_row('resume.csv')
        if row:
             return CSVService.parse_json_fields(row, ['questions'])

        # Fallback
        prompt = f"""
        Based on this candidate resume:
        {resume_text}

        Generate 3 resume-based interview questions.
        Return JSON ONLY:
        {{
          "questions": ["q1", "q2", "q3"]
        }}
        """
        reply = await LLMService.ask_llm(prompt)
        try:
            clean_json = extract_json(reply)
            data = json.loads(clean_json)
            CSVService.append_row('resume.csv', {
                "questions": json.dumps(data['questions'])
            })
            return data
        except:
            return reply
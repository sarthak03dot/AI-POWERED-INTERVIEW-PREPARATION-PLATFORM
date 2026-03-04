import google.generativeai as genai
from app.core.config import settings

# Configure the API key globally
genai.configure(api_key=settings.GEMINI_API_KEY)

class LLMService:
    models = {
        "gemini-2.5-flash": genai.GenerativeModel("gemini-2.5-flash"),
        "gemini-2.5-pro": genai.GenerativeModel("gemini-2.5-pro"),
        "gemini-2.5-flash-lite": genai.GenerativeModel("gemini-2.5-flash-lite"),
        "gemini-1.0-pro": genai.GenerativeModel("gemini-1.0-pro"),
    }

    @staticmethod
    async def ask_llm(prompt: str):
        # We'll default to the free tier 2.5 flash
        model = LLMService.models["gemini-2.5-flash"]
        try:
            response = await model.generate_content_async(prompt)
            # The .text property extracts the message content
            return response.text
        except Exception as e:
            raise Exception(f"Gemini LLM API Error: {str(e)}")
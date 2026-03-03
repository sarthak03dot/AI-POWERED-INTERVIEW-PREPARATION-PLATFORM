import httpx
from app.core.config import settings

class LLMService:
    @staticmethod
    async def ask_llm(prompt: str):
        headers = {
            "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.6
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(settings.DEEPSEEK_URL, json=payload, headers=headers)

        data = response.json()
        return data["choices"][0]["message"]["content"]
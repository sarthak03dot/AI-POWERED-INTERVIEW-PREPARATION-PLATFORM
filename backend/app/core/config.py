import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGO: str = os.getenv("JWT_ALGO", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))
    DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

settings = Settings()
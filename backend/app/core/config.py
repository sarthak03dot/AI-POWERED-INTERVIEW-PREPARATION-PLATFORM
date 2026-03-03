import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGO: str = os.getenv("JWT_ALGO")
    DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

settings = Settings()
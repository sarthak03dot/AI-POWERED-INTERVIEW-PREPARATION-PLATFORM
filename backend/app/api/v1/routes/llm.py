from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import LLMService

router = APIRouter()

class Prompt(BaseModel):
    message: str

@router.post("/ask")
async def ask_llm_career_coach(body: Prompt):
    """AI Career Coach for resolving doubts and career advice."""
    reply = await LLMService.ask_llm(body.message)
    return {"reply": reply}
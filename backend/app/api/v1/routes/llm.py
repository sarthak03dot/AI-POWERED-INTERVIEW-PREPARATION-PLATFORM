from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import LLMService

router = APIRouter()

class Prompt(BaseModel):
    message: str

@router.post("/ask")
async def ask_llm_route(body: Prompt):
    reply = await LLMService.ask_llm(body.message)
    return {"reply": reply}
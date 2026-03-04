from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.question_service import QuestionService
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class MCQRequest(BaseModel):
    topic: str
    difficulty: str

class CodingRequest(BaseModel):
    topic: str
    difficulty: str

class ResumeRequest(BaseModel):
    resume_text: str


@router.post("/mcq")
async def mcq_api(body: MCQRequest):
    reply = await QuestionService.generate_mcq(body.topic, body.difficulty)
    return {"reply": reply}

@router.post("/coding")
async def coding_api(body: CodingRequest):
    reply = await QuestionService.generate_coding(body.topic, body.difficulty)
    return {"reply": reply}

@router.get("/system-design")
async def system_design_api():
    reply = await QuestionService.generate_system_design()
    return {"reply": reply}

@router.get("/hr")
async def hr_api():
    reply = await QuestionService.generate_hr()
    return {"reply": reply}

@router.post("/resume")
async def resume_api(body: ResumeRequest):
    reply = await QuestionService.generate_resume_question(body.resume_text)
    return {"reply": reply}
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
    return await QuestionService.generate_mcq(body.topic, body.difficulty)

@router.post("/coding")
async def coding_api(body: CodingRequest):
    return await QuestionService.generate_coding(body.topic, body.difficulty)

@router.get("/system-design")
async def system_design_api():
    return await QuestionService.generate_system_design()

@router.get("/hr")
async def hr_api():
    return await QuestionService.generate_hr()

@router.post("/resume")
async def resume_api(body: ResumeRequest):
    return await QuestionService.generate_resume_question(body.resume_text)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.auth_middleware import AuthMiddleware
from app.core.error_handler import global_exception_handler
from app.database import engine, Base
from app.models import user as user_model, progress as progress_model, question_history as history_model, topic_progress as topic_model, challenge as challenge_model, mock_interview as mock_model # Import all models for create_all

# Create tables
Base.metadata.create_all(bind=engine)

# Routers
from app.api.v1.routes import (
    llm as llm_router, 
    auth as auth_router, 
    protected as protected_router, 
    questions as questions_router, 
    daily as daily_router, 
    topic_progress as topic_router, 
    history as history_router, 
    full_interview as interview_router, 
    stats as stats_router, 
    evaluate as evaluate_router, 
    mock_interview as mock_interview_router
)

app = FastAPI(
    title="AI Interview Prep Backend",
    version="1.0.0"
)

from app.core.config import settings

# Auth Middleware MUST be added first so it runs AFTER CORS
app.add_middleware(AuthMiddleware)

# CORS Middleware MUST be added last so it runs FIRST in request lifecycle
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(llm_router.router, prefix="/api/v1/llm")
app.include_router(auth_router.router, prefix="/api/v1/auth")
app.include_router(protected_router.router, prefix="/api/v1")
app.include_router(questions_router.router, prefix="/api/v1/questions")
app.include_router(daily_router.router, prefix="/api/v1/daily")
app.include_router(history_router.router, prefix="/api/v1/history")
app.include_router(topic_router.router, prefix="/api/v1/topic-progress")
app.include_router(interview_router.router, prefix="/api/v1/interview")
app.include_router(stats_router.router, prefix="/api/v1/stats")
app.include_router(evaluate_router.router, prefix="/api/v1/evaluate")
app.include_router(mock_interview_router.router, prefix="/api/v1/mock-interview")

# Health Check
@app.get("/")
async def root():
    return {"message": "AI Interview Prep API is running. Visit /docs for documentation."}

# Error Handler
@app.exception_handler(Exception)
async def all_exceptions(request: Request, exc: Exception):
    return await global_exception_handler(request, exc)
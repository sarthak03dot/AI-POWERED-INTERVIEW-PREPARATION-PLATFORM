from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.auth_middleware import AuthMiddleware
from app.core.error_handler import global_exception_handler

# Routers
from app.api.v1.routes import (
    llm,
    auth,
    protected,
    questions,
    daily,
    topic_progress,
    history,
    full_interview,
    stats,
)

app = FastAPI(
    title="AI Interview Prep Backend",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Middleware
app.add_middleware(AuthMiddleware)

# Routers
app.include_router(llm.router, prefix="/api/v1/llm")
app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(protected.router, prefix="/api/v1")
app.include_router(questions.router, prefix="/api/v1/questions")
app.include_router(daily.router, prefix="/api/v1/daily")
app.include_router(history.router, prefix="/api/v1/history")
app.include_router(topic_progress.router, prefix="/api/v1/topic-progress")
app.include_router(full_interview.router, prefix="/api/v1/interview")
app.include_router(stats.router, prefix="/api/v1/stats")

# Error Handler
@app.exception_handler(Exception)
async def all_exceptions(request: Request, exc: Exception):
    return await global_exception_handler(request, exc)
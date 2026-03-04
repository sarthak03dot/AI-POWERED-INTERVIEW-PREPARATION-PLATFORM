from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

from app.core.config import settings

async def global_exception_handler(request: Request, exc: Exception):
    error_response = {
        "error": "Something went wrong"
    }
    if settings.DEBUG:
        error_response["details"] = str(exc)
        
    return JSONResponse(
        status_code=500,
        content=error_response
    )
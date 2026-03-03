from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong",
            "details": str(exc)
        }
    )
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import Security

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_paths = ["/api/v1/auth", "/docs", "/redoc", "/openapi.json", "/favicon.ico"]
        
        if any(request.url.path.startswith(path) for path in public_paths):
            return await call_next(request)

        token = request.headers.get("Authorization")

        if not token:
            return JSONResponse(status_code=401, content={"detail": "Token missing"})

        try:
            clean = token.replace("Bearer ", "")
            user = Security.decode_jwt(clean)
            request.state.user = user
        except Exception:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        return await call_next(request)
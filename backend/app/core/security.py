import bcrypt
from datetime import datetime, timedelta
import jwt
from app.core.config import settings
from fastapi import Request, HTTPException

class Security:

    @staticmethod
    def hash_password(password: str) -> str:
        # bcrypt requires bytes
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pwd_bytes, salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        pwd_bytes = password.encode('utf-8')
        hashed_bytes = hashed.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)

    @staticmethod
    def create_access_token(data: dict, expires_in: int = None):
        if expires_in is None:
            expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        payload = data.copy()
        payload.update({
            "exp": datetime.utcnow() + timedelta(minutes=expires_in),
            "type": "access"
        })
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)
        
    @staticmethod
    def create_refresh_token(data: dict, expires_in: int = None):
        if expires_in is None:
            # default 7 days 
            expires_in = 60 * 24 * 7
        payload = data.copy()
        payload.update({
            "exp": datetime.utcnow() + timedelta(minutes=expires_in),
            "type": "refresh"
        })
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)

    @staticmethod
    def decode_jwt(token: str, expected_type: str = "access"):
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])
        if payload.get("type") != expected_type:
            raise Exception("Invalid token type")
        return payload
        
def get_current_user(request: Request):
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
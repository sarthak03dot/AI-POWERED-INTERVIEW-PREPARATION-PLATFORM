from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Security:

    @staticmethod
    def hash_password(password: str):
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(password: str, hashed: str):
        return pwd_context.verify(password, hashed)

    @staticmethod
    def create_jwt(data: dict, expires_in: int = 60*24):
        payload = data.copy()
        payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_in)
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)
        return token

    @staticmethod
    def decode_jwt(token: str):
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])
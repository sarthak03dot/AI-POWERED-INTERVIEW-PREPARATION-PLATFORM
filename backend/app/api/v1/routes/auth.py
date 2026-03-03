from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.services.user_service import UserService
from app.core.security import Security
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RegisterDTO(BaseModel):
    username: str
    email: str
    password: str

class LoginDTO(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterDTO, db: Session = Depends(get_db)):
    user = UserService.create_user(db, data.username, data.email, data.password)
    return {"msg": "User created", "user_id": user.id}

class RefreshRequestDTO(BaseModel):
    refresh_token: str

@router.post("/login")
def login(data: LoginDTO, db: Session = Depends(get_db)):
    user = UserService.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = Security.create_access_token({"user_id": user.id})
    refresh_token = Security.create_refresh_token({"user_id": user.id})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token(data: RefreshRequestDTO):
    try:
        # decode expects 'type' == 'refresh'
        payload = Security.decode_jwt(data.refresh_token, expected_type="refresh")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
            
        new_access = Security.create_access_token({"user_id": user_id})
        return {
            "access_token": new_access,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired refresh token: {str(e)}")
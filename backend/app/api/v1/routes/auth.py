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

@router.post("/login")
def login(data: LoginDTO, db: Session = Depends(get_db)):
    user = UserService.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = Security.create_jwt({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}
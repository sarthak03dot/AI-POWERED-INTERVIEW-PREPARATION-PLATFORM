from fastapi import APIRouter, Header, HTTPException
from app.core.security import Security

router = APIRouter()

@router.get("/secure")
def protected(auth: str = Header(default=None)):
    if not auth:
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth.replace("Bearer ", "")
    payload = Security.decode_jwt(token)

    return {"msg": "You are inside secure route", "user_id": payload["user_id"]}
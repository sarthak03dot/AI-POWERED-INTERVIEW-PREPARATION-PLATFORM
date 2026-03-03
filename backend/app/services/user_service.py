from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import Security

class UserService:

    @staticmethod
    def create_user(db: Session, username: str, email: str, password: str):
        hashed = Security.hash_password(password)
        user = User(username=username, email=email, password=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not Security.verify_password(password, user.password):
            return None
        return user
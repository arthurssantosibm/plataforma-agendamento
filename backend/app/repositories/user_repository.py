from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import verify_password

def create_user(db: Session, data: UserCreate):
    user = User(
        name=data.name,
        email=data.email,
        password=data.password,  # depois a gente faz hash
        phone=data.phone,
        role=data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session):
    return db.query(User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return None
        
    if not verify_password(password, user.hashed_password):
        return None
    return user
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate

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

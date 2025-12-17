from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Usuários"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None
    role: str = "client"

def hash_password(password: str):
    return pwd_context.hash(password)

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

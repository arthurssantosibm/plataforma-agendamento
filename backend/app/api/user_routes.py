from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.user import UserCreate, UserResponse
from app.repositories.user_repository import create_user, get_users

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserResponse)
def create(data: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user(db, data)
    except Exception:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

@router.get("/", response_model=list[UserResponse])
def list_all(db: Session = Depends(get_db)):
    return get_users(db)

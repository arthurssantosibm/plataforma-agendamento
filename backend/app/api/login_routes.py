from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.user import UserResponse 
from app.schemas.token import TokenRequest 
from app.repositories.user_repository import authenticate_user

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/login", response_model=UserResponse)
def login(data: TokenRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, email=data.email, password=data.password) 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )
    return user
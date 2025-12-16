from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.service_schema import ServiceCreate, ServiceResponse
from app.models.service import Service

router = APIRouter(prefix="/services", tags=["Services"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    new_service = Service(**service.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


@router.get("/", response_model=list[ServiceResponse])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

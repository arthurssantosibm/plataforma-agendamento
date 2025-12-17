from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.service import ServiceCreate, ServiceResponse
from app.repositories import service_repository

router = APIRouter(prefix="/services", tags=["Services"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ServiceResponse)
def create(service: ServiceCreate, db: Session = Depends(get_db)):
    return service_repository.create_service(db, service)

@router.get("/", response_model=list[ServiceResponse])
def list_services(db: Session = Depends(get_db)):
    return service_repository.get_services(db)

@router.get("/{service_id}", response_model=ServiceResponse)
def get(service_id: int, db: Session = Depends(get_db)):
    service = service_repository.get_service_by_id(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return service

@router.delete("/{service_id}")
def delete(service_id: int, db: Session = Depends(get_db)):
    service = service_repository.delete_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return {"message": "Serviço removido"}

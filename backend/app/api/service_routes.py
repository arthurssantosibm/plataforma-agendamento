from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse
)
from app.repositories.service_repository import (
    create_service,
    get_services,
    get_service_by_id,
    update_service,
    delete_service
)

router = APIRouter(prefix="/services", tags=["Services"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ServiceResponse)
def create(data: ServiceCreate, db: Session = Depends(get_db)):
    return create_service(db, data)

@router.get("/", response_model=list[ServiceResponse])
def list_services(
    active_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    return get_services(db, active_only)

@router.get("/{service_id}", response_model=ServiceResponse)
def get(service_id: int, db: Session = Depends(get_db)):
    service = get_service_by_id(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return service

@router.put("/{service_id}", response_model=ServiceResponse)
def update(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db)
):
    service = update_service(db, service_id, data)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return service

@router.delete("/{service_id}")
def delete(service_id: int, db: Session = Depends(get_db)):
    service = delete_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return {"message": "Serviço removido"}

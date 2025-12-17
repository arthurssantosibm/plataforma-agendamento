from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate

router = APIRouter(
    prefix="/services",
    tags=["Serviços"]
)

@router.get("/")
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

@router.post("/")
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    new_service = Service(**service.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.get("/{service_id}")
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return service

@router.put("/{service_id}")
def update_service(service_id: int, service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = db.query(Service).get(service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")

    for key, value in service.dict().items():
        setattr(db_service, key, value)

    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")

    db.delete(service)
    db.commit()
    return {"message": "Serviço removido com sucesso"}

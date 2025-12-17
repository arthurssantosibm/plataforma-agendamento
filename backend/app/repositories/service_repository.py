from sqlalchemy.orm import Session
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate

def create_service(db: Session, data: ServiceCreate):
    service = Service(**data.dict())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

def get_services(db: Session, active_only: bool = False):
    query = db.query(Service)
    if active_only:
        query = query.filter(Service.active == True)
    return query.all()

def get_service_by_id(db: Session, service_id: int):
    return db.query(Service).filter(Service.id == service_id).first()

def update_service(db: Session, service_id: int, data: ServiceUpdate):
    service = get_service_by_id(db, service_id)
    if not service:
        return None

    for field, value in data.dict(exclude_unset=True).items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service

def delete_service(db: Session, service_id: int):
    service = get_service_by_id(db, service_id)
    if not service:
        return None

    db.delete(service)
    db.commit()
    return service

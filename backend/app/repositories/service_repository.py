from app.models.service import Service
from sqlalchemy.orm import Session
from app.schemas.service import ServiceCreate, ServiceUpdate

def update_service(db: Session, service_id: int, service_data: ServiceUpdate):
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        return None

    for field, value in service_data.dict(exclude_unset=True).items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service

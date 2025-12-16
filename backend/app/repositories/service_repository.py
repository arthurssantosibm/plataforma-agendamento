from sqlalchemy.orm import Session
from app.models.service import Service
from backend.app.schemas.service_schema import ServiceCreate

class ServiceRepository:
    @staticmethod
    def create(db: Session, service_data: ServiceCreate):
        service = Service(**service_data.dict())
        db.add(service)
        db.commit()
        db.refresh(service)
        return service
    
    @staticmethod
    def get_all(db: Session):
        return db.query(Service).filter(Service.active == True).all()
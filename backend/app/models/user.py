from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    addresses = relationship("Address", back_populates="user")
    # appointments = relationship("Appointment", back_populates="client")
    notifications = relationship("Notification", back_populates="user")

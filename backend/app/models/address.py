from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    street = Column(String(100))
    number = Column(String(20))
    city = Column(String(50))
    state = Column(String(50))
    zip_code = Column(String(20))

    user = relationship("User", back_populates="addresses")

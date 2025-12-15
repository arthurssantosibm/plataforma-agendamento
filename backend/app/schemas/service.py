from pydantic import BaseModel

class Service(BaseModel):
    id: int
    name: str 
    price: float
    
    class Config:
        from_attributes = True
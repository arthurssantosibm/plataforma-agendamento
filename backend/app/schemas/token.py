from pydantic import BaseModel

class TokenRequest(BaseModel):
    username: str
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    user_email: str
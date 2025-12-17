from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()
for u in db.query(User).all():
    print(u.id, u.name, u.email, u.role)
db.close()

from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()

users = db.query(User).all()

print("📋 Lista de usuários:")
for u in users:
    print(
        f"ID: {u.id} | Nome: {u.name} | Email: {u.email} | Role: {u.role}"
    )

db.close()

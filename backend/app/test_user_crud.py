from app.core.database import SessionLocal
from app.models.user import User
from app.repositories.user_repository import UserRepository

db = SessionLocal()

# CREATE
user = User(
    name="Arthur",
    email="arthur@email.com",
    password="123456",
    role="client"
)

UserRepository.create(db, user)

# READ
users = UserRepository.get_all(db)
for u in users:
    print(u.id, u.name, u.email, u.role)

db.close()

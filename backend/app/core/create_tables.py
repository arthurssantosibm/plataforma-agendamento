from .database import engine, Base
from app.models import *

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Todas as tabelas e relacionamentos foram criados!")

if __name__ == "__main__":
    create_tables()

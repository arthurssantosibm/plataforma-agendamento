from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

# 🔹 URL de conexão com PostgreSQL
DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

# 🔹 Engine
engine = create_engine(DATABASE_URL)

# 🔹 Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 🔹 Base dos models
Base = declarative_base()

# 🔹 DEPENDÊNCIA DO FASTAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔹 (Opcional) Teste de conexão
if __name__ == "__main__":
    try:
        with engine.connect():
            print("✅ Conexão via SQLAlchemy com PostgreSQL realizada com sucesso!")
    except Exception as e:
        print("❌ Erro ao conectar no banco:", e)

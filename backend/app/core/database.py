from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os


load_dotenv()

# 1. Montar a URL de Conexão com base nas variáveis de ambiente
# O SQLAlchemy usa um formato de URL (Ex: "postgresql://user:password@host:port/dbname")
DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

# 2. Criar o Motor (Engine)
# O motor é o ponto de partida para qualquer interação com o banco de dados
engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# 3. Criar o Base
# Base é a classe base para as declarações dos modelos
Base = declarative_base()

# Opcional: Testar a conexão (Você pode remover seu código anterior de teste direto com psycopg2)
try:
    # Tenta estabelecer a conexão (pingar o banco)
    with engine.connect() as connection:
        print("✅ Conexão via SQLAlchemy com PostgreSQL realizada com sucesso!")
except Exception as e:
    print("❌ Erro ao conectar no banco via SQLAlchemy:", e)
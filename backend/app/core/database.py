from dotenv import load_dotenv
import psycopg2
import os


load_dotenv(dotenv_path=".env")


def get_connection():
    """Retorna uma nova conexão com o PostgreSQL."""
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
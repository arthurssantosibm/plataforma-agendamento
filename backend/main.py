from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.service_routes import router as service_router

app = FastAPI(title="Plataforma de Agendamento")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(service_router)

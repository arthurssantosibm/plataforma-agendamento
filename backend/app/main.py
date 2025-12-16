from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Plataforma de Agendamento")

# CORS (permite HTML acessar a API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users")
def health():
    return {"status": "API rodando"}

from app.api.users import router as users_router

app.include_router(users_router)

from app.api.services import router as services_router
app.include_router(services_router)

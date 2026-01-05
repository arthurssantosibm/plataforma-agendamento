from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.appointment_routes import router as appointment_router
from app.api.service_routes import router as service_router
from app.api.user_routes import router as user_router
from app.api.login_routes import router as login_router

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
app.include_router(appointment_router)
app.include_router(user_router)
app.include_router(login_router)


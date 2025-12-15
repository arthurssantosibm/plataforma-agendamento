from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
from app.schemas.service import Service

class AppointmentCreate(BaseModel):
    # Campos que vêm do cliente
    client_id: int 
    start_datetime: datetime 
    end_datetime: datetime 
    
    # Campo extra para a tabela de associação M:N
    service_ids: List[int] # Lista de IDs de serviços selecionados

    # Configuração Pydantic (opcional, mas boa prática)
    class Config:
        # Permite que o Pydantic seja usado com modelos SQLAlchemy (necessário para a próxima seção)
        from_attributes = True
        
# Herda os campos de entrada e adiciona os campos de saída gerados pelo banco
class Appointment(AppointmentCreate):
    id: int
    status: str # Campo que tem um valor default no seu modelo SQLAlchemy
    created_at: datetime # Campo gerado automaticamente

    # 💡 Nota: Você pode omitir 'service_ids' aqui se não quiser que o ID do serviço
    # volte na resposta, mas vamos mantê-lo para simplificar o teste.
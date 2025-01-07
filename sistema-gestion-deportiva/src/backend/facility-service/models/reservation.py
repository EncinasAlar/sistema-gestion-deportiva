from pydantic import BaseModel
from datetime import datetime

class ReservationCreate(BaseModel):
    facility_id: str  # ID de la instalación
    start_time: datetime  # Hora de inicio
    end_time: datetime  # Hora de fin
    

class ReservationResponse(BaseModel):
    id: str
    facility_id: str
    facility_name: str  # Nuevo campo
    user_id: str
    start_time: datetime
    end_time: datetime
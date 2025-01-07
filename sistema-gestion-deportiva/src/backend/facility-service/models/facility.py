from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FacilityBase(BaseModel):
    name: str
    type: str  # Tipo de instalación
    description: Optional[str]
    available_times: Optional[List[datetime]] = []

class FacilityCreate(FacilityBase):
    pass

class FacilityResponse(FacilityBase):
    id: str

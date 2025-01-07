from fastapi import FastAPI
from routes.facility_routes import router as facility_router
from routes.reservation_routes import router as reservation_router
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
class Settings(BaseModel):
    authjwt_secret_key: str = "ecabf4c7e38a5bb1627e85c58ec13d03c40bbd20c89a911cfd6bfac747465a95"
    authjwt_algorithm: str = "HS256"

@AuthJWT.load_config
def get_config():
    return Settings()

@AuthJWT.token_in_denylist_loader
def check_if_token_in_denylist(decrypted_token):
    # No depende de 'type', siempre retorna False
    return False


client = MongoClient("mongodb://db:27017")
db = client.sports_management

# Registrar rutas
app.include_router(facility_router, prefix="/facilities", tags=["Facilities"])
app.include_router(reservation_router, prefix="/reservations", tags=["Reservations"])

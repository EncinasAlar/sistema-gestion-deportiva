from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from models.reservation import ReservationCreate, ReservationResponse
from fastapi_jwt_auth import AuthJWT
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import timedelta

router = APIRouter()

# Conexión a MongoDB
client = MongoClient("mongodb://db:27017")
db = client.sports_management
reservations_collection = db.reservations
facilities_collection = db.facilities

buffer_time = timedelta(minutes=5)

@router.post("/", response_model=ReservationResponse)
async def create_reservation(
    reservation: ReservationCreate, 
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()  # Verifica que el usuario esté autenticado
    user_id = Authorize.get_jwt_subject()  # Obtiene el ID del usuario desde el token

    # Validar que la instalación exista
    facility = facilities_collection.find_one({"_id": ObjectId(reservation.facility_id)})
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    # Validar disponibilidad de la instalación
    buffer_time = timedelta(minutes=1)
    overlapping_reservations = reservations_collection.count_documents({
        "facility_id": reservation.facility_id,
        "$or": [
            {
                "start_time": {"$lt": reservation.end_time + buffer_time},
                "end_time": {"$gt": reservation.start_time - buffer_time}
            }
        ]
    })

    if overlapping_reservations > 0:
        raise HTTPException(
            status_code=400,
            detail="El horario seleccionado no está disponible para esta instalación."
        )
    # Inserta la reserva junto con el ID del usuario y el status de la reserva
    doc = {
        "facility_id": reservation.facility_id,
        "facility_name": facility["name"],  # Añadir el nombre de la instalación
        "user_id": user_id,
        "start_time": reservation.start_time,
        "end_time": reservation.end_time,
    }
    result = reservations_collection.insert_one(doc)
    return {**doc, "id": str(result.inserted_id)}
    
@router.get("/", response_model=List[ReservationResponse])
async def get_user_reservations(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        user_id = Authorize.get_jwt_subject()
        
        # Obtener todas las reservas del usuario
        reservations = reservations_collection.find({"user_id": user_id})
        result = []

        for reservation in reservations:
            # Obtener el nombre de la instalación
            facility = facilities_collection.find_one({"_id": ObjectId(reservation["facility_id"])})
            facility_name = facility["name"] if facility else "Desconocido"
            
            # Agregar `facility_name` a la respuesta
            result.append({
                **reservation,
                "id": str(reservation["_id"]),
                "facility_name": facility_name  # Incluye el campo necesario
            })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reservations: {e}")

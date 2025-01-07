from fastapi import APIRouter, HTTPException, Depends, status
from models.facility import FacilityCreate, FacilityResponse
from fastapi_jwt_auth import AuthJWT
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson.objectid import ObjectId

router = APIRouter()

# Conexión a MongoDB
try:
    client = MongoClient("mongodb://db:27017")
    db = client.sports_management
    facilities_collection = db.facilities
    print("Conexión a MongoDB exitosa")
except PyMongoError as e:
    print(f"Error conectando a MongoDB: {e}")
    raise HTTPException(status_code=500, detail="Database connection error")

# Crear una instalación
@router.post("/", response_model=FacilityResponse)
async def create_facility(
    facility: FacilityCreate, 
    Authorize: AuthJWT = Depends()
):
    Authorize.jwt_required()  # Verifica que el token es válido
    current_user = Authorize.get_raw_jwt()  # Obtiene el contenido del token decodificado
    print(current_user) # Imprime el token decodificado para depurar
    print(f"Token decodificado: {current_user}")
    current_user = Authorize.get_jwt_subject()  # Recupera el sujeto del token
    print(f"Usuario autenticado: {current_user}")

    doc = facility.dict()
    result = facilities_collection.insert_one(doc)
    return {**doc, "id": str(result.inserted_id)}

@router.delete("/{facility_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_facility(facility_id: str, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()  # Requiere autenticación

        # Verifica si la instalación existe
        facility = facilities_collection.find_one({"_id": ObjectId(facility_id)})
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found")

        # Eliminar la instalación
        result = facilities_collection.delete_one({"_id": ObjectId(facility_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete facility")

        return {"message": "Facility deleted successfully"}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")


# Obtener todas las instalaciones
@router.get("/", response_model=list[FacilityResponse], status_code=status.HTTP_200_OK)
async def get_facilities(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()  # Requiere autenticación
        facilities = facilities_collection.find()
        return [
            {**facility, "id": str(facility["_id"])} for facility in facilities
        ]
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

# Obtener una instalación específica
@router.get("/{facility_id}", response_model=FacilityResponse, status_code=status.HTTP_200_OK)
async def get_facility(facility_id: str, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()  # Requiere autenticación
        facility = facilities_collection.find_one({"_id": ObjectId(facility_id)})
        if not facility:
            raise HTTPException(status_code=404, detail="Facility not found")
        return {**facility, "id": str(facility["_id"])}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

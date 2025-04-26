from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

from database import get_user_collection
from models import UserInDB

router = APIRouter()

# Configuraciones de seguridad
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "promptect_super_secret_123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    users = get_user_collection()

    # Validar email duplicado
    existing_user = await users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado.")

    # Validar longitud mínima de contraseña
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres.")

    # Hashear y guardar
    hashed_password = pwd_context.hash(user.password)
    user_dict = {"email": user.email, "hashed_password": hashed_password}
    await users.insert_one(user_dict)

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users = get_user_collection()
    user = await users.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


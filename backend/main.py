# Promptect API - Backend completo con email de bienvenida (SendGrid)
from routes import dashboard_data
from routes import recent_events
app.include_router(recent_events.router)


app.include_router(dashboard_data.router)
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from bson.objectid import ObjectId
from passlib.context import CryptContext
from jose import JWTError, jwt
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import re
import uuid
import datetime
import os

load_dotenv()

# Configuración
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "mysecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "promptect")
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
users_collection = db.users
history_collection = db.analysis_history

app = FastAPI(
    title="Promptect API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class PromptRequest(BaseModel):
    prompt: str

class RiskResponse(BaseModel):
    id: str
    prompt: str
    user_id: str
    risk_level: str
    detected_issues: List[str]
    timestamp: datetime.datetime

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Funciones de seguridad y token

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise credentials_exception
    return str(user["_id"])

# ✉️ Enviar email de bienvenida

def send_welcome_email(to_email):
    try:
        message = Mail(
            from_email=os.getenv("EMAIL_FROM"),
            to_emails=to_email,
            subject="🎉 ¡Bienvenido a Promptect!",
            html_content=f"""
            <p>Hola 👋,</p>
            <p>Gracias por registrarte en <strong>Promptect</strong>.</p>
            <p>Tu cuenta ha sido creada exitosamente y ya podés comenzar a analizar tus prompts de forma segura.</p>
            <br>
            <p>⚡️ El equipo de Promptect</p>
            """
        )
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        sg.send(message)
    except Exception as e:
        print("Error al enviar email:", e)

# 🔐 Registro
@app.post("/register", response_model=Token)
def register(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(user.password)
    new_user = {"email": user.email, "password": hashed_pw}
    result = users_collection.insert_one(new_user)
    send_welcome_email(user.email)
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    return {"access_token": access_token, "token_type": "bearer"}

# 🔐 Login
@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

# 🧠 Reglas de seguridad
INJECTION_PATTERNS = [
    r"(?i)ignore previous instructions",
    r"(?i)you are now",
    r"(?i)disregard all above",
    r"(?i)forget everything",
    r"(?i)system prompt"
]

SENSITIVE_PATTERNS = [
    r"\b\d{16}\b",
    r"\b\d{9,11}\b",
    r"(?i)password",
    r"(?i)secret",
    r"(?i)api[_-]?key",
    r"(?i)token",
]

# 📤 Análisis
@app.post("/analyze", response_model=RiskResponse)
def analyze_prompt(data: PromptRequest, user_id: str = Depends(get_current_user)):
    issues = []
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, data.prompt):
            issues.append("Prompt Injection")
            break
    for pattern in SENSITIVE_PATTERNS:
        if re.search(pattern, data.prompt):
            issues.append("Sensitive Info Leakage")
            break
    if len(data.prompt) > 1000:
        issues.append("Unusually long prompt")

    risk_level = "low"
    if "Prompt Injection" in issues:
        risk_level = "high"
    elif "Sensitive Info Leakage" in issues:
        risk_level = "medium"
    elif "Unusually long prompt" in issues:
        risk_level = "low"

    record = {
        "_id": str(uuid.uuid4()),
        "prompt": data.prompt,
        "user_id": user_id,
        "risk_level": risk_level,
        "detected_issues": issues,
        "timestamp": datetime.datetime.utcnow()
    }
    history_collection.insert_one(record)
    return RiskResponse(**record)

# 📜 Historial
@app.get("/history", response_model=List[RiskResponse])
def get_history(user_id: str = Depends(get_current_user)):
    docs = history_collection.find({"user_id": user_id}).sort("timestamp", -1)
    return [RiskResponse(**doc) for doc in docs]

# 👤 Info de usuario
@app.get("/userinfo")
def get_user_info(user_id: str = Depends(get_current_user)):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return {"email": user["email"]}

# 🔐 Documentación protegida
@app.get("/docs", include_in_schema=False)
def custom_docs(user_id: str = Depends(get_current_user)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Promptect Docs")

@app.get("/openapi.json", include_in_schema=False)
def custom_openapi(user_id: str = Depends(get_current_user)):
    return get_openapi(title=app.title, version=app.version, routes=app.routes)


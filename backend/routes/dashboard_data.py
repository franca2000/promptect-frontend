# backend/routes/dashboard_data.py
from fastapi import APIRouter, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel

router = APIRouter()

# Simulación de autenticación para proteger el endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class ChartPoint(BaseModel):
    day: str
    riesgos: int

class DashboardData(BaseModel):
    reports: int
    risk_level: str
    new_users: int
    chart: List[ChartPoint]

@router.get("/dashboard-data", response_model=DashboardData)
def get_dashboard_data(range: int = Query(7), token: str = Depends(oauth2_scheme)):
    # Lógica simulada en base al rango
    simulated_chart = [
        {"day": "Lun", "riesgos": 1},
        {"day": "Mar", "riesgos": 3},
        {"day": "Mié", "riesgos": 2},
        {"day": "Jue", "riesgos": 5},
        {"day": "Vie", "riesgos": 4},
        {"day": "Sáb", "riesgos": 2},
        {"day": "Dom", "riesgos": 1},
    ]

    return {
        "reports": range + 1,
        "risk_level": "Moderado" if range <= 30 else "Bajo",
        "new_users": int(range / 2),
        "chart": simulated_chart[:7 if range == 7 else len(simulated_chart)],
    }

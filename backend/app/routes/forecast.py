"""
Forecast API Routes
GET /api/forecast/{site_id} - 7-day forecast
"""

from fastapi import APIRouter, HTTPException
from app.models.database import get_connection
from app.services.forecaster import generate_forecast

router = APIRouter()


@router.get("/forecast/{site_id}")
def get_forecast(site_id: str):
    """Return 7-day forecast for a monitoring site."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT date, discharge, water_area, turbidity, flood_risk FROM observations WHERE site_id = ? ORDER BY date DESC LIMIT 60",
        (site_id,)
    ).fetchall()
    conn.close()

    historical = [dict(r) for r in reversed(rows)] if rows else []
    forecast = generate_forecast(site_id, historical)
    return forecast

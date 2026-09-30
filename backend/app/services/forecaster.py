"""
Forecasting Service
Generates 7-day ahead forecasts for discharge and flood risk.
Integrates moving average with real-time hydrometeorological forcing
(Rainfall P mm/day, Soil Moisture SM %, Reservoir Release Qres m3/s).
"""

import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random


def moving_average_forecast(values: List[float], steps: int = 7, window: int = 14) -> List[float]:
    """Simple moving average with slight trend component."""
    if not values:
        return [0.0] * steps

    arr = np.array(values[-window:] if len(values) >= window else values)
    base = float(np.mean(arr))

    # Detect trend from last vs first quarter
    if len(arr) >= 4:
        trend = (np.mean(arr[-len(arr)//4:]) - np.mean(arr[:len(arr)//4])) / (window / 2)
    else:
        trend = 0.0

    forecast = []
    for i in range(1, steps + 1):
        val = base + trend * i + random.gauss(0, base * 0.03)
        forecast.append(max(0, val))
    return forecast


def generate_forecast(
    site_id: str,
    historical_data: List[Dict],
    rainfall_mm: Optional[float] = None,
    soil_moisture_pct: Optional[float] = None,
    reservoir_release_m3s: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Generate 7-day forecast for a monitoring site.
    Returns forecast for discharge, water_area, turbidity, and flood_risk,
    with hydrometeorological runoff scaling if real-time inputs are provided.
    """
    base_date = datetime.now()
    dates = [(base_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, 8)]

    if not historical_data:
        # Return synthetic demo forecast
        return {
            "site_id": site_id,
            "forecast_dates": dates,
            "discharge_forecast": [round(random.uniform(8000, 16000), 1) for _ in range(7)],
            "discharge_lower": [round(random.uniform(5000, 8000), 1) for _ in range(7)],
            "discharge_upper": [round(random.uniform(16000, 24000), 1) for _ in range(7)],
            "area_forecast": [round(random.uniform(1500, 3500), 1) for _ in range(7)],
            "turbidity_forecast": [round(random.uniform(20, 60), 1) for _ in range(7)],
            "flood_risk_forecast": [round(random.uniform(0.1, 0.5), 3) for _ in range(7)],
            "flood_alert_threshold": 30000.0,
            "lead_time_hours": 36,
            "note": "Simulated 7-day forecast (ESCI 2026 prototype)",
        }

    # Extract series
    discharges = [d["discharge"] for d in historical_data if d.get("discharge")]
    areas = [d["water_area"] for d in historical_data if d.get("water_area")]
    turbidities = [d["turbidity"] for d in historical_data if d.get("turbidity")]
    flood_risks = [d["flood_risk"] for d in historical_data if d.get("flood_risk")]

    q_fc = moving_average_forecast(discharges)
    a_fc = moving_average_forecast(areas)
    t_fc = moving_average_forecast(turbidities)
    fr_fc = moving_average_forecast(flood_risks)

    # Apply real-time hydrometeorological forcing adjustment
    if rainfall_mm is not None and soil_moisture_pct is not None:
        runoff_boost = (rainfall_mm * 15.0) * (soil_moisture_pct / 100.0)
        res_boost = (reservoir_release_m3s or 0.0) * 0.9
        for i in range(len(q_fc)):
            # Attenuation over the 7-day projection window
            day_decay = max(0.2, 1.0 - (i * 0.12))
            q_fc[i] += (runoff_boost + res_boost) * day_decay
            a_fc[i] += (runoff_boost * 0.05) * day_decay

    # Flood alert threshold = 90th percentile of historical discharge
    if discharges:
        threshold = float(np.percentile(discharges, 90))
    else:
        threshold = 30000.0

    # Recalculate flood risks based on updated forecast
    fr_fc = [min(1.0, max(0.0, q / (threshold * 1.15))) for q in q_fc]

    # Compute uncertainty bounds (±15% to ±25% expanding with time)
    q_lower = [round(max(0, q * (0.88 - i * 0.02)), 1) for i, q in enumerate(q_fc)]
    q_upper = [round(q * (1.12 + i * 0.02), 1) for i, q in enumerate(q_fc)]

    return {
        "site_id": site_id,
        "forecast_dates": dates,
        "discharge_forecast": [round(v, 1) for v in q_fc],
        "discharge_lower": q_lower,
        "discharge_upper": q_upper,
        "area_forecast": [round(v, 1) for v in a_fc],
        "turbidity_forecast": [round(v, 1) for v in t_fc],
        "flood_risk_forecast": [round(v, 3) for v in fr_fc],
        "flood_alert_threshold": round(threshold, 1),
        "lead_time_hours": 36,
        "hydrology_forcing_applied": rainfall_mm is not None,
        "note": "7-day hybrid forecast with rainfall-runoff & reservoir release forcing",
    }

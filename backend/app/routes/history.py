"""
History API Routes
GET /api/history/{site_id}          - Full historical data
GET /api/history/{site_id}/chart    - Chart-optimized data (last N days)
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.database import get_connection
from app.services.anomaly_detector import detect_anomaly_isolation_forest

router = APIRouter()


@router.get("/history/{site_id}")
def get_history(site_id: str, days: int = Query(90, ge=7, le=365)):
    """Return historical observations for a site."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM observations WHERE site_id = ? ORDER BY date DESC LIMIT ?",
        (site_id, days)
    ).fetchall()
    conn.close()
    if not rows:
        raise HTTPException(status_code=404, detail=f"No history found for site '{site_id}'.")
    data = [dict(r) for r in reversed(rows)]
    return {"site_id": site_id, "count": len(data), "data": data}


@router.get("/history/{site_id}/chart")
def get_history_chart(site_id: str, days: int = Query(60, ge=7, le=365)):
    """Return chart-optimized historical data with anomaly labels."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT date, water_area, avg_width, discharge, turbidity, flood_risk, anomaly_flag, ndwi_sim, rainfall_proxy FROM observations WHERE site_id = ? ORDER BY date ASC",
        (site_id,)
    ).fetchall()
    conn.close()

    if not rows:
        return {"site_id": site_id, "labels": [], "datasets": {}}

    data = [dict(r) for r in rows][-days:]

    # Run Isolation Forest anomaly detection
    anomaly_results = detect_anomaly_isolation_forest(data)

    labels = [d["date"] for d in data]
    discharge_vals = [d["discharge"] for d in data]
    area_vals = [d["water_area"] for d in data]
    turbidity_vals = [d["turbidity"] for d in data]
    flood_vals = [d["flood_risk"] for d in data]
    ndwi_vals = [d["ndwi_sim"] for d in data]
    rainfall_vals = [d["rainfall_proxy"] for d in data]

    anomaly_flags = [1 if (ar["is_anomaly"] or d.get("anomaly_flag", 0)) else 0
                     for ar, d in zip(anomaly_results, data)]

    return {
        "site_id": site_id,
        "labels": labels,
        "datasets": {
            "discharge": discharge_vals,
            "water_area": area_vals,
            "turbidity": turbidity_vals,
            "flood_risk": flood_vals,
            "ndwi_sim": ndwi_vals,
            "rainfall_proxy": rainfall_vals,
            "anomaly_flags": anomaly_flags,
        }
    }

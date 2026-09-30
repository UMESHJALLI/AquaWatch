"""
Alerts API Routes
GET  /api/alerts             - List all alerts
POST /api/alerts/{id}/ack    - Acknowledge an alert
"""

from fastapi import APIRouter, HTTPException
from app.models.database import get_connection
from datetime import datetime

router = APIRouter()


@router.get("/alerts")
def get_alerts():
    """Return all alerts sorted by most recent."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return {"alerts": [dict(r) for r in rows], "total": len(rows)}


@router.post("/alerts/{alert_id}/ack")
def acknowledge_alert(alert_id: int):
    """Mark an alert as acknowledged."""
    conn = get_connection()
    result = conn.execute("UPDATE alerts SET acknowledged = 1 WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Alert not found.")
    return {"success": True, "alert_id": alert_id}


@router.get("/alerts/summary")
def get_alert_summary():
    """Return alert counts by severity."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity"
    ).fetchall()
    unread = conn.execute("SELECT COUNT(*) FROM alerts WHERE acknowledged = 0").fetchone()[0]
    conn.close()
    return {
        "by_severity": {r["severity"]: r["count"] for r in rows},
        "unacknowledged": unread,
    }

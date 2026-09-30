"""
Sites API Routes
GET /api/sites          - List all monitoring sites
GET /api/site/{id}      - Get site details
"""

from fastapi import APIRouter, HTTPException
from app.models.database import get_connection

router = APIRouter()


@router.get("/sites")
def get_sites():
    """Return all monitoring sites."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM sites").fetchall()
    conn.close()
    return {"sites": [dict(r) for r in rows]}


@router.get("/site/{site_id}")
def get_site(site_id: str):
    """Return details for a specific monitoring site."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM sites WHERE id = ?", (site_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found.")
    
    site = dict(row)
    # Fetch latest observation
    conn = get_connection()
    latest = conn.execute(
        "SELECT * FROM observations WHERE site_id = ? ORDER BY date DESC LIMIT 1", (site_id,)
    ).fetchone()
    conn.close()
    site["latest"] = dict(latest) if latest else {}
    return site

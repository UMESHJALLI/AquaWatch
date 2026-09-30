"""
Image Analysis API Route
POST /api/analyze-image  - Upload and analyze a water body image
POST /api/load-demo      - Load a sample demo image for analysis
GET  /api/download-report - Download HTML analysis report
"""

import os
import uuid
import json
import math
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import HTMLResponse, JSONResponse
import cv2
import numpy as np

from app.services.image_processor import process_image
from app.services.turbidity import estimate_turbidity
from app.services.discharge_estimator import estimate_discharge
from app.services.anomaly_detector import assess_anomaly_single
from app.services.report_generator import generate_html_report

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "..", "..")
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
SAMPLE_DIR = os.path.join(BACKEND_DIR, "sample_data", "images")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Store last analysis in memory for report generation
_last_analysis: dict = {}


def _run_full_analysis(
    image_path: str,
    site_name: str = "Uploaded Image",
    mission: str = "Sentinel-2",
    engine_mode: str = "high_precision",
    cloud_pct: float = 15.0,
    rainfall_mm: float = 12.0,
    soil_moisture_pct: float = 45.0,
    reservoir_release_m3s: float = 0.0,
    is_ungauged: bool = False,
) -> dict:
    """Run complete analysis pipeline on an image file with multi-mission and hydrology support."""
    # Core image processing (Optical + SAR + Attention U-Net / Lightweight)
    img_result = process_image(
        image_path,
        mission=mission,
        engine_mode=engine_mode,
        cloud_pct=cloud_pct,
    )

    # Read image for turbidity
    img = cv2.imread(image_path)
    img_resized = cv2.resize(img, (640, 480)) if img is not None else np.zeros((480, 640, 3), dtype=np.uint8)

    # Turbidity estimation
    turb_result = estimate_turbidity(img_resized)

    # Discharge estimation with real-time hydrological forcing
    metrics = img_result["metrics"]
    seasonal = 0.4 + 0.4 * abs(math.sin(2 * math.pi * (hash(site_name) % 365) / 365))
    discharge_result = estimate_discharge(
        area_km2=metrics["area_km2"],
        avg_width_m=metrics.get("avg_width_m", 100.0),
        ndwi_sim=metrics.get("ndwi_simulated", 0.35),
        turbidity=turb_result["turbidity_score"],
        seasonal_factor=seasonal,
        slope_proxy=0.0006,
        rainfall_mm=rainfall_mm,
        soil_moisture_pct=soil_moisture_pct,
        reservoir_release_m3s=reservoir_release_m3s,
        is_ungauged=is_ungauged,
    )

    # Anomaly detection & River Health
    anomaly_result = assess_anomaly_single(
        area_km2=metrics["area_km2"],
        discharge=discharge_result["discharge_m3s"],
        turbidity=turb_result["turbidity_score"],
        flood_score=discharge_result["flood_score"],
    )

    full_result = {
        "images": img_result["images"],
        "metrics": metrics,
        "discharge": discharge_result,
        "turbidity": turb_result,
        "anomaly": anomaly_result,
        "site_name": site_name,
        "hydrology_inputs": {
            "rainfall_mm": rainfall_mm,
            "soil_moisture_pct": soil_moisture_pct,
            "reservoir_release_m3s": reservoir_release_m3s,
            "mission": mission,
            "engine_mode": engine_mode,
            "is_ungauged": is_ungauged,
        }
    }
    return full_result


@router.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    mission: str = Query("Sentinel-2"),
    engine_mode: str = Query("high_precision"),
    rainfall_mm: float = Query(12.0),
    soil_moisture_pct: float = Query(45.0),
    reservoir_release_m3s: float = Query(0.0),
    is_ungauged: bool = Query(False),
):
    """Analyze an uploaded water body image."""
    global _last_analysis

    allowed_types = {"image/jpeg", "image/png", "image/jpg", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG images are supported.")

    ext = os.path.splitext(file.filename)[-1] or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOADS_DIR, unique_name)

    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        result = _run_full_analysis(
            save_path,
            site_name=file.filename,
            mission=mission,
            engine_mode=engine_mode,
            rainfall_mm=rainfall_mm,
            soil_moisture_pct=soil_moisture_pct,
            reservoir_release_m3s=reservoir_release_m3s,
            is_ungauged=is_ungauged,
        )
        result["filename"] = unique_name
        _last_analysis = result
        response = {k: v for k, v in result.items() if k != "images"}
        response["images"] = {
            k: f"data:image/png;base64,{v}" for k, v in result.get("images", {}).items()
        }
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/load-demo")
async def load_demo(
    demo_name: str = Query("sentinel2_ganga_monsoon.jpg"),
    mission: str = Query("Sentinel-2"),
    engine_mode: str = Query("high_precision"),
    rainfall_mm: float = Query(12.0),
    soil_moisture_pct: float = Query(45.0),
    reservoir_release_m3s: float = Query(0.0),
    is_ungauged: bool = Query(False),
):
    """Load a built-in demo image and run analysis."""
    global _last_analysis

    demo_path = os.path.join(SAMPLE_DIR, demo_name)
    if not os.path.exists(demo_path):
        available = [f for f in os.listdir(SAMPLE_DIR) if f.endswith((".jpg", ".png"))] if os.path.exists(SAMPLE_DIR) else []
        if not available:
            raise HTTPException(status_code=404, detail="No demo images found.")
        demo_path = os.path.join(SAMPLE_DIR, available[0])
        demo_name = available[0]

    # Auto-infer mission from filename if standard demo
    if "planetscope" in demo_name.lower():
        mission = "PlanetScope"
    elif "sar" in demo_name.lower() or "sentinel1" in demo_name.lower():
        mission = "Sentinel-1"
    elif "nisar" in demo_name.lower():
        mission = "NISAR"

    try:
        result = _run_full_analysis(
            demo_path,
            site_name=demo_name.replace("_", " ").replace(".jpg", "").title(),
            mission=mission,
            engine_mode=engine_mode,
            rainfall_mm=rainfall_mm,
            soil_moisture_pct=soil_moisture_pct,
            reservoir_release_m3s=reservoir_release_m3s,
            is_ungauged=is_ungauged,
        )
        result["filename"] = demo_name
        _last_analysis = result
        response = {k: v for k, v in result.items() if k != "images"}
        response["images"] = {
            k: f"data:image/png;base64,{v}" for k, v in result.get("images", {}).items()
        }
        return JSONResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Demo analysis failed: {str(e)}")


@router.get("/sample-images")
async def list_sample_images():
    """List available demo images."""
    if not os.path.exists(SAMPLE_DIR):
        return {"images": []}
    images = [f for f in os.listdir(SAMPLE_DIR) if f.endswith((".jpg", ".png", ".jpeg"))]
    return {"images": images}


@router.get("/download-report", response_class=HTMLResponse)
async def download_report():
    """Download the last analysis as an HTML report."""
    global _last_analysis
    if not _last_analysis:
        demo_name = "sentinel2_ganga_monsoon.jpg"
        demo_path = os.path.join(SAMPLE_DIR, demo_name)
        if not os.path.exists(demo_path) and os.path.exists(SAMPLE_DIR):
            available = [f for f in os.listdir(SAMPLE_DIR) if f.endswith((".jpg", ".png"))]
            if available:
                demo_path = os.path.join(SAMPLE_DIR, available[0])
                demo_name = available[0]
        if os.path.exists(demo_path):
            try:
                result = _run_full_analysis(demo_path, site_name="Ganga Basin Reach (Patna)", mission="Sentinel-2")
                result["filename"] = demo_name
                _last_analysis = result
            except Exception:
                pass

    if not _last_analysis:
        return HTMLResponse("<h2>No analysis available. Please upload an image first.</h2>")
    html = generate_html_report(_last_analysis, site_name=_last_analysis.get("site_name", "AquaWatch Hydrological Analysis"))
    return HTMLResponse(content=html, headers={"Content-Disposition": "attachment; filename=aquawatch_report.html"})

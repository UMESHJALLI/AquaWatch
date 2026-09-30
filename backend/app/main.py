"""
CV-Based Water Bodies & Discharge Monitoring System
FastAPI Backend - Main Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routes import analysis, sites, history, forecast, alerts
from app.models.database import init_db
from app.utils.data_generator import generate_sample_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_DIR = os.path.join(BASE_DIR, "..", "sample_data")
UPLOADS_DIR = os.path.join(BASE_DIR, "..", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLE_DIR, exist_ok=True)

app = FastAPI(
    title="AquaWatch - Water Monitoring System",
    description="CV-Based Water Bodies & Discharge Monitoring - Academic Prototype",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file directories for serving images
uploads_path = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

sample_images_path = os.path.join(SAMPLE_DIR, "images")
os.makedirs(sample_images_path, exist_ok=True)
app.mount("/sample-images", StaticFiles(directory=sample_images_path), name="sample_images")

# Include routers
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])
app.include_router(sites.router, prefix="/api", tags=["Sites"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])


@app.on_event("startup")
async def startup_event():
    """Initialize DB and generate sample data on first run."""
    init_db()
    generate_sample_data()


@app.get("/")
async def root():
    return {"message": "AquaWatch API running", "version": "1.0.0", "status": "operational"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

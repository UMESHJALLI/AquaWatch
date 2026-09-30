"""
Multi-Basin Synthetic Data & Satellite Scene Generator.
Populates SQLite DB with realistic seasonal monitoring observations across multiple river basins:
- Ganga Basin (Patna, Varanasi, Haridwar)
- Brahmaputra Basin (Guwahati, Dibrugarh)
- Godavari Basin (Rajahmundry)
- Krishna Basin (Vijayawada)
- Mahanadi Basin (Cuttack)
- Ungauged Basin (Kosi Tributary)
- Reservoir (Chembarambakkam Lake)
Generates synthetic multi-mission satellite imagery (Sentinel-2, Sentinel-1 SAR, PlanetScope 3m, NISAR).
"""

import os
import json
import sqlite3
import random
import math
import numpy as np
from datetime import datetime, timedelta
import cv2

from app.models.database import get_connection, DB_PATH

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "..", "..")
SAMPLE_DIR = os.path.join(BACKEND_DIR, "sample_data")

DEMO_SITES = [
    {
        "id": "site_patna",
        "name": "Patna Ganga Station",
        "location": "Patna, Bihar",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "river": "Ganga",
        "basin": "Ganga Basin",
        "description": "Primary validation site from ESCI 2026 paper. High monsoon flood dynamics with up to 48,000 m³/s peak flows.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_varanasi",
        "name": "Varanasi Ghats Station",
        "location": "Varanasi, UP",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "river": "Ganga",
        "basin": "Ganga Basin",
        "description": "Urban river reach critical for turbidity, sediment load, and industrial pollution tracking.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_haridwar",
        "name": "Haridwar Har Ki Pauri",
        "location": "Haridwar, Uttarakhand",
        "latitude": 29.9457,
        "longitude": 78.1642,
        "river": "Ganga",
        "basin": "Ganga Basin",
        "description": "Upper Ganga monitoring station influenced by Himalayan snowmelt and pre-monsoon surges.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_guwahati",
        "name": "Guwahati Brahmaputra Reach",
        "location": "Guwahati, Assam",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "river": "Brahmaputra",
        "basin": "Brahmaputra Basin",
        "description": "Massive braided discharge channel with frequent catastrophic monsoon flooding and rapid sandbar migration.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_rajahmundry",
        "name": "Rajahmundry Godavari Station",
        "location": "Rajahmundry, Andhra Pradesh",
        "latitude": 17.0005,
        "longitude": 81.8040,
        "river": "Godavari",
        "basin": "Godavari Basin",
        "description": "Peninsular delta river monitoring. Regulated by Dowleswaram Barrage with flash flood pulses.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_vijayawada",
        "name": "Vijayawada Prakasam Barrage",
        "location": "Vijayawada, Andhra Pradesh",
        "latitude": 16.5062,
        "longitude": 80.6480,
        "river": "Krishna",
        "basin": "Krishna Basin",
        "description": "Key hydraulic structure on Krishna river managing irrigation and municipal releases.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_cuttack",
        "name": "Cuttack Mahanadi Station",
        "location": "Cuttack, Odisha",
        "latitude": 20.4625,
        "longitude": 85.8828,
        "river": "Mahanadi",
        "basin": "Mahanadi Basin",
        "description": "Deltaic network prone to cyclonic storm surges and heavy coastal river discharges.",
        "status": "active",
        "is_ungauged": False,
    },
    {
        "id": "site_kosi_ungauged",
        "name": "Upper Kosi Tributary (Ungauged)",
        "location": "North Bihar Border",
        "latitude": 26.5400,
        "longitude": 86.9500,
        "river": "Kosi Tributary",
        "basin": "Ganga Basin",
        "description": "Remote ungauged basin evaluated via regional hydraulic geometry power laws and DEM reach slope.",
        "status": "active",
        "is_ungauged": True,
    },
    {
        "id": "site_chennai_lake",
        "name": "Chembarambakkam Lake",
        "location": "Chennai, Tamil Nadu",
        "latitude": 13.0012,
        "longitude": 80.0618,
        "river": "Lake / Reservoir",
        "basin": "Kaveri / Coastal Basin",
        "description": "Critical freshwater reservoir serving the Chennai metropolitan area.",
        "status": "active",
        "is_ungauged": False,
    },
]


def _generate_seasonal_value(day_of_year, base, amplitude, phase=150, noise=0.05):
    """Generate seasonal sinusoidal baseline with stochastic Gaussian perturbations."""
    seasonal = base + amplitude * math.sin(2 * math.pi * (day_of_year - phase) / 365)
    noise_val = random.gauss(0, base * noise)
    return max(0, seasonal + noise_val)


def generate_historical_csv(site_id: str, days: int = 365):
    """Generate 365 days of realistic multi-variate hydrological time-series data."""
    site_params = {
        "site_patna": {"base_area": 2800, "amp_area": 1400, "base_q": 18000, "amp_q": 15000, "base_turb": 45},
        "site_varanasi": {"base_area": 2200, "amp_area": 950, "base_q": 14000, "amp_q": 10000, "base_turb": 65},
        "site_haridwar": {"base_area": 1500, "amp_area": 700, "base_q": 8000, "amp_q": 6000, "base_turb": 30},
        "site_guwahati": {"base_area": 5500, "amp_area": 3200, "base_q": 32000, "amp_q": 25000, "base_turb": 70},
        "site_rajahmundry": {"base_area": 3100, "amp_area": 1800, "base_q": 16000, "amp_q": 13000, "base_turb": 40},
        "site_vijayawada": {"base_area": 2600, "amp_area": 1400, "base_q": 12000, "amp_q": 10000, "base_turb": 35},
        "site_cuttack": {"base_area": 2400, "amp_area": 1300, "base_q": 11000, "amp_q": 9000, "base_turb": 50},
        "site_kosi_ungauged": {"base_area": 850, "amp_area": 500, "base_q": 4200, "amp_q": 3500, "base_turb": 60},
        "site_chennai_lake": {"base_area": 3500, "amp_area": 1500, "base_q": 5000, "amp_q": 3000, "base_turb": 20},
    }

    params = site_params.get(site_id, site_params["site_patna"])
    start_date = datetime.now() - timedelta(days=days)
    rows = []

    for i in range(days):
        date = start_date + timedelta(days=i)
        doy = date.timetuple().tm_yday
        area = _generate_seasonal_value(doy, params["base_area"], params["amp_area"], phase=150)
        width = area ** 0.5 * random.uniform(0.85, 1.15)
        discharge = _generate_seasonal_value(doy, params["base_q"], params["amp_q"], phase=155)
        turbidity = _generate_seasonal_value(doy, params["base_turb"], params["base_turb"] * 0.35, phase=155, noise=0.08)
        flood_risk = min(1.0, discharge / (params["base_q"] + params["amp_q"] * 1.35))
        ndwi_sim = 0.25 + (area / (params["base_area"] + params["amp_area"])) * 0.45 + random.uniform(-0.03, 0.03)
        rainfall_proxy = _generate_seasonal_value(doy, 8, 55, phase=150, noise=0.25)

        # Inject historical flood & pollution anomalies (~3% probability)
        anomaly = 0
        if random.random() < 0.035:
            anomaly = 1
            area *= random.uniform(1.3, 1.7)
            discharge *= random.uniform(1.4, 2.1)
            turbidity = min(100.0, turbidity * random.uniform(1.4, 2.2))
            flood_risk = min(1.0, flood_risk * 1.6)

        rows.append({
            "date": date.strftime("%Y-%m-%d"),
            "water_area": round(area, 2),
            "avg_width": round(width, 2),
            "discharge": round(discharge, 2),
            "turbidity": round(turbidity, 2),
            "flood_risk": round(flood_risk, 4),
            "anomaly_flag": anomaly,
            "ndwi_sim": round(min(1.0, ndwi_sim), 4),
            "rainfall_proxy": round(max(0, rainfall_proxy), 2),
        })

    return rows


def _create_synthetic_satellite_image(path: str, scene_type: str = "river_broad"):
    """
    Generate synthetic satellite images matching Sentinel-2, Sentinel-1 SAR,
    PlanetScope (3m), and NISAR conditions.
    """
    h, w = 480, 640
    img = np.zeros((h, w, 3), dtype=np.uint8)

    if scene_type == "river_broad":
        # Realistic agricultural/floodplain background (green-brown multispectral)
        img[:, :] = [35, 75, 45]
        # River channel winding through center
        for y in range(h):
            curve = int(45 * math.sin(y * 0.012) + 15 * math.cos(y * 0.03))
            cx = w // 2 + curve
            half_w = int(60 + 15 * math.sin(y * 0.02))
            x1 = max(0, cx - half_w)
            x2 = min(w, cx + half_w)
            # Turbid water tone
            img[y, x1:x2] = [135, 115, 30]

    elif scene_type == "narrow_channel":
        # PlanetScope 3m high-resolution narrow channel (<30m)
        img[:, :] = [50, 95, 60]
        for y in range(h):
            curve = int(25 * math.sin(y * 0.018))
            cx = w // 2 + curve
            half_w = 12  # Very narrow channel (24m total width)
            x1 = max(0, cx - half_w)
            x2 = min(w, cx + half_w)
            img[y, x1:x2] = [150, 110, 25]

    elif scene_type == "flooded_vegetation":
        # NISAR / SAR flooded vegetation canopy
        img[:, :] = [30, 85, 35]  # Dense vegetation
        # Flooded lowlands under trees
        for y in range(h // 4, 3 * h // 4):
            for x in range(w // 4, 3 * w // 4):
                if ((x - w // 2) ** 2) / (w * 0.28) ** 2 + ((y - h // 2) ** 2) / (h * 0.25) ** 2 < 1:
                    # Darker submerged tone with double-bounce texture
                    img[y, x] = [80, 110, 45]

    elif scene_type == "sar_patna_flood":
        # Sentinel-1 SAR C-band scene (dark water specular reflection)
        img[:, :] = [110, 110, 110]
        for y in range(h):
            curve = int(35 * math.sin(y * 0.01))
            cx = w // 2 + curve
            half_w = int(140 + 20 * math.sin(y * 0.015))  # Immense flood extent
            x1 = max(0, cx - half_w)
            x2 = min(w, cx + half_w)
            img[y, x1:x2] = [20, 20, 20]  # Specular dark water in SAR

    else:
        # Default lake/reservoir
        img[:, :] = [45, 80, 50]
        cx, cy = w // 2, h // 2
        for y in range(h):
            for x in range(w):
                if ((x - cx) ** 2) / (w * 0.32) ** 2 + ((y - cy) ** 2) / (h * 0.28) ** 2 < 1:
                    img[y, x] = [155, 125, 35]

    # Add realistic speckle noise & terrain texture
    noise = np.random.randint(-12, 12, (h, w, 3), dtype=np.int16)
    img_textured = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    cv2.imwrite(path, img_textured)
    return True


def generate_sample_data():
    """Seed multi-basin database observations and sample satellite imagery."""
    conn = get_connection()
    cursor = conn.cursor()

    # Create table sites & observations if not exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sites (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            river TEXT,
            basin TEXT,
            description TEXT,
            status TEXT DEFAULT 'active',
            is_ungauged INTEGER DEFAULT 0
        );
    """)

    cursor.execute("SELECT COUNT(*) FROM sites")
    count = cursor.fetchone()[0]

    # Re-seed if fewer than all multi-basin demo sites
    if count < len(DEMO_SITES):
        print(f"[DataGen] Seeding {len(DEMO_SITES)} multi-basin stations...")
        cursor.execute("DELETE FROM sites")
        cursor.execute("DELETE FROM observations")

        for site in DEMO_SITES:
            cursor.execute(
                """INSERT INTO sites (id, name, location, latitude, longitude, river, basin, description, status, is_ungauged)
                   VALUES (?,?,?,?,?,?,?,?,?,?)""",
                (site["id"], site["name"], site["location"], site["latitude"], site["longitude"],
                 site["river"], site.get("basin", "Ganga Basin"), site["description"], site["status"],
                 1 if site.get("is_ungauged") else 0),
            )
        conn.commit()

        # Generate 365 days of observations for each site
        print("[DataGen] Generating multi-basin time series...")
        for site in DEMO_SITES:
            rows = generate_historical_csv(site["id"], days=365)
            for row in rows:
                cursor.execute(
                    """INSERT INTO observations (site_id, date, water_area, avg_width, discharge, turbidity, flood_risk, anomaly_flag, ndwi_sim, rainfall_proxy)
                       VALUES (?,?,?,?,?,?,?,?,?,?)""",
                    (site["id"], row["date"], row["water_area"], row["avg_width"], row["discharge"],
                     row["turbidity"], row["flood_risk"], row["anomaly_flag"], row["ndwi_sim"], row["rainfall_proxy"]),
                )
            conn.commit()
            print(f"  [OK] Station {site['id']} seeded ({len(rows)} records).")

        # Generate alert history matching Case Studies from paper with dynamic real-time timestamps
        print("[DataGen] Seeding active hydrological alerts...")
        cursor.execute("DELETE FROM alerts")
        now = datetime.now()
        alerts = [
            ("site_patna", "Patna Ganga Station", "Severe Flood Warning", "severe",
             "Sentinel-1 SAR detected 287% water area surge. Discharge > 38,000 m³/s. Automated State Disaster Level 3 alert.",
             (now - timedelta(hours=2)).strftime("%Y-%m-%dT%H:%M:%S"), 0),
            ("site_guwahati", "Guwahati Brahmaputra Reach", "Flood Inundation Alert", "severe",
             "Braided channel discharge exceeding 42,000 m³/s. Automated satellite embankment surveillance advisory.",
             (now - timedelta(hours=7)).strftime("%Y-%m-%dT%H:%M:%S"), 0),
            ("site_varanasi", "Varanasi Ghats Station", "High Turbidity / Pollution", "warning",
             "Turbidity score 82/100 detected by spectral reflectance. Elevated runoff advisory.",
             (now - timedelta(hours=18)).strftime("%Y-%m-%dT%H:%M:%S"), 0),
            ("site_kosi_ungauged", "Upper Kosi Tributary (Ungauged)", "Ungauged Inflow Surge", "warning",
             "Hydraulic geometry model indicates flash runoff surge following precipitation.",
             (now - timedelta(days=1, hours=4)).strftime("%Y-%m-%dT%H:%M:%S"), 1),
            ("site_rajahmundry", "Rajahmundry Godavari Station", "Reservoir Release Surge", "info",
             "Upstream barrage release of 8,500 m³/s reaching delta reach.",
             (now - timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%S"), 1),
        ]
        for a in alerts:
            cursor.execute(
                "INSERT INTO alerts (site_id, site_name, alert_type, severity, message, timestamp, acknowledged) VALUES (?,?,?,?,?,?,?)", a
            )
        conn.commit()

    conn.close()

    # Generate synthetic satellite scenes
    images_dir = os.path.join(SAMPLE_DIR, "images")
    os.makedirs(images_dir, exist_ok=True)

    satellite_presets = [
        ("sentinel2_ganga_monsoon.jpg", "river_broad"),
        ("sentinel1_sar_patna_flood.jpg", "sar_patna_flood"),
        ("planetscope_narrow_channel.jpg", "narrow_channel"),
        ("nisar_flooded_vegetation.jpg", "flooded_vegetation"),
        ("river_ganga_sample.jpg", "river_broad"),
        ("lake_chennai_sample.jpg", "lake"),
        ("flood_event_sample.jpg", "sar_patna_flood"),
        ("reservoir_sample.jpg", "lake"),
        ("river_upstream_sample.jpg", "narrow_channel"),
    ]

    for fname, stype in satellite_presets:
        fpath = os.path.join(images_dir, fname)
        if not os.path.exists(fpath):
            _create_synthetic_satellite_image(fpath, stype)

    # Persist JSON sites
    sites_dir = os.path.join(SAMPLE_DIR, "sites")
    os.makedirs(sites_dir, exist_ok=True)
    with open(os.path.join(sites_dir, "sites.json"), "w") as f:
        json.dump(DEMO_SITES, f, indent=2)

    print("[DataGen] Multi-basin datasets and satellite imagery ready.")

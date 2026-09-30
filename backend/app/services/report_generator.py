"""
HTML Audit Report Generator Service
Generates publication-quality, standalone HTML reports for satellite water body analysis,
including embedded base64 figures, metrics tables, hydraulic calculations, and flood risk categorization.
"""

from datetime import datetime
from typing import Dict, Any


def generate_html_report(analysis_data: Dict[str, Any], site_name: str = "Satellite Analysis") -> str:
    """Generate a clean, standalone HTML audit report with embedded figures and metrics."""
    metrics = analysis_data.get("metrics", {})
    discharge = analysis_data.get("discharge", {})
    turbidity = analysis_data.get("turbidity", {})
    anomaly = analysis_data.get("anomaly", {})
    images = analysis_data.get("images", {})
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    # Format numbers safely
    def fn(val, decimals=1):
        if val is None:
            return "N/A"
        try:
            return f"{float(val):,.{decimals}f}"
        except:
            return str(val)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AquaWatch Hydrological & Satellite Audit Report — {site_name}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 30px;
            line-height: 1.5;
        }}
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            padding: 40px;
        }}
        .header {{
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .title h1 {{
            font-size: 26px;
            margin: 0 0 6px 0;
            color: #0369a1;
        }}
        .title p {{
            margin: 0;
            color: #64748b;
            font-size: 14px;
        }}
        .badge {{
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }}
        .badge-safe {{ background: #dcfce7; color: #15803d; }}
        .badge-warning {{ background: #fef3c7; color: #b45309; }}
        .badge-severe {{ background: #fee2e2; color: #b91c1c; }}
        .grid-cards {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 30px;
        }}
        .card {{
            background: #f1f5f9;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #0284c7;
        }}
        .card-label {{ font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }}
        .card-val {{ font-size: 22px; font-weight: 700; color: #0f172a; }}
        .card-sub {{ font-size: 11px; color: #94a3b8; margin-top: 4px; }}
        .section-title {{
            font-size: 18px;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
            margin: 30px 0 16px 0;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 14px;
        }}
        th, td {{
            text-align: left;
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
        }}
        th {{ background: #f8fafc; color: #475569; font-weight: 600; }}
        .images-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 20px;
        }}
        .img-box {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
        }}
        .img-box img {{
            width: 100%;
            height: auto;
            display: block;
        }}
        .img-box p {{
            margin: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
        }}
        .footer {{
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }}
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="title">
            <h1>🌊 AquaWatch Hydrological Audit Report</h1>
            <p>Target Reach: <strong>{site_name}</strong> | Generated: {now_str}</p>
            <p>Satellite Mission: <strong>{metrics.get("satellite_mission", "Sentinel-2 MSI")}</strong> ({metrics.get("engine_mode", "High-Precision").title()} Engine)</p>
        </div>
        <div>
            <span class="badge { 'badge-severe' if discharge.get('flood_risk') == 'Severe' else 'badge-warning' if discharge.get('flood_risk') in ('High', 'Moderate') else 'badge-safe' }">
                Flood Risk: {discharge.get("flood_risk", "Normal")}
            </span>
        </div>
    </div>

    <div class="grid-cards">
        <div class="card">
            <div class="card-label">Water Body Area</div>
            <div class="card-val">{fn(metrics.get("area_km2", 0) * 100, 1)} ha</div>
            <div class="card-sub">{fn(metrics.get("area_km2", 0), 3)} km² ({fn(metrics.get("coverage_pct", 0), 1)}% scene)</div>
        </div>
        <div class="card">
            <div class="card-label">Mean Channel Width</div>
            <div class="card-val">{fn(metrics.get("avg_width_m", 0), 0)} m</div>
            <div class="card-sub">Min: {fn(metrics.get("min_width_m", 0), 0)}m | Max: {fn(metrics.get("max_width_m", 0), 0)}m</div>
        </div>
        <div class="card">
            <div class="card-label">Hybrid Discharge (Q)</div>
            <div class="card-val">{fn(discharge.get("discharge_m3s", 0), 0)} m³/s</div>
            <div class="card-sub">Conf: {discharge.get("confidence_pct", 90)}% (±{fn(discharge.get("uncertainty_sigma", 0), 0)} m³/s)</div>
        </div>
        <div class="card">
            <div class="card-label">Water Quality Index</div>
            <div class="card-val">{fn(turbidity.get("turbidity_score", 0), 1)} / 100</div>
            <div class="card-sub">Status: {turbidity.get("turbidity_level", "Moderate")}</div>
        </div>
    </div>

    <div class="section-title">Hydraulic & Machine Learning Discharge Breakdown</div>
    <table>
        <thead>
            <tr>
                <th>Component</th>
                <th>Model / Equation</th>
                <th>Estimated Flow</th>
                <th>Fusion Weight</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Physics-Based</strong></td>
                <td>Manning's Open-Channel (Ac · Rh^(2/3) · S^(1/2) / n)</td>
                <td>{fn(discharge.get("discharge_physics", 0), 0)} m³/s</td>
                <td>{discharge.get("weights", {}).get("w_phys", 0.45)}</td>
            </tr>
            <tr>
                <td><strong>Data-Driven ML</strong></td>
                <td>Random Forest & Hydrometeorological Runoff Ingestion</td>
                <td>{fn(discharge.get("discharge_ml", 0), 0)} m³/s</td>
                <td>{discharge.get("weights", {}).get("w_ml", 0.55)}</td>
            </tr>
            <tr style="background: #f0fdf4; font-weight: bold;">
                <td><strong>Hybrid Combined (Q_final)</strong></td>
                <td>Uncertainty-Weighted Integration (Eq. 9 in ESCI 2026 paper)</td>
                <td>{fn(discharge.get("discharge_m3s", 0), 0)} m³/s</td>
                <td>95% CI: [{fn(discharge.get("discharge_low", 0), 0)} – {fn(discharge.get("discharge_high", 0), 0)}] m³/s</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Remote Sensing Spectral & Polarimetric Indicators</div>
    <table>
        <thead>
            <tr>
                <th>Indicator</th>
                <th>Value</th>
                <th>Formulation / Mission</th>
                <th>Hydrological Significance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>NDWI (Sim.)</strong></td>
                <td>{metrics.get("ndwi_simulated", 0)}</td>
                <td>(Green - NIR) / (Green + NIR)</td>
                <td>Open water surface delineation</td>
            </tr>
            <tr>
                <td><strong>MNDWI (Sim.)</strong></td>
                <td>{metrics.get("mndwi_simulated", 0)}</td>
                <td>(Green - SWIR) / (Green + SWIR)</td>
                <td>Suppresses built-up urban noise and shadows</td>
            </tr>
            <tr>
                <td><strong>AWEInsh (Sim.)</strong></td>
                <td>{metrics.get("awei_simulated", 0)}</td>
                <td>Automated Water Extraction Shadow Index</td>
                <td>Accurate shoreline extraction in shadow zones</td>
            </tr>
            <tr>
                <td><strong>SAR RVI Index</strong></td>
                <td>{metrics.get("rvi_score", 0)}</td>
                <td>4 · VH / (VV + VH) [Sentinel-1 / NISAR]</td>
                <td>Detects water under flooded vegetation canopy</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Satellite Imagery & Computer Vision Visualizations</div>
    <div class="images-grid">
        <div class="img-box">
            <img src="data:image/png;base64,{images.get('original', '')}" alt="Original Scene">
            <p>Original Satellite True-Color Scene</p>
        </div>
        <div class="img-box">
            <img src="data:image/png;base64,{images.get('overlay', '')}" alt="Water Overlay">
            <p>Attention U-Net Delineated Water Mask</p>
        </div>
        <div class="img-box">
            <img src="data:image/png;base64,{images.get('attention_map', '')}" alt="Attention Gate Map">
            <p>Attention Gate Activation (Edge & Boundary Weighting)</p>
        </div>
        <div class="img-box">
            <img src="data:image/png;base64,{images.get('centerline', '')}" alt="Centerline & Transects">
            <p>River Spine Skeletonization & Width Transects</p>
        </div>
    </div>

    <div class="footer">
        AquaWatch Operational Environmental Platform · Academic Prototype based on IEEE ESCI 2026 · Vel Tech R&D
    </div>
</div>
</body>
</html>"""
    return html

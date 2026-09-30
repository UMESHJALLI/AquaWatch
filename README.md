# 🌊 AquaWatch: Satellite-Based Water Body Detection and River Discharge Estimation

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![IEEE Paper](https://img.shields.io/badge/IEEE%20Paper-PDF%20Included-red)](./IEEE_Research_Paper.pdf)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An operational, all-weather Earth observation and computer vision platform designed for continuous river boundary delineation, sub-canopy inundation extraction, and streamflow discharge estimation across monitored and ungauged river basins.

---

## 📄 IEEE Conference & Research Publication

* **Paper Title:** *A Multi-Source Satellite Imagery Framework for Water Body Segmentation and River Discharge Estimation*
* **Authors:** 
  * **K Kausalya** (`kausalyamurthy@gmail.com`)
  * **P Nikhitha** (`pachanikhitha2004@gmail.com`)
  * **J Umesh** (`jalliumesh.j@gmail.com`)
* **Institution:** *Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Avadi, Tamil Nadu, India*
* **Files Included:**
  * 📄 **[IEEE Research Paper PDF](./IEEE_Research_Paper.pdf)** *(Publication-ready 6-page two-column IEEE format)*
  * 🖋️ **[IEEEtran LaTeX Source Code](./IEEE_Paper_AquaWatch.tex)** *(Ready for Overleaf / pdflatex)*
  * 📝 **[Full Markdown Manuscript](./IEEE_Research_Paper.md)**

---

## 🌟 Key Research Innovations & System Features

### 1. Multi-Mission Satellite Ingestion
* **Optical Sensors:** Sentinel-2 MSI (10m/20m), high-resolution PlanetScope SuperDove (3m), and Landsat Next.
* **Polarimetric SAR:** Sentinel-1 C-band (VV/VH dual-pol, 10m) and simulated NISAR L/S-band for all-weather day/night cloud penetration.

### 2. Attention U-Net River Boundary Delineation
* Additive **Spatial Attention Gates ($\alpha_l$)** dynamically suppress cloud shadow edges, agricultural fields, and specular terrain noise.
* Composite loss formulation combining **Binary Cross-Entropy** and **Soft Dice Loss** ($\text{IoU} = 94.1\%$, $\text{Dice} = 0.970$).

### 3. Sub-Canopy Inundation via Radar Polarimetry
* Implements dual-polarization **Radar Vegetation Index ($RVI = \frac{4\sigma^\circ_{VH}}{\sigma^\circ_{VV} + \sigma^\circ_{VH}}$)** to isolate dihedral double-bounce backscatter beneath dense riparian tree canopies.

### 4. Morphological Skeletonization & Dynamic Transects
* Automated centerline extraction using iterative Zhang–Suen thinning.
* Projects orthogonal cross-sectional transect rays ($\vec{n}_k \perp \vec{\tau}_k$) to capture dynamic channel width ($W$) variations down to $11.4\text{ m}$ ($R^2 = 0.94$).

### 5. Uncertainty-Weighted Hybrid Streamflow Model
* Bridges Manning's open-channel hydraulic formulation ($Q_{\text{phys}} = \frac{1}{n} W h^{5/3} S^{1/2}$) with ensemble Gradient Boosted Decision Trees ($Q_{\text{ml}}$).
* Formulates **Bayesian Inverse-Variance Fusion** with calibrated **95% Confidence Bounds**:
  $$Q_{\text{final}} = \frac{w_{\text{phys}} Q_{\text{phys}} + w_{\text{ml}} Q_{\text{ml}}}{w_{\text{phys}} + w_{\text{ml}}}, \quad w = \frac{1}{\sigma^2}$$
* Achieves **$\text{NSE} = 0.932$** and **$\text{MAPE} = 7.1\%$** on the Patna Ganga station ($96.4\%$ 95% CI coverage).

### 6. Ungauged Catchment Solver
* Integrates Leopold–Maddock regional downstream hydraulic geometry scaling:
  $$Q_{\text{ungauged}} = \left( \frac{W}{a_{\text{reg}}} \right)^{1 / b_{\text{reg}}}$$
* Validated on the unmonitored Upper Kosi reach with **$\text{NSE} = 0.865$** without requiring in-situ gauge calibration.

### 7. Real-Time Telemetry & 36-Hour Predictive Inundation Warning
* Ingests real-time precipitation ($P$), root-zone soil moisture ($SM$), and upstream barrage releases ($Q_{\text{res}}$).
* Dispatches Level-3 hazard warnings with **$34.5\text{ hours}$ advance lead time** prior to gauge danger levels.

### 8. Agency CPU Optimization Mode
* Lightweight CPU inference mode ($<35\text{ ms}$, $<180\text{ MB}$ RAM) tailored for local state disaster management authorities (BSDMA, irrigation departments).

---

## 🗺️ Multi-Basin Operational Network

| Station ID | Station Name | River | Basin | Annual Flow ($m^3/s$) | Morphology |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `site_patna` | Patna Digha Reach | Ganga | Ganga Basin | 18,200 | Braided Alluvial |
| `site_varanasi` | Varanasi Ghats | Ganga | Ganga Basin | 14,100 | Meandering Constrained |
| `site_haridwar` | Haridwar Headwaters | Ganga | Upper Ganga | 8,200 | Boulder Bed Foothill |
| `site_guwahati` | Guwahati Pandu | Brahmaputra | Brahmaputra | 32,500 | Multi-Thread Braided |
| `site_rajahmundry` | Rajahmundry Barrage | Godavari | Godavari Basin | 16,400 | Lowland Regulated Delta |
| `site_vijayawada` | Prakasam Reach | Krishna | Krishna Basin | 12,300 | Barrage Controlled |
| `site_cuttack` | Cuttack Delta | Mahanadi | Mahanadi Basin | 11,100 | Estuarine Alluvial |
| `site_kosi` | Upper Kosi Reach | Kosi | Ganga Basin | 4,200 | **Ungauged Flash-Prone** |
| `site_chennai` | Chembarambakkam | Adyar | Coastal TN | 4,800 | Storage Reservoir |

---

## 🚀 Quick Start Guide

### 1-Click Startup (Windows)
Double-click `start_all.bat` in the project root:
```powershell
.\start_all.bat
```
This automatically starts:
* **FastAPI Backend Server:** `http://localhost:8000`
* **Vite React Frontend:** `http://localhost:5173`
* **Swagger Interactive Docs:** `http://localhost:8000/docs`

---

### Manual Launch

#### Step 1: Start Backend (Terminal 1)
```powershell
cd backend
# Run with Python:
python -m uvicorn app.main:app --port 8000 --reload
```

#### Step 2: Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
npm run dev
```

---

## 📁 Repository Structure

```
CV-Water based project/
│
├── IEEE_Research_Paper.pdf       # Publication-ready IEEE Paper PDF
├── IEEE_Paper_AquaWatch.tex      # Complete IEEEtran LaTeX source code
├── IEEE_Research_Paper.md        # Full research manuscript in Markdown
├── start_all.bat                 # 1-Click startup batch script
├── README.md                     # Project documentation & benchmark overview
│
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS configuration
│   │   ├── routes/
│   │   │   ├── analysis.py       # Computer vision ingestion & demo routes
│   │   │   ├── sites.py          # Multi-basin hydrometric station endpoints
│   │   │   ├── history.py        # 365-day seasonal time series & charts
│   │   │   ├── forecast.py       # 7-day hydrological discharge projection
│   │   │   └── alerts.py         # Real-time disaster warning endpoints
│   │   ├── services/
│   │   │   ├── image_processor.py     # Optical/SAR Attention U-Net & transects
│   │   │   ├── discharge_estimator.py # Manning + ML uncertainty fusion
│   │   │   ├── anomaly_detector.py    # Multivariate Isolation Forest
│   │   │   └── report_generator.py    # Standalone HTML audit report generator
│   │   ├── models/
│   │   │   └── database.py       # SQLite database initialization
│   │   └── utils/
│   │       └── data_generator.py # Multi-basin time series generator
│   ├── aquawatch.db              # Seeded operational SQLite database
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # Project landing overview
    │   │   ├── Dashboard.jsx     # Main monitoring dashboard (Full map & KPIs)
    │   │   ├── UploadAnalysis.jsx# Multi-sensor ingestion & telemetry controls
    │   │   ├── SiteMonitoring.jsx# Basin station historical inspection
    │   │   └── ForecastAlerts.jsx# 7-day projection & automated flood alerts
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   ├── MapView.jsx       # Interactive Leaflet multi-basin map
    │   │   ├── ImageViewer.jsx   # Multi-layer optical/SAR/attention visualizer
    │   │   ├── MetricCard.jsx    # Metric KPI component
    │   │   └── AlertPanel.jsx    # Automated flood early warning panel
    │   └── charts/
    │       ├── DischargeChart.jsx# 365-day discharge hydrograph with CI
    │       ├── ForecastChart.jsx # 7-day predictive runoff forecast
    │       └── TurbidityChart.jsx# Water quality & turbidity time series
    ├── package.json
    └── vite.config.js
```

---

## 📜 Citation

If you use this work, codebase, or findings in your academic research, please cite:

```bibtex
@inproceedings{kausalya2026multisource,
  title={A Multi-Source Satellite Imagery Framework for Water Body Segmentation and River Discharge Estimation},
  author={Kausalya, K. and Nikhitha, P. and Umesh, J.},
  booktitle={Proceedings of the IEEE International Conference on Emerging Smart Computing and Informatics (ESCI)},
  year={2026},
  organization={IEEE}
}
```

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

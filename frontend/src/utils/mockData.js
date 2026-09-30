/**
 * Offline / Standalone Mock Data for GitHub Pages static hosting
 * Automatically utilized if backend server is unreachable.
 */

export const MOCK_SITES = [
  {
    id: "site_patna",
    name: "Patna Ganga Station",
    location: "Patna, Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
    river: "Ganga",
    basin: "Ganga Basin",
    description: "Primary validation site from ESCI 2026 paper. High monsoon flood dynamics with up to 48,000 m³/s peak flows.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 31250,
      water_area: 1420000,
      avg_width: 820,
      turbidity: 48.5,
      flood_risk: 0.82
    }
  },
  {
    id: "site_varanasi",
    name: "Varanasi Ghats Station",
    location: "Varanasi, UP",
    latitude: 25.3176,
    longitude: 82.9739,
    river: "Ganga",
    basin: "Ganga Basin",
    description: "Urban river reach critical for turbidity, sediment load, and industrial pollution tracking.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 18400,
      water_area: 980000,
      avg_width: 610,
      turbidity: 62.1,
      flood_risk: 0.45
    }
  },
  {
    id: "site_haridwar",
    name: "Haridwar Har Ki Pauri",
    location: "Haridwar, Uttarakhand",
    latitude: 29.9457,
    longitude: 78.1642,
    river: "Ganga",
    basin: "Ganga Basin",
    description: "Upper Ganga monitoring station influenced by Himalayan snowmelt and pre-monsoon surges.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 6200,
      water_area: 410000,
      avg_width: 320,
      turbidity: 19.4,
      flood_risk: 0.22
    }
  },
  {
    id: "site_guwahati",
    name: "Guwahati Brahmaputra Reach",
    location: "Guwahati, Assam",
    latitude: 26.1445,
    longitude: 91.7362,
    river: "Brahmaputra",
    basin: "Brahmaputra Basin",
    description: "Massive braided discharge channel with frequent catastrophic monsoon flooding and rapid sandbar migration.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 42100,
      water_area: 2850000,
      avg_width: 1450,
      turbidity: 78.9,
      flood_risk: 0.91
    }
  },
  {
    id: "site_rajahmundry",
    name: "Rajahmundry Godavari Station",
    location: "Rajahmundry, Andhra Pradesh",
    latitude: 17.0005,
    longitude: 81.804,
    river: "Godavari",
    basin: "Godavari Basin",
    description: "Peninsular delta river monitoring. Regulated by Dowleswaram Barrage with flash flood pulses.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 24700,
      water_area: 1290000,
      avg_width: 950,
      turbidity: 52.3,
      flood_risk: 0.63
    }
  },
  {
    id: "site_vijayawada",
    name: "Vijayawada Prakasam Barrage",
    location: "Vijayawada, Andhra Pradesh",
    latitude: 16.5062,
    longitude: 80.648,
    river: "Krishna",
    basin: "Krishna Basin",
    description: "Key hydraulic structure on Krishna river managing irrigation and municipal releases.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 15400,
      water_area: 820000,
      avg_width: 580,
      turbidity: 41.0,
      flood_risk: 0.38
    }
  },
  {
    id: "site_cuttack",
    name: "Cuttack Mahanadi Station",
    location: "Cuttack, Odisha",
    latitude: 20.4625,
    longitude: 85.8828,
    river: "Mahanadi",
    basin: "Mahanadi Basin",
    description: "Deltaic network prone to cyclonic storm surges and heavy coastal river discharges.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 19800,
      water_area: 910000,
      avg_width: 640,
      turbidity: 55.4,
      flood_risk: 0.54
    }
  },
  {
    id: "site_kosi_ungauged",
    name: "Upper Kosi Tributary (Ungauged)",
    location: "North Bihar Border",
    latitude: 26.54,
    longitude: 86.95,
    river: "Kosi Tributary",
    basin: "Ganga Basin",
    description: "Remote ungauged basin evaluated via regional hydraulic geometry power laws and DEM reach slope.",
    status: "active",
    is_ungauged: true,
    latest: {
      discharge: 9400,
      water_area: 530000,
      avg_width: 390,
      turbidity: 68.2,
      flood_risk: 0.73
    }
  }
]

export function generateMockHistory(siteId, days = 60) {
  const labels = []
  const discharge = []
  const water_area = []
  const turbidity = []
  const flood_risk = []
  const anomaly_flags = []

  const site = MOCK_SITES.find(s => s.id === siteId) || MOCK_SITES[0]
  const baseQ = site.latest.discharge
  const baseA = site.latest.water_area

  const today = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    labels.push(dateStr)

    // Seasonal curve with variations
    const wave = Math.sin((days - i) / 10) * 0.25
    const noise = (Math.random() - 0.5) * 0.1
    const factor = Math.max(0.3, 1 + wave + noise)

    const q = Math.round(baseQ * factor)
    const a = Math.round(baseA * (0.8 + 0.2 * factor))
    const turb = Number((35 + Math.sin(i / 5) * 20 + Math.random() * 10).toFixed(1))
    const risk = Number(Math.min(0.98, Math.max(0.1, (q / (baseQ * 1.3)) * 0.75)).toFixed(2))
    const isAnomaly = (i === 12 || i === 28) ? 1 : 0

    discharge.push(q)
    water_area.push(a)
    turbidity.push(turb)
    flood_risk.push(risk)
    anomaly_flags.push(isAnomaly)
  }

  return {
    site_id: siteId,
    labels,
    datasets: {
      discharge,
      water_area,
      turbidity,
      flood_risk,
      anomaly_flags
    }
  }
}

export function generateMockForecast(siteId, days = 7) {
  const site = MOCK_SITES.find(s => s.id === siteId) || MOCK_SITES[0]
  const baseQ = site.latest.discharge
  const forecasts = []

  const today = new Date()
  for (let i = 1; i <= days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const factor = 1 + (i * 0.05) + (Math.sin(i) * 0.08)
    const q = Math.round(baseQ * factor)
    const riskVal = Math.min(0.95, (q / baseQ) * site.latest.flood_risk)

    forecasts.push({
      date: dateStr,
      day_offset: i,
      predicted_discharge_m3s: q,
      predicted_water_area_m2: Math.round(site.latest.water_area * factor),
      predicted_flood_risk: Number(riskVal.toFixed(2)),
      flood_level: riskVal > 0.7 ? "High" : riskVal > 0.4 ? "Moderate" : "Low",
      rainfall_forecast_mm: Number((10 + i * 4.5 + Math.random() * 8).toFixed(1)),
      soil_saturation_pct: Math.min(95, Math.round(55 + i * 3)),
      confidence_interval: {
        lower: Math.round(q * 0.88),
        upper: Math.round(q * 1.14)
      }
    })
  }

  return {
    site_id: siteId,
    site_name: site.name,
    forecast_days: days,
    generated_at: new Date().toISOString(),
    forecast: forecasts,
    advisories: [
      `Monsoon runoff pulse expected over the next ${days} days across ${site.river} reach.`,
      "Reservoir release monitoring active with satellite SAR altimetry confirmation."
    ]
  }
}

export const MOCK_ALERTS = [
  {
    id: "alert_01",
    site_id: "site_patna",
    site_name: "Patna Ganga Station",
    level: "High",
    title: "Monsoon Inundation Warning",
    message: "Discharge exceeded 31,000 m³/s threshold. Satellite MNDWI indicates 14.2% surface expansion along north embankments.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    acknowledged: false,
    severity: "danger"
  },
  {
    id: "alert_02",
    site_id: "site_guwahati",
    site_name: "Guwahati Brahmaputra Reach",
    level: "Severe",
    title: "Critical Overbank Flood Pulse",
    message: "Radar backscatter drop indicates submerged vegetation across 2,850,000 m² channel zone. Manning discharge ~42,100 m³/s.",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    acknowledged: false,
    severity: "danger"
  },
  {
    id: "alert_03",
    site_id: "site_varanasi",
    site_name: "Varanasi Ghats Station",
    level: "Moderate",
    title: "Elevated Turbidity & Sediment Pulse",
    message: "Optical reflectance index shows turbidity spike (62.1 NTU). Upstream surface runoff ingress detected.",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    acknowledged: true,
    severity: "warning"
  }
]

export const MOCK_ANALYSIS_RESULT = {
  filename: "sentinel2_ganga_monsoon.jpg",
  mission: "Sentinel-2",
  resolution_m: 10.0,
  metrics: {
    water_area_m2: 1245000,
    water_area_km2: 1.245,
    water_pixel_count: 12450,
    total_pixels: 307200,
    water_percentage: 40.5,
    avg_width_m: 785.4,
    centerline_length_m: 1585.2,
    ndwi_mean: 0.462,
    flood_risk_score: 0.74,
    flood_risk_level: "High"
  },
  discharge: {
    discharge_m3s: 28450.0,
    method: "Hybrid Manning-ML (ESCI 2026 Model)",
    flow_velocity_ms: 2.82,
    hydraulic_radius_m: 12.8,
    cross_section_area_m2: 10088.0,
    bed_slope: 0.00015,
    mannings_n: 0.032,
    confidence_interval: {
      lower_m3s: 25605.0,
      upper_m3s: 31295.0
    }
  },
  turbidity: {
    mean_turbidity_ntu: 51.4,
    category: "Moderate Turbidity",
    ndti_mean: 0.18
  },
  anomaly: {
    is_anomaly: true,
    anomaly_score: -0.184,
    severity: "Elevated Discharge Pulse",
    reason: "Water area expanded by 22% compared to historical baseline"
  }
}

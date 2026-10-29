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
    basin: "Ganga River Basin",
    description: "Primary IEEE validation reach (Table III). Multi-braided alluvial channel with dynamic monsoonal flood pulses up to 48,000 m³/s.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 31250,
      water_area: 1420000,
      water_area_ha: 1420,
      water_area_km2: 14.2,
      avg_width: 820,
      reach_length_km: 17.3,
      turbidity: 48.5,
      flood_risk: 0.82,
      q_physics: 30800,
      q_ml: 31600,
      q_final: 31250,
      confidence_pct: 94,
      ndwi: 0.412,
      mndwi: 0.485,
      aweish: 0.228,
      rvi: 1.28
    },
    table3: {
      reach: "Patna Reach (Digha)",
      basin: "Ganga River",
      mae: 542.8,
      rmse: 761.5,
      nse: 0.928,
      r2: 0.946,
      notes: "Braided alluvial channel with dynamic monsoonal sandbars"
    },
    table2: {
      miou: "91.57%",
      dice: "0.956",
      precision: "0.942",
      recall: "0.970",
      model: "Attention U-Net (Proposed)"
    }
  },
  {
    id: "site_bhadrachalam",
    name: "Bhadrachalam Godavari Station",
    location: "Bhadrachalam, Telangana",
    latitude: 17.6688,
    longitude: 80.8936,
    river: "Godavari",
    basin: "Godavari River Basin",
    description: "Key IEEE validation reach (Table III). Dynamic bedform shifts and sandbar migration (n = 0.032–0.041) stabilized via Bayesian weighting.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 22600,
      water_area: 1180000,
      water_area_ha: 1180,
      water_area_km2: 11.8,
      avg_width: 740,
      reach_length_km: 15.9,
      turbidity: 58.2,
      flood_risk: 0.74,
      q_physics: 21900,
      q_ml: 23100,
      q_final: 22600,
      confidence_pct: 93,
      ndwi: 0.395,
      mndwi: 0.462,
      aweish: 0.210,
      rvi: 1.34
    },
    table3: {
      reach: "Bhadrachalam Station",
      basin: "Godavari River",
      mae: 495.3,
      rmse: 698.2,
      nse: 0.933,
      r2: 0.952,
      notes: "Seasonal bedform shifts (n = 0.032–0.041) stabilized by Bayesian solver"
    },
    table2: {
      miou: "91.57%",
      dice: "0.956",
      precision: "0.942",
      recall: "0.970",
      model: "Attention U-Net (Proposed)"
    }
  },
  {
    id: "site_rajahmundry",
    name: "Rajahmundry Godavari Delta",
    location: "Rajahmundry, Andhra Pradesh",
    latitude: 17.0005,
    longitude: 81.804,
    river: "Godavari",
    basin: "Godavari River Basin",
    description: "Peak-fidelity IEEE validation reach (Table III). Peninsular delta geometry with wide alluvial margins (W/d > 60). Regulated by Dowleswaram Barrage.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 24700,
      water_area: 1290000,
      water_area_ha: 1290,
      water_area_km2: 12.9,
      avg_width: 950,
      reach_length_km: 13.6,
      turbidity: 52.3,
      flood_risk: 0.63,
      q_physics: 25100,
      q_ml: 24400,
      q_final: 24700,
      confidence_pct: 96,
      ndwi: 0.428,
      mndwi: 0.501,
      aweish: 0.235,
      rvi: 1.19
    },
    table3: {
      reach: "Rajahmundry Reach (Delta)",
      basin: "Godavari River",
      mae: 518.6,
      rmse: 724.8,
      nse: 0.935,
      r2: 0.954,
      notes: "Peak fidelity reach with stable alluvial geometry (W/d > 60)"
    },
    table2: {
      miou: "91.57%",
      dice: "0.956",
      precision: "0.942",
      recall: "0.970",
      model: "Attention U-Net (Proposed)"
    }
  },
  {
    id: "site_vijayawada",
    name: "Vijayawada Prakasam Barrage",
    location: "Vijayawada, Andhra Pradesh",
    latitude: 16.5062,
    longitude: 80.648,
    river: "Krishna",
    basin: "Krishna River Basin",
    description: "Key IEEE validation reach (Table III). Major hydraulic barrage structure on Krishna river managing irrigation and monsoonal flood spillway discharges.",
    status: "active",
    is_ungauged: false,
    latest: {
      discharge: 15400,
      water_area: 820000,
      water_area_ha: 820,
      water_area_km2: 8.2,
      avg_width: 580,
      reach_length_km: 14.1,
      turbidity: 41.0,
      flood_risk: 0.38,
      q_physics: 15100,
      q_ml: 15600,
      q_final: 15400,
      confidence_pct: 94,
      ndwi: 0.380,
      mndwi: 0.445,
      aweish: 0.198,
      rvi: 1.25
    },
    table3: {
      reach: "Vijayawada Reach (Barrage)",
      basin: "Krishna River",
      mae: 567.3,
      rmse: 787.5,
      nse: 0.924,
      r2: 0.948,
      notes: "Regulated barrage pool with automated sluice discharge tracking"
    },
    table2: {
      miou: "91.57%",
      dice: "0.956",
      precision: "0.942",
      recall: "0.970",
      model: "Attention U-Net (Proposed)"
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
      water_area_ha: 2850,
      water_area_km2: 28.5,
      avg_width: 1450,
      reach_length_km: 19.6,
      turbidity: 78.9,
      flood_risk: 0.91,
      q_physics: 41500,
      q_ml: 42600,
      q_final: 42100,
      confidence_pct: 91,
      ndwi: 0.445,
      mndwi: 0.512,
      aweish: 0.242,
      rvi: 1.48
    },
    table3: {
      reach: "Guwahati Reach",
      basin: "Brahmaputra River",
      mae: 520.1,
      rmse: 710.3,
      nse: 0.925,
      r2: 0.935,
      notes: "Supercritical monsoon braided flow; severe sandbar migration"
    },
    table2: {
      miou: "91.57%",
      dice: "0.956",
      precision: "0.942",
      recall: "0.970",
      model: "Attention U-Net (Proposed)"
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
  const dates = []
  const dischargeList = []
  const lowerList = []
  const upperList = []
  const areaList = []
  const turbList = []
  const riskList = []

  const today = new Date()
  for (let i = 1; i <= days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const factor = 1 + (i * 0.04) + (Math.sin(i * 1.2) * 0.07)
    const q = Math.round(baseQ * factor)
    const riskVal = Math.min(0.95, Number(((q / baseQ) * site.latest.flood_risk).toFixed(2)))
    const lower = Math.round(q * 0.88)
    const upper = Math.round(q * 1.14)
    const area = Math.round((site.latest.water_area * factor) / 10000)
    const turb = Number((38 + i * 2.8 + Math.random() * 5).toFixed(1))

    dates.push(dateStr)
    dischargeList.push(q)
    lowerList.push(lower)
    upperList.push(upper)
    areaList.push(area)
    turbList.push(turb)
    riskList.push(riskVal)

    forecasts.push({
      date: dateStr,
      day_offset: i,
      predicted_discharge_m3s: q,
      predicted_water_area_m2: Math.round(site.latest.water_area * factor),
      predicted_flood_risk: riskVal,
      flood_level: riskVal > 0.7 ? "High" : riskVal > 0.4 ? "Moderate" : "Low",
      rainfall_forecast_mm: Number((10 + i * 4.5 + Math.random() * 8).toFixed(1)),
      soil_saturation_pct: Math.min(95, Math.round(55 + i * 3)),
      confidence_interval: { lower, upper }
    })
  }

  return {
    site_id: siteId,
    site_name: site.name,
    forecast_days: days,
    generated_at: new Date().toISOString(),
    forecast_dates: dates,
    discharge_forecast: dischargeList,
    discharge_lower: lowerList,
    discharge_upper: upperList,
    area_forecast: areaList,
    turbidity_forecast: turbList,
    flood_risk_forecast: riskList,
    flood_alert_threshold: Math.round(baseQ * 1.12),
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
    level: "Advisory",
    alert_type: "Monsoon Inundation Advisory",
    title: "Monsoon Inundation Advisory",
    message: "Discharge reached 31,000 m³/s threshold. Satellite MNDWI indicates 14.2% surface expansion along north embankments.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    acknowledged: false,
    severity: "warning"
  },
  {
    id: "alert_02",
    site_id: "site_guwahati",
    site_name: "Guwahati Brahmaputra Reach",
    level: "Advisory",
    alert_type: "Overbank Flow Pulse",
    title: "Overbank Flow Pulse",
    message: "Radar backscatter drop indicates submerged vegetation across 2,850,000 m² channel zone. Manning discharge ~42,100 m³/s.",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    acknowledged: false,
    severity: "warning"
  },
  {
    id: "alert_03",
    site_id: "site_varanasi",
    site_name: "Varanasi Ghats Station",
    level: "Notice",
    alert_type: "Elevated Turbidity Pulse",
    title: "Elevated Turbidity Pulse",
    message: "Optical reflectance index shows turbidity spike (62.1 NTU). Upstream surface runoff ingress detected.",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    acknowledged: true,
    severity: "info"
  }
]

export function generateMockAnalysis(demoName = 'sentinel2_ganga_monsoon.jpg', params = {}) {
  const mission = params.mission || (
    demoName.includes('planetscope') ? 'PlanetScope' :
    demoName.includes('sar') || demoName.includes('sentinel1') ? 'Sentinel-1' :
    demoName.includes('nisar') ? 'NISAR' : 'Sentinel-2'
  )

  const rainfall = Number(params.rainfall_mm ?? 25)
  const soilMoisture = Number(params.soil_moisture_pct ?? 60)
  const reservoir = Number(params.reservoir_release_m3s ?? 500)
  const isUngauged = Boolean(params.is_ungauged)

  const isNarrow = demoName.includes('planetscope')
  const isVeg = demoName.includes('nisar') || demoName.includes('flooded_veg')
  
  // River-specific geometry and baseline values
  let baseWidth = 820
  let baseAreaKm2 = 14.2
  let reachLengthKm = 17.3
  let qBase = 31250
  let siteName = 'PATNA REACH — GANGA RIVER'
  let table3Info = {
    reach: 'Patna Reach (Digha)',
    basin: 'Ganga River Basin',
    mae: 412.5,
    rmse: 620.4,
    nse: 0.932,
    r2: 0.945,
    notes: 'Braided alluvial channel with dynamic monsoonal sandbars'
  }

  const dName = demoName.toLowerCase()
  if (dName.includes('bhadrachalam') || dName.includes('flood_event')) {
    siteName = 'BHADRACHALAM STATION — GODAVARI RIVER'
    baseWidth = 740
    baseAreaKm2 = 11.8
    reachLengthKm = 15.9
    qBase = 22600
    table3Info = {
      reach: 'Bhadrachalam Station',
      basin: 'Godavari River Basin',
      mae: 284.1,
      rmse: 415.8,
      nse: 0.928,
      r2: 0.938,
      notes: 'Seasonal bedform shifts (n = 0.032–0.041) stabilized by Bayesian solver'
    }
  } else if (dName.includes('rajahmundry') || dName.includes('river_ganga_sample')) {
    siteName = 'RAJAHMUNDRY DELTA — GODAVARI RIVER'
    baseWidth = 950
    baseAreaKm2 = 12.9
    reachLengthKm = 13.6
    qBase = 24700
    table3Info = {
      reach: 'Rajahmundry Reach (Delta)',
      basin: 'Godavari River Basin',
      mae: 348.6,
      rmse: 512.2,
      nse: 0.936,
      r2: 0.944,
      notes: 'Peak fidelity reach with stable alluvial geometry (W/d > 60)'
    }
  } else if (dName.includes('vijayawada') || dName.includes('reservoir_sample')) {
    siteName = 'VIJAYAWADA PRAKASAM BARRAGE — KRISHNA RIVER'
    baseWidth = 580
    baseAreaKm2 = 8.2
    reachLengthKm = 14.1
    qBase = 15400
    table3Info = {
      reach: 'Vijayawada Reach (Barrage)',
      basin: 'Krishna River Basin',
      mae: 315.4,
      rmse: 480.9,
      nse: 0.930,
      r2: 0.941,
      notes: 'Regulated barrage pool with automated sluice discharge tracking'
    }
  } else if (dName.includes('guwahati')) {
    siteName = 'GUWAHATI BRAHMAPUTRA REACH'
    baseWidth = 1450
    baseAreaKm2 = 28.5
    reachLengthKm = 19.6
    qBase = 42100
    table3Info = {
      reach: 'Guwahati Reach',
      basin: 'Brahmaputra River Basin',
      mae: 520.1,
      rmse: 710.3,
      nse: 0.925,
      r2: 0.935,
      notes: 'High sediment discharge channel with extreme monsoonal flood pulses'
    }
  } else if (isNarrow) {
    siteName = 'NARROW TRIBUTARY CHANNEL (<30M)'
    baseWidth = 24
    baseAreaKm2 = 0.38
    reachLengthKm = 2.4
    qBase = 3400
  } else if (isVeg) {
    siteName = 'SUBMERGED VEGETATION CANOPY (SAR RVI)'
    baseWidth = 610
    baseAreaKm2 = 2.15
    reachLengthKm = 3.5
    qBase = 14800
  }

  const forcing = (rainfall * 140 * (soilMoisture / 50)) + (reservoir * 1.1)
  const qPhys = Math.round(qBase + forcing * 0.95)
  const qML = Math.round(qBase * 1.05 + forcing * 1.05)
  const qFinal = Math.round(qPhys * 0.44 + qML * 0.56)

  const riskRatio = qFinal / (isNarrow ? 5000 : 30000)
  const floodRisk = riskRatio > 1.2 || rainfall > 50 ? 'Severe' : riskRatio > 0.85 || rainfall > 25 ? 'High' : 'Normal'
  const imgUrl = `./sample-images/${demoName}`

  return {
    filename: demoName,
    site_name: siteName,
    images: {
      original: imgUrl,
      overlay: imgUrl,
      water_mask: imgUrl,
      attention_map: imgUrl,
      centerline: imgUrl,
      ndwi_map: imgUrl,
      sar_polarimetric: imgUrl,
    },
    metrics: {
      area_km2: baseAreaKm2,
      area_pixels: Math.round(baseAreaKm2 * 10000),
      avg_width_m: baseWidth,
      min_width_m: Math.round(baseWidth * 0.6),
      max_width_m: Math.round(baseWidth * 1.4),
      reach_length_km: reachLengthKm,
      coverage_pct: isNarrow ? 18.2 : 40.5,
      ndwi_simulated: 0.462,
      mndwi_simulated: 0.528,
      awei_simulated: 0.215,
      rvi_score: isVeg ? 1.72 : 1.34,
      cloud_pct: 12.0,
      satellite_mission: mission,
      engine_mode: params.engine_mode || 'high_precision',
      narrow_channel_detected: isNarrow,
      flooded_veg_detected: isVeg,
    },
    discharge: {
      discharge_m3s: qFinal,
      discharge_physics: qPhys,
      discharge_ml: qML,
      weights: { w_phys: 0.44, w_ml: 0.56 },
      discharge_low: Math.round(qFinal * 0.91),
      discharge_high: Math.round(qFinal * 1.11),
      uncertainty_sigma: Math.round(qFinal * 0.05),
      flood_risk: floodRisk,
      lead_time_hours: 34.5,
      confidence_pct: 92,
      is_ungauged: isUngauged,
    },
    turbidity: {
      turbidity_score: 48.5,
      turbidity_level: 'Moderate Turbidity',
      turbidity_anomaly: false,
      mean_turbidity_ntu: 48.5,
    },
    anomaly: {
      anomaly_detected: floodRisk === 'Severe' || floodRisk === 'High',
      severity: floodRisk === 'Severe' ? 'severe' : 'moderate',
      description: 'Runoff volume expansion along reach channel',
    },
    table3: table3Info,
    table2: {
      model: 'Attention U-Net (Proposed)',
      miou: '91.57%',
      dice: '0.956',
      precision: '0.942',
      recall: '0.970',
      notes: 'Soft spatial-spectral gating (αatt); suppresses cloud shadows and terrain artifacts'
    }
  }
}

export const MOCK_ANALYSIS_RESULT = generateMockAnalysis('sentinel2_ganga_monsoon.jpg')

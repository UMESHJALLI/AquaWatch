/**
 * AquaWatch API utility
 * Supports both live FastAPI backend and static GitHub Pages offline fallback.
 */
import axios from 'axios'
import {
  MOCK_SITES,
  generateMockHistory,
  generateMockForecast,
  MOCK_ALERTS,
  MOCK_ANALYSIS_RESULT,
  generateMockAnalysis,
} from './mockData'

const BASE = '/api'

// Helper to attempt API call and fall back to mock data
async function withFallback(apiCall, fallbackData) {
  try {
    const res = await apiCall()
    return res
  } catch (err) {
    // If running statically on GitHub Pages or backend is down, return mock
    return { data: typeof fallbackData === 'function' ? fallbackData() : fallbackData }
  }
}

export const api = {
  // Analysis with multi-source & hydrology params
  analyzeImage: (formData, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    const url = qs ? `${BASE}/analyze-image?${qs}` : `${BASE}/analyze-image`
    return withFallback(
      () => axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => generateMockAnalysis('sentinel2_ganga_monsoon.jpg', params)
    )
  },

  loadDemo: (name = 'sentinel2_ganga_monsoon.jpg', params = {}) => {
    const query = new URLSearchParams({ demo_name: name, ...params }).toString()
    return withFallback(
      () => axios.post(`${BASE}/load-demo?${query}`),
      () => generateMockAnalysis(name, params)
    )
  },

  listSampleImages: () =>
    withFallback(
      () => axios.get(`${BASE}/sample-images`),
      {
        images: [
          'sentinel2_ganga_monsoon.jpg',
          'sentinel1_sar_patna_flood.jpg',
          'planetscope_narrow_channel.jpg',
          'nisar_flooded_vegetation.jpg',
          'lake_chennai_sample.jpg',
        ],
      }
    ),

  downloadReport: () => `${BASE}/download-report`,

  // Sites
  getSites: () =>
    withFallback(
      () => axios.get(`${BASE}/sites`),
      { sites: MOCK_SITES }
    ),

  getSite: (id) =>
    withFallback(
      () => axios.get(`${BASE}/site/${id}`),
      () => MOCK_SITES.find((s) => s.id === id) || MOCK_SITES[0]
    ),

  // History
  getHistory: (siteId, days = 90) =>
    withFallback(
      () => axios.get(`${BASE}/history/${siteId}?days=${days}`),
      () => ({ site_id: siteId, count: days, data: [] })
    ),

  getHistoryChart: (siteId, days = 60) =>
    withFallback(
      () => axios.get(`${BASE}/history/${siteId}/chart?days=${days}`),
      () => generateMockHistory(siteId, days)
    ),

  // Forecast
  getForecast: (siteId, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return withFallback(
      () => axios.get(qs ? `${BASE}/forecast/${siteId}?${qs}` : `${BASE}/forecast/${siteId}`),
      () => generateMockForecast(siteId, 7)
    )
  },

  // Alerts
  getAlerts: () =>
    withFallback(
      () => axios.get(`${BASE}/alerts`),
      { alerts: MOCK_ALERTS }
    ),

  getAlertSummary: () =>
    withFallback(
      () => axios.get(`${BASE}/alerts/summary`),
      { total_active: MOCK_ALERTS.length, severe_count: 1, moderate_count: 1 }
    ),

  acknowledgeAlert: (id) =>
    withFallback(
      () => axios.post(`${BASE}/alerts/${id}/ack`),
      { success: true }
    ),
}

export function formatNumber(val, decimals = 1) {
  if (val == null || isNaN(val)) return '—'
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
  return Number(val).toFixed(decimals)
}

export function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function floodRiskColor(level) {
  const map = { Normal: 'success', Low: 'success', Moderate: 'warning', High: 'danger', Severe: 'danger' }
  return map[level] || 'info'
}

export function turbidityColor(score) {
  if (score < 25) return '#22c55e'
  if (score < 55) return '#f59e0b'
  if (score < 75) return '#f97316'
  return '#ef4444'
}

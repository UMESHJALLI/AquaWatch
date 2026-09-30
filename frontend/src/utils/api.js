/**
 * AquaWatch API utility
 * All API calls to the FastAPI backend
 */
import axios from 'axios'

const BASE = '/api'

export const api = {
  // Analysis with multi-source & hydrology params
  analyzeImage: (formData, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    const url = qs ? `${BASE}/analyze-image?${qs}` : `${BASE}/analyze-image`
    return axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  loadDemo: (name = 'sentinel2_ganga_monsoon.jpg', params = {}) => {
    const query = new URLSearchParams({ demo_name: name, ...params }).toString()
    return axios.post(`${BASE}/load-demo?${query}`)
  },
  listSampleImages: () => axios.get(`${BASE}/sample-images`),
  downloadReport: () => `${BASE}/download-report`,

  // Sites
  getSites: () => axios.get(`${BASE}/sites`),
  getSite: (id) => axios.get(`${BASE}/site/${id}`),

  // History
  getHistory: (siteId, days = 90) => axios.get(`${BASE}/history/${siteId}?days=${days}`),
  getHistoryChart: (siteId, days = 60) => axios.get(`${BASE}/history/${siteId}/chart?days=${days}`),

  // Forecast
  getForecast: (siteId, params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return axios.get(qs ? `${BASE}/forecast/${siteId}?${qs}` : `${BASE}/forecast/${siteId}`)
  },

  // Alerts
  getAlerts: () => axios.get(`${BASE}/alerts`),
  getAlertSummary: () => axios.get(`${BASE}/alerts/summary`),
  acknowledgeAlert: (id) => axios.post(`${BASE}/alerts/${id}/ack`),
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

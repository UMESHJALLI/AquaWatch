import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, AlertTriangle, Download } from 'lucide-react'
import { api, formatNumber } from '../utils/api'
import ForecastChart from '../charts/ForecastChart'
import AlertPanel from '../components/AlertPanel'
import MetricCard from '../components/MetricCard'
import toast from 'react-hot-toast'

export default function ForecastAlerts() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('site_patna')
  const [forecast, setForecast] = useState({})
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async (siteId = selectedSite) => {
    setLoading(true)
    try {
      const [sitesR, fcR, alertsR] = await Promise.all([
        api.getSites(),
        api.getForecast(siteId),
        api.getAlerts(),
      ])
      setSites(sitesR.data.sites)
      setForecast(fcR.data)
      setAlerts(alertsR.data.alerts)
    } catch (e) {
      toast.error('Failed to load forecast data. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [selectedSite])

  const handleAck = async (id) => {
    await api.acknowledgeAlert(id)
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: 1 } : a))
    toast.success('Alert dismissed')
  }

  // Summary stats from forecast
  const maxDischarge = forecast.discharge_forecast ? Math.max(...forecast.discharge_forecast) : null
  const avgDischarge = forecast.discharge_forecast ? forecast.discharge_forecast.reduce((a, b) => a + b, 0) / forecast.discharge_forecast.length : null
  const floodTriggerDays = forecast.discharge_forecast?.filter(v => v > (forecast.flood_alert_threshold ?? 30000)).length ?? 0
  const maxRisk = forecast.flood_risk_forecast ? Math.max(...forecast.flood_risk_forecast) : null

  const unreadCount = alerts.filter(a => !a.acknowledged).length
  const severeCount = alerts.filter(a => a.severity === 'severe').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Forecast</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">7-day river discharge projection and hydrological forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <a href="/api/download-report" target="_blank" className="btn-secondary text-xs py-2 px-3">
            <Download size={14} /> Report
          </a>
        </div>
      </div>

      {/* Alert summary bar */}
      {(unreadCount > 0 || severeCount > 0) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle size={18} className="text-red-500" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} — {severeCount} severe event{severeCount !== 1 ? 's' : ''} requiring attention
          </p>
        </motion.div>
      )}

      {/* Forecast KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Peak Discharge" value={formatNumber(maxDischarge, 0)} unit="m³/s" icon={TrendingUp} color="purple" loading={loading} subtitle="7-day max" />
        <MetricCard title="Avg Discharge" value={formatNumber(avgDischarge, 0)} unit="m³/s" icon={TrendingUp} color="sky" loading={loading} subtitle="7-day mean" />
        <MetricCard title="Flood Alert Days" value={floodTriggerDays} unit="days" icon={AlertTriangle} color={floodTriggerDays > 0 ? 'red' : 'green'} loading={loading} subtitle="Above threshold" />
        <MetricCard title="Max Flood Risk" value={maxRisk != null ? (maxRisk * 100).toFixed(0) : '—'} unit="%" icon={AlertTriangle} color={maxRisk > 0.7 ? 'red' : maxRisk > 0.4 ? 'amber' : 'green'} loading={loading} />
      </div>

      {/* Forecast chart */}
      <div className="mb-6">
        {loading ? (
          <div className="glass-card p-5 h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ForecastChart forecast={forecast} />
        )}
      </div>

      {/* Forecast table */}
      {forecast.forecast_dates?.length > 0 && (
        <div className="glass-card p-5 mb-6">
          <h3 className="chart-title mb-4">7-Day Forecast Table</h3>
          <p className="text-xs text-slate-400 mb-3">Multi-day discharge projection with confidence intervals</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {['Date', 'Discharge (m³/s)', 'Lower', 'Upper', 'Water Area (ha)', 'Flood Risk', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecast.forecast_dates.map((date, i) => {
                  const q = forecast.discharge_forecast?.[i]
                  const risk = forecast.flood_risk_forecast?.[i]
                  const isAlert = q > (forecast.flood_alert_threshold ?? 30000)
                  return (
                    <tr key={date} className={`border-b border-slate-100 dark:border-slate-800 ${isAlert ? 'bg-red-50/40 dark:bg-red-900/10' : ''}`}>
                      <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{date}</td>
                      <td className="py-2 px-3 font-semibold text-purple-600 dark:text-purple-400">{formatNumber(q, 0)}</td>
                      <td className="py-2 px-3 text-slate-400">{formatNumber(forecast.discharge_lower?.[i], 0)}</td>
                      <td className="py-2 px-3 text-slate-400">{formatNumber(forecast.discharge_upper?.[i], 0)}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{formatNumber(forecast.area_forecast?.[i], 0)}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{risk != null ? (risk * 100).toFixed(1) + '%' : '—'}</td>
                      <td className="py-2 px-3">
                        {isAlert
                          ? <span className="badge badge-danger text-[10px]">⚠ Alert</span>
                          : <span className="badge badge-success text-[10px]">Normal</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts section */}
      <div>
        <AlertPanel alerts={alerts} onAck={handleAck} loading={loading} />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, BarChart3, Droplets, Activity, RefreshCw, ChevronDown } from 'lucide-react'
import { api, formatNumber } from '../utils/api'
import MapView from '../components/MapView'
import DischargeChart from '../charts/DischargeChart'
import TurbidityChart from '../charts/TurbidityChart'
import MetricCard from '../components/MetricCard'
import toast from 'react-hot-toast'

export default function SiteMonitoring() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('site_patna')
  const [siteDetail, setSiteDetail] = useState(null)
  const [chartData, setChartData] = useState({})
  const [days, setDays] = useState(60)
  const [loading, setLoading] = useState(true)

  const load = async (siteId = selectedSite, d = days) => {
    setLoading(true)
    try {
      const [sitesR, detailR, chartR] = await Promise.all([
        api.getSites(),
        api.getSite(siteId),
        api.getHistoryChart(siteId, d),
      ])
      // Attach latest data to each site for map display
      const updatedSites = sitesR.data.sites.map(s =>
        s.id === siteId ? { ...s, latest: detailR.data.latest } : s
      )
      setSites(updatedSites)
      setSiteDetail(detailR.data)
      setChartData(chartR.data)
    } catch (e) {
      toast.error('Failed to load site data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [selectedSite, days])

  const latest = siteDetail?.latest || {}
  const historyRows = chartData.labels?.map((date, i) => ({
    date,
    discharge: chartData.datasets?.discharge?.[i],
    water_area: chartData.datasets?.water_area?.[i],
    turbidity: chartData.datasets?.turbidity?.[i],
    flood_risk: chartData.datasets?.flood_risk?.[i],
  })) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Site Monitoring</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historical trends by monitoring station</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={days} onChange={e => setDays(Number(e.target.value))}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
          </select>
          <button onClick={() => load()} className="btn-ghost" title="Refresh">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Site info card */}
      {siteDetail && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-sky-500" />
              <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white">{siteDetail.name}</h2>
              <span className="badge badge-success text-[10px]">{siteDetail.status === 'demo' ? 'Active' : siteDetail.status}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{siteDetail.description}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>📍 {siteDetail.location}</span>
              <span>🌊 {siteDetail.river}</span>
              <span>🌐 {siteDetail.latitude?.toFixed(3)}°N, {siteDetail.longitude?.toFixed(3)}°E</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metric cards for latest */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Latest Discharge" value={formatNumber(latest.discharge, 0)} unit="m³/s" icon={Activity} color="sky" loading={loading} />
        <MetricCard title="Water Area" value={formatNumber(latest.water_area, 0)} unit="ha" icon={Droplets} color="teal" loading={loading} />
        <MetricCard title="Turbidity" value={formatNumber(latest.turbidity, 1)} unit="/100" icon={BarChart3} color="amber" loading={loading} />
        <MetricCard title="Anomalies" value={chartData.datasets?.anomaly_flags?.filter(Boolean).length ?? '—'} unit="detected" icon={BarChart3}
          color={chartData.datasets?.anomaly_flags?.some(Boolean) ? 'red' : 'green'} loading={loading} subtitle={`Last ${days} days`} />
      </div>

      {/* Map */}
      <div className="mb-6">
        <h3 className="chart-title mb-3">Monitoring Site Map</h3>
        <MapView sites={sites} selectedSite={selectedSite} onSiteClick={id => setSelectedSite(id)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DischargeChart data={historyRows} anomalyFlags={chartData.datasets?.anomaly_flags} />
        <TurbidityChart data={historyRows} />
      </div>

      {/* Anomaly table */}
      {historyRows.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="chart-title mb-2">Anomaly Events (Isolation Forest Detection)</h3>
          <p className="text-xs text-slate-500 mb-4">Historical anomaly instances identified via unsupervised multivariate Isolation Forest across discharge, water surface area, and turbidity.</p>
          {historyRows.filter((_, i) => chartData.datasets?.anomaly_flags?.[i]).length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No anomalies detected in this time window</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {['Date', 'Discharge', 'Turbidity', 'Flood Risk', 'Status'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyRows.filter((_, i) => chartData.datasets?.anomaly_flags?.[i]).slice(-20).map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 bg-red-50/30 dark:bg-red-900/10">
                      <td className="py-2 px-3 font-medium">{row.date}</td>
                      <td className="py-2 px-3">{Number(row.discharge).toFixed(0)} m³/s</td>
                      <td className="py-2 px-3">{Number(row.turbidity).toFixed(1)}</td>
                      <td className="py-2 px-3">{(Number(row.flood_risk) * 100).toFixed(1)}%</td>
                      <td className="py-2 px-3"><span className="badge badge-danger text-[10px]">⚠ Anomaly</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

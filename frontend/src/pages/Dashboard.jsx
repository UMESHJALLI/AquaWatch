import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Waves, Activity, AlertTriangle, Wind, MapPin, RefreshCw, Download } from 'lucide-react'
import { api, formatNumber } from '../utils/api'
import MetricCard from '../components/MetricCard'
import DischargeChart from '../charts/DischargeChart'
import TurbidityChart from '../charts/TurbidityChart'
import MapView from '../components/MapView'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('site_patna')
  const [siteDetail, setSiteDetail] = useState(null)
  const [chartData, setChartData] = useState({ labels: [], datasets: {} })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (siteId = selectedSite) => {
    try {
      const [sitesRes, detailRes, chartRes] = await Promise.all([
        api.getSites(),
        api.getSite(siteId),
        api.getHistoryChart(siteId, 60),
      ])
      setSites(sitesRes.data.sites.map(s => ({ ...s, latest: detailRes.data.id === s.id ? detailRes.data.latest : undefined })))
      setSiteDetail(detailRes.data)
      setChartData(chartRes.data)
    } catch (e) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [selectedSite])

  const handleRefresh = () => { setRefreshing(true); load() }

  const latest = siteDetail?.latest || {}

  // Build chart rows from datasets
  const historyRows = chartData.labels?.map((date, i) => ({
    date,
    discharge: chartData.datasets?.discharge?.[i],
    water_area: chartData.datasets?.water_area?.[i],
    turbidity: chartData.datasets?.turbidity?.[i],
    flood_risk: chartData.datasets?.flood_risk?.[i],
  })) || []

  const latestDischarge = latest.discharge ? formatNumber(latest.discharge, 0) : '—'
  const latestArea = latest.water_area ? formatNumber(latest.water_area, 0) : '—'
  const latestWidth = latest.avg_width ? formatNumber(latest.avg_width, 0) : '—'
  const latestTurb = latest.turbidity ? formatNumber(latest.turbidity, 1) : '—'
  const floodRisk = latest.flood_risk > 0.7 ? 'High' : latest.flood_risk > 0.4 ? 'Moderate' : 'Low'
  const floodColor = latest.flood_risk > 0.7 ? 'red' : latest.flood_risk > 0.4 ? 'amber' : 'green'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Monitoring Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Satellite-based water body detection and discharge monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Site selector */}
          <select
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={handleRefresh} disabled={refreshing} className="btn-ghost gap-1.5" title="Refresh">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <a href="/api/download-report" target="_blank" className="btn-secondary text-xs py-2 px-3">
            <Download size={14} /> Report
          </a>
        </div>
      </div>

      {/* Site info banner */}
      {siteDetail && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-sm">
          <MapPin size={16} className="text-sky-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-sky-800 dark:text-sky-300">{siteDetail.name}</span>
            <span className="text-sky-700 dark:text-sky-400"> · {siteDetail.location} · {siteDetail.river}</span>
          </div>
          <span className="ml-auto badge badge-success">
            {siteDetail.status === 'demo' ? 'Active' : siteDetail.status}
          </span>
        </motion.div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Water Area" value={latestArea} unit="ha" icon={Droplets} color="sky" loading={loading} />
        <MetricCard title="River Width" value={latestWidth} unit="m" icon={Waves} color="teal" loading={loading} />
        <MetricCard title="Discharge" value={latestDischarge} unit="m³/s" icon={Activity} color="purple" loading={loading} subtitle="Hybrid Model (Eq. 9)" />
        <MetricCard title="Turbidity" value={latestTurb} unit="/100" icon={Wind} color="amber" loading={loading} subtitle="Calibrated Index" />
        <MetricCard
          title="Flood Risk"
          value={floodRisk}
          icon={AlertTriangle}
          color={floodColor}
          loading={loading}
          badge={{ label: floodRisk, className: `badge-${floodColor === 'green' ? 'success' : floodColor === 'amber' ? 'warning' : 'danger'}` }}
        />
        <MetricCard
          title="Anomalies"
          value={chartData.datasets?.anomaly_flags?.filter(Boolean).length ?? '—'}
          unit="detected"
          icon={AlertTriangle}
          color={chartData.datasets?.anomaly_flags?.some(Boolean) ? 'red' : 'green'}
          loading={loading}
          subtitle="Last 60 days"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DischargeChart data={historyRows} anomalyFlags={chartData.datasets?.anomaly_flags} />
        <TurbidityChart data={historyRows} />
      </div>

      {/* Basin Monitoring Map */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="chart-title flex items-center gap-2">
              <MapPin size={16} className="text-sky-500" />
              Basin Monitoring Network & Satellite Stations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any station marker on the map to inspect its real-time hydrological profile</p>
          </div>
          <span className="badge badge-info text-xs">
            {sites.length} Active Stations
          </span>
        </div>
        <MapView sites={sites} selectedSite={selectedSite} onSiteClick={id => setSelectedSite(id)} />
      </div>
    </div>
  )
}

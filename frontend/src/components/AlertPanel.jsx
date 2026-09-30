import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react'

function formatAlertTime(timestamp) {
  if (!timestamp) return 'Live'
  try {
    const d = new Date(timestamp)
    if (isNaN(d.getTime())) return 'Live'
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return 'Active'
  } catch {
    return 'Live'
  }
}

export default function AlertPanel({ alerts = [], onAck, loading = false }) {
  const unacked = alerts.filter(a => !a.acknowledged)

  return (
    <div className="glass-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="chart-title flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Active Hydrological Alerts
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Automated satellite threshold triggers</p>
        </div>
        <span className="badge badge-warning text-[10px]">
          {unacked.length} Active
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-slate-400">
          <CheckCircle size={28} className="text-emerald-500 mb-2 opacity-80" />
          <p className="text-xs">No active hydrological hazards</p>
          <p className="text-[10px] text-slate-500 mt-0.5">All monitored reaches operating normally</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
          {alerts.map((alert) => {
            const isSevere = alert.severity === 'severe'
            const isWarning = alert.severity === 'warning'
            const borderCol = isSevere
              ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20'
              : isWarning
              ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20'
              : 'border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/20'

            const iconCol = isSevere ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-sky-500'

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border ${borderCol} transition-all ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isSevere ? (
                      <AlertCircle size={15} className={iconCol} />
                    ) : (
                      <AlertTriangle size={15} className={iconCol} />
                    )}
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                      {alert.alert_type}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    {formatAlertTime(alert.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {alert.site_name}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                      Auto-CV
                    </span>
                  </div>
                  {!alert.acknowledged && onAck && (
                    <button
                      onClick={() => onAck(alert.id)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

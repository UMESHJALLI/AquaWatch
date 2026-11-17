import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X, HelpCircle } from 'lucide-react'

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  color = 'sky',
  subtitle,
  badge,
  loading = false,
  info,
}) {
  const [showInfo, setShowInfo] = useState(false)

  const colorMap = {
    sky: 'text-sky-500 bg-sky-50 dark:bg-sky-900/30 border-sky-100 dark:border-sky-800',
    teal: 'text-teal-500 bg-teal-50 dark:bg-teal-900/30 border-teal-100 dark:border-teal-800',
    purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800',
    green: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800',
    red: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800',
  }

  const activeColor = colorMap[color] || colorMap.sky

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="glass-card p-4 flex flex-col justify-between relative group"
    >
      <div className="flex items-center justify-between mb-2 gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate" title={title}>
            {title}
          </span>
          {info && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowInfo(!showInfo)
              }}
              title="Click to understand this metric"
              className="text-slate-400 hover:text-sky-500 transition-colors p-0.5 rounded focus:outline-none"
            >
              <HelpCircle size={13} className="flex-shrink-0" />
            </button>
          )}
        </div>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0 ${activeColor}`}>
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="my-1">
        {loading ? (
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{unit}</span>
            )}
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-1 flex items-center justify-between gap-1 text-[11px]">
          {subtitle && (
            <span className="text-slate-400 dark:text-slate-500 truncate">{subtitle}</span>
          )}
          {badge && (
            <span className={`badge text-[10px] py-0 px-1.5 ${badge.className || 'badge-info'}`}>
              {badge.label}
            </span>
          )}
        </div>
      )}

      {/* Explanatory Info Modal / Popover */}
      <AnimatePresence>
        {showInfo && info && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-2 bottom-2 z-30 p-3 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700 text-white shadow-xl text-left"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5 border-b border-slate-800 pb-1">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <Info size={11} /> Understanding {title}
              </span>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                <X size={12} />
              </button>
            </div>
            {typeof info === 'string' ? (
              <p className="text-[11px] text-slate-300 leading-relaxed">{info}</p>
            ) : (
              <div className="space-y-1 text-[11px]">
                {info.what && (
                  <p className="text-slate-200 leading-snug">
                    <strong className="text-sky-300">What:</strong> {info.what}
                  </p>
                )}
                {info.range && (
                  <p className="text-slate-300 leading-snug">
                    <strong className="text-emerald-300">Safe Range:</strong> {info.range}
                  </p>
                )}
                {info.alert && (
                  <p className="text-amber-200 leading-snug">
                    <strong className="text-rose-300">Alert Threshold:</strong> {info.alert}
                  </p>
                )}
                {info.how && (
                  <p className="text-slate-400 leading-snug text-[10px] pt-0.5 border-t border-slate-800">
                    <strong className="text-slate-300">Method:</strong> {info.how}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

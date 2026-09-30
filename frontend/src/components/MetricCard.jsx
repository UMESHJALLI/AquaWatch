import { motion } from 'framer-motion'

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  color = 'sky',
  subtitle,
  badge,
  loading = false,
}) {
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
      className="glass-card p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{title}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${activeColor}`}>
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
    </motion.div>
  )
}

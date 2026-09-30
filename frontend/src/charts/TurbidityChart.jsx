import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span style={{ background: p.color || p.stroke }} className="w-2 h-2 rounded-full inline-block" />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {Number(p.value).toFixed(1)} / 100
          </span>
        </div>
      ))}
    </div>
  )
}

export default function TurbidityChart({ data = [] }) {
  if (!data?.length) {
    return (
      <div className="glass-card p-5 flex items-center justify-center h-64 text-slate-400 text-xs">
        No water quality history available
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="chart-title flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          Turbidity & River Health Trend
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">
          Red/Green Ratio Proxy
        </span>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
        Water clarity score & sedimentation tracking (CPCB threshold: 70)
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine
            y={70}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: '⚠ High Turbidity Threshold', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }}
          />
          <Line
            type="monotone"
            dataKey="turbidity"
            name="Turbidity Index"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

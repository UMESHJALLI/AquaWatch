import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Layers, Scan, Cpu, Compass, Activity, ShieldAlert } from 'lucide-react'

export default function ImageViewer({ images = {}, loading = false }) {
  const [activeTab, setActiveTab] = useState('overlay')

  const tabs = [
    { id: 'overlay', label: 'Water Overlay', icon: Layers, desc: 'Delineated river boundaries & flooded areas' },
    { id: 'original', label: 'Satellite True Color', icon: Eye, desc: 'Incoming multispectral satellite scene' },
    { id: 'water_mask', label: 'Binary Mask', icon: Scan, desc: 'Clean pixel-level water body segmentation' },
    { id: 'attention_map', label: 'Attention Gate Map', icon: Cpu, desc: 'Attention U-Net edge weights (Fig. 2d)' },
    { id: 'centerline', label: 'Centerline & Transects', icon: Compass, desc: 'Hydraulic skeleton & cross-section widths' },
    { id: 'ndwi_map', label: 'NDWI Heatmap', icon: Activity, desc: 'Normalized Difference Water Index gradient' },
    { id: 'sar_polarimetric', label: 'SAR Flooded Veg', icon: ShieldAlert, desc: 'Dual-pol backscatter canopy penetration' },
  ]

  const activeImage = images[activeTab] || images['overlay'] || images['original']
  const currentTabInfo = tabs.find(t => t.id === activeTab)

  return (
    <div className="glass-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-2 bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-700/60 overflow-x-auto scrollbar-none">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            disabled={loading || !images[id]}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/40 disabled:opacity-40'
            }`}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Image display view */}
      <div className="relative min-h-[340px] max-h-[460px] bg-slate-900 flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
            <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Running Computer Vision & Attention U-Net...</p>
          </div>
        ) : activeImage ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={activeImage}
              alt={activeTab}
              className="w-full h-auto max-h-[460px] object-contain"
            />
          </AnimatePresence>
        ) : (
          <div className="text-slate-500 text-xs py-16 text-center">
            <Layers size={32} className="mx-auto mb-2 opacity-40" />
            Upload a satellite image or select a demo scene to view analysis layers
          </div>
        )}

        {/* Legend / Overlay description bar */}
        {activeImage && !loading && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
            <span>{currentTabInfo?.desc}</span>
            <span className="text-[10px] text-sky-400 font-mono">10m / 3m Grid coregistered</span>
          </div>
        )}
      </div>
    </div>
  )
}

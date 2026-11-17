import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronDown, ChevronUp, Droplets, Waves, Activity,
  Wind, AlertTriangle, ShieldCheck, Layers, Cpu, Compass, CheckCircle2, Sparkles, HelpCircle
} from 'lucide-react'

export default function DataGuideSection({ defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [activeTab, setActiveTab] = useState('metrics')

  const coreMetrics = [
    {
      title: 'Water Surface Area',
      symbol: 'A (ha / km²)',
      icon: Droplets,
      color: 'sky',
      what: 'Total open water surface currently covering the river reach and adjacent floodplains.',
      simpleUnits: '1 hectare (ha) = 10,000 m² (about 1.4 full football fields). 100 ha = 1 km².',
      safeRange: 'Typical non-flood reach: 800 – 1,500 ha depending on season.',
      dangerLevel: '> 2,000 ha (+35% over baseline) signals severe floodplain inundation.',
      howItWorks: 'Counted from 10m Sentinel-2 / Sentinel-1 satellite pixels identified by the Attention U-Net AI model.',
      impact: 'Allows authorities to quantify agricultural crop submersion and track rising flood boundaries without waiting for ground surveys.'
    },
    {
      title: 'Mean Channel Width',
      symbol: 'W (meters)',
      icon: Waves,
      color: 'teal',
      what: 'The average bank-to-bank width of the river flow along the surveyed channel reach.',
      simpleUnits: 'Measured in meters (m) perpendicular to the river flow direction.',
      safeRange: 'Standard channel reach: 500 – 850 m during normal flow seasons.',
      dangerLevel: '> 1,100 m indicates that water has overtopped natural banks and spread into surrounding terrain.',
      howItWorks: 'The AI extracts the topological river centerline using the Zhang-Suen skeleton algorithm, then computes orthogonal transects every 10 meters.',
      impact: 'Channel widening is the earliest physical indicator of an approaching flood wave crest.'
    },
    {
      title: 'Estimated River Discharge',
      symbol: 'Q (m³/s)',
      icon: Activity,
      color: 'purple',
      what: 'The volumetric rate of water flowing past the monitored river reach per second.',
      simpleUnits: '1 m³/s equals 1,000 liters of water rushing past every single second!',
      safeRange: 'Dry season: 2,000 – 8,000 m³/s. Normal monsoon: 15,000 – 25,000 m³/s.',
      dangerLevel: '> 30,000 m³/s triggers official flood warning status; > 42,000 m³/s triggers evacuation emergencies.',
      howItWorks: 'Hybrid model: Manning hydraulic physics (channel geometry + slope) fused with Gradient Boosted Trees via Bayesian minimum-variance weighting.',
      impact: 'The single most vital metric for operating reservoir spillways (e.g. Dowleswaram & Prakasam barrages) and dam safety.'
    },
    {
      title: 'Water Turbidity Index',
      symbol: 'Score / 100 (NTU)',
      icon: Wind,
      color: 'amber',
      what: 'The clarity vs cloudiness of the water caused by suspended sediment, silt, and runoff.',
      simpleUnits: 'Normalized scale from 0 (crystal clear) to 100 (heavily muddy sediment plume).',
      safeRange: '0 – 25: Clear water. 26 – 55: Moderate natural river runoff.',
      dangerLevel: '> 70: Heavy sediment erosion; > 85: Severe post-storm debris or dangerous flash-flood sludge.',
      howItWorks: 'Computed from satellite spectral reflectance combining Red-to-Blue light ratios, HSV saturation, and surface texture roughness.',
      impact: 'Warns municipal drinking water treatment plants to adjust filtration intake and detects upstream catchment soil erosion.'
    },
    {
      title: 'Early Flood Hazard Risk',
      symbol: 'Risk Level (0–100%)',
      icon: AlertTriangle,
      color: 'red',
      what: 'The real-time probability of bank overtopping, levee breach, or residential inundation.',
      simpleUnits: 'Categorized into Low (<40%), Moderate (40–70%), High (>70%), and Severe (>85%).',
      safeRange: 'Low / Normal: Routine seasonal river levels contained safely within natural levees.',
      dangerLevel: 'High / Severe: Critical overbank flooding; emergency pre-release protocols active.',
      howItWorks: 'Evaluated by a multivariate Isolation Forest combining satellite width, estimated discharge, upstream rainfall, and soil saturation.',
      impact: 'Provides up to 34.5 to 36 hours of lead warning before the peak crest reaches downstream towns.'
    },
    {
      title: 'Hydrological Anomalies',
      symbol: 'Detected Events',
      icon: ShieldCheck,
      color: 'emerald',
      what: 'Statistical deviations that depart significantly from expected seasonal hydrological patterns.',
      simpleUnits: 'Count of anomalous days or surge events detected in the trailing 60-day window.',
      safeRange: '0 events: River behaviour is fully consistent with historical seasonal trends.',
      dangerLevel: 'Events flagged: Sudden unseasonal cloudbursts, sudden upstream dam gate releases, or sensor noise.',
      howItWorks: 'Unsupervised Machine Learning (Isolation Forest) paired with 2.5σ z-score boundary verification across all telemetry streams.',
      impact: 'Prevents false alarms by distinguishing genuine flood surges from temporary sensor artifacts.'
    }
  ]

  const cvLayers = [
    {
      name: 'Water Overlay',
      tag: 'Electric Cyan',
      desc: 'Blends satellite true-color imagery with detected water boundaries so you can clearly see where water has spread onto dry land, agricultural fields, or settlements.'
    },
    {
      name: 'Satellite True Color',
      tag: 'Natural RGB (10m / 3m)',
      desc: 'The raw, natural-color satellite scene as seen from orbit by European Space Agency Sentinel-2 or PlanetScope satellites before AI segmentation.'
    },
    {
      name: 'Binary Mask',
      tag: 'Clean 0 / 1 Grid',
      desc: 'The pure computer vision classification where every pixel is strictly labeled either Water (1) or Land (0). Used for precise surface area calculations.'
    },
    {
      name: 'Attention Gate Map',
      tag: 'Attention U-Net αatt',
      desc: 'Reveals where the deep learning model focuses. Bright regions highlight difficult water boundaries and narrow braided streams while ignoring cloud edges and mountain shadows.'
    },
    {
      name: 'Centerline & Transects',
      tag: 'Zhang-Suen Hydraulic Skeleton',
      desc: 'The extracted geometric spine of the river channel. Perpendicular lines (spaced every 10m) measure cross-sectional channel top width (W).'
    },
    {
      name: 'NDWI Heatmap',
      tag: 'Normalized Difference Index',
      desc: 'Visualizes water index values from -1.0 to +1.0. Cool cyan/blue tones indicate pure water; green/brown tones indicate dry soil and vegetation.'
    },
    {
      name: 'SAR Flooded Veg',
      tag: 'Radar Canopy Penetration',
      desc: 'Polarimetric synthetic aperture radar (Sentinel-1 / NISAR) that penetrates through dense forest tree leaves to detect hidden floodwater beneath trees where optical cameras are blind.'
    }
  ]

  const hybridPoints = [
    {
      title: '1. Why Physics Alone (Manning) Is Not Enough',
      desc: 'Manning’s equation requires knowing the exact underwater shape and slope of the riverbed. In real monsoonal rivers (like the Ganga or Godavari), dynamic sandbars constantly shift and bathymetry data is rarely available in real time.'
    },
    {
      title: '2. Why Machine Learning Alone Is Risky',
      desc: 'Pure AI models learn from past data. When a historic 100-year cloudburst or unprecedented storm hits, a pure neural network can produce erratic or physically impossible flow rates.'
    },
    {
      title: '3. The AquaWatch Hybrid Solution (Eq. 9)',
      desc: 'AquaWatch fuses Manning hydraulic physics with Gradient Boosted Trees using Bayesian minimum-variance weighting. When hydraulic geometry is certain, physics leads; during turbulent monsoon floods, data-driven ML stabilizes the estimate, achieving a proven 0.930 Nash-Sutcliffe Efficiency (NSE).'
    },
    {
      title: '4. Ungauged Basin Solver (Leopold-Maddock)',
      desc: 'Over 80% of river reaches worldwide have no physical river gauge. AquaWatch applies regional hydraulic geometry power laws (W = a·Qᵇ) so discharge can be estimated anywhere on Earth purely from satellite images!'
    }
  ]

  return (
    <div className="glass-card mb-8 overflow-hidden border border-sky-100 dark:border-sky-900/40 bg-gradient-to-r from-sky-50/50 via-white to-sky-50/30 dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-800/80">
      {/* Banner Header / Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-sky-50/60 dark:hover:bg-slate-800/50 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Hydrological Data & Indicator Interpretation Guide
              </h2>
              <span className="badge badge-info text-[10px] py-0 px-2 font-medium">
                Plain-English Guide
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click to {isOpen ? 'collapse' : 'expand'} simple explanations for every metric, safe threshold, and satellite layer
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800/60 transition-colors"
        >
          <span>{isOpen ? 'Hide Guide' : 'Learn How to Read Data'}</span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-200/80 dark:border-slate-800"
          >
            {/* Tabs */}
            <div className="flex items-center gap-2 px-5 pt-4 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto scrollbar-none">
              {[
                { id: 'metrics', label: '1. The 6 Core River Metrics', icon: Droplets },
                { id: 'layers', label: '2. The 7 Satellite CV Layers', icon: Layers },
                { id: 'hybrid', label: '3. Hybrid Physics + AI (Why it works)', icon: Cpu },
                { id: 'earlywarning', label: '4. 34.5h Early Warning Guide', icon: AlertTriangle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-800 shadow-sm'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <tab.icon size={13} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Core Metrics */}
            {activeTab === 'metrics' && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreMetrics.map(m => {
                  const Icon = m.icon
                  return (
                    <div
                      key={m.title}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                              <Icon size={15} />
                            </div>
                            <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                              {m.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {m.symbol}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5 leading-relaxed">
                          {m.what}
                        </p>

                        <div className="space-y-1.5 text-[11px] mb-3">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Unit Note:</span>{' '}
                            <span className="text-slate-500 dark:text-slate-400">{m.simpleUnits}</span>
                          </div>
                          <div className="flex items-start gap-1 text-emerald-700 dark:text-emerald-400">
                            <span className="font-bold flex-shrink-0">Safe Baseline:</span>
                            <span>{m.safeRange}</span>
                          </div>
                          <div className="flex items-start gap-1 text-rose-600 dark:text-rose-400">
                            <span className="font-bold flex-shrink-0">Alert Threshold:</span>
                            <span>{m.dangerLevel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400 dark:text-slate-500">
                        <strong className="text-slate-500 dark:text-slate-400">How it’s derived:</strong> {m.howItWorks}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab 2: The 7 CV Layers */}
            {activeTab === 'layers' && (
              <div className="p-5">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  When you upload or select a satellite scene in AquaWatch, our computer vision pipeline breaks down the raw satellite data into 7 distinct inspection layers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {cvLayers.map(l => (
                    <div
                      key={l.name}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">{l.name}</h4>
                        <span className="badge badge-info text-[9px] py-0 px-1.5 font-mono">{l.tag}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{l.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Hybrid Physics + AI */}
            {activeTab === 'hybrid' && (
              <div className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300">
                  <strong>The Core AquaWatch Innovation (Equation 9):</strong> Rather than relying solely on fluid mechanics equations or solely on machine learning, AquaWatch unifies both using uncertainty-weighted Bayesian variance.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hybridPoints.map(p => (
                    <div
                      key={p.title}
                      className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1.5">{p.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: 34.5-Hour Early Warning */}
            {activeTab === 'earlywarning' && (
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm mb-2">
                      01
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">
                      Upstream Satellite Radar & Storm Ingestion
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      6-hourly GPM IMERG rainfall grids and SMAP soil moisture saturation are fed into the basin hydrologic model before floodwaters even reach downstream reaches.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm mb-2">
                      02
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">
                      Real-Time Channel Widening Tracking
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      As river banks begin expanding upstream, AquaWatch calculates width growth rates across 10m cross-sections, anticipating downstream hydrograph surges.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-2">
                      03
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1">
                      Actionable Stakeholder Warning (34.5h)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Reservoir and barrage operators receive 34.5 hours of lead time to adjust spillway discharge safely and alert civil defense teams in low-lying villages.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

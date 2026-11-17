import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Waves, ChevronRight, Upload, Activity, ShieldCheck,
  Eye, Droplets, Compass, BarChart3, ArrowRight
} from 'lucide-react'

const features = [
  { icon: Eye, title: 'Multi-Source Satellite Detection', desc: 'Combines Sentinel-2 optical and Sentinel-1 SAR imagery with Attention U-Net for all-weather water body segmentation.' },
  { icon: Droplets, title: 'Hybrid Discharge Estimation', desc: 'Integrates Manning hydraulic physics with machine learning regressors, providing 95% confidence intervals.' },
  { icon: Activity, title: 'Spectral Water Quality', desc: 'Computes calibrated NDWI, MNDWI, AWEI indices alongside turbidity and water clarity scoring.' },
  { icon: ShieldCheck, title: 'Flood Risk & Early Warning', desc: 'Detects discharge anomalies using multivariate Isolation Forest with up to 36 hours of alert lead time.' },
  { icon: Compass, title: 'Hydraulic Geometry & Transects', desc: 'Extracts river centerlines and computes dynamic channel widths across orthogonal cross-sections.' },
  { icon: BarChart3, title: 'Multi-Basin Surveillance', desc: 'Pre-configured monitoring across major river basins including Ganga, Brahmaputra, Godavari, and Krishna.' },
]

const steps = [
  { num: '01', title: 'Data Ingestion', desc: 'Ingests multi-spectral optical and C-band SAR satellite scenes.' },
  { num: '02', title: 'Attention U-Net', desc: 'Segments water pixels while suppressing background shadows and cloud edges.' },
  { num: '03', title: 'Centerline Extraction', desc: 'Computes river channel skeleton and orthogonal width transects.' },
  { num: '04', title: 'Hybrid Physics-ML', desc: 'Calculates discharge using uncertainty-weighted Manning and ML models.' },
  { num: '05', title: 'Anomaly Detection', desc: 'Flags flood surges and environmental water quality deviations.' },
  { num: '06', title: 'Actionable Reports', desc: 'Generates real-time alerts and comprehensive audit reports.' },
]

const stats = [
  { value: '9+', label: 'River Basins' },
  { value: '365', label: 'Days of History' },
  { value: '36h', label: 'Alert Lead Time' },
  { value: '93%', label: 'Discharge NSE' },
]

export default function LandingPage({ darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
            <Waves size={18} />
          </div>
          <span className="font-semibold text-white tracking-tight">AquaWatch</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/methodology"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Data Guide & Dictionary
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Launch Dashboard <ChevronRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-6">
          <Activity size={13} className="text-sky-400" />
          Satellite Remote Sensing & Hydrological Monitoring
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Satellite-Based Water Body Detection & River Discharge Estimation
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          An automated system combining multi-source optical and polarimetric SAR satellite imagery with Attention U-Net computer vision and physics-guided discharge modeling.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Open Dashboard <ArrowRight size={16} />
          </Link>
          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Upload size={16} /> Ingest & Analyze Scene
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-slate-800">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Key System Capabilities</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Designed for continuous all-weather monitoring and hydrological risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-sky-400">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plain-English Data Understanding Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-800">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/80 text-sky-400 text-xs font-medium mb-3">
            <Droplets size={13} />
            Data Clarity & Interpretability
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Understanding River Data at a Glance
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            AquaWatch transforms raw satellite orbital pixels into simple, intuitive numbers so any reviewer, student, or disaster manager can understand conditions in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-colors">
            <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950/70 border border-sky-800/50 mb-3 inline-block">
              01 · Extent
            </span>
            <h3 className="text-base font-bold text-white mb-1.5">Water Surface Area</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Measured in <strong>hectares (ha)</strong> and <strong>km²</strong>. 1 hectare is 10,000 m² (about 1.4 football fields).
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-emerald-400">Normal:</strong> 800–1,500 ha<br />
              <strong className="text-rose-400">Flood Alert:</strong> &gt; 2,000 ha (+35% expansion)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-colors">
            <span className="text-xs font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-950/70 border border-teal-800/50 mb-3 inline-block">
              02 · Geometry
            </span>
            <h3 className="text-base font-bold text-white mb-1.5">Mean Channel Width</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Measured in <strong>meters (m)</strong> across 10m normal transects along the river centerline skeleton.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-emerald-400">Normal:</strong> 500–850 m<br />
              <strong className="text-rose-400">Flood Alert:</strong> &gt; 1,100 m (Overbank spill)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-colors">
            <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/50 mb-3 inline-block">
              03 · Volume
            </span>
            <h3 className="text-base font-bold text-white mb-1.5">River Discharge (Q)</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Measured in <strong>m³/s</strong> (1 m³/s = 1,000 liters/sec). Fuses Manning hydraulics with machine learning.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-emerald-400">Normal:</strong> 2,000–25,000 m³/s<br />
              <strong className="text-rose-400">Flood Alert:</strong> &gt; 30,000 m³/s (Danger stage)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-colors">
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/50 mb-3 inline-block">
              04 · Hazard
            </span>
            <h3 className="text-base font-bold text-white mb-1.5">34.5h Early Warning</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Combines satellite widening, rainfall, and soil moisture to issue flood warnings up to <strong>34.5 hours early</strong>.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <strong className="text-emerald-400">Lead Time:</strong> Up to 34.5–36 hours<br />
              <strong className="text-amber-400">Action:</strong> Barrage pre-release & evacuations
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/methodology"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
          >
            <span>Explore Complete Data Dictionary & Technical Benchmarks</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Analysis Pipeline */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Analysis Workflow</h2>
          <p className="text-sm text-slate-400">
            End-to-end pipeline from satellite scene acquisition to stakeholder alert dissemination
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map(({ num, title, desc }) => (
            <div
              key={num}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-sky-500 mb-2 block">{num}</span>
                <h3 className="font-semibold text-slate-100 text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simple CTA Box */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-800/80 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Begin Monitoring?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Access live river station data, run computer vision segmentation, or upload custom imagery.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Launch System Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>AquaWatch — Environmental Water Body Detection & River Discharge System</p>
      </footer>
    </div>
  )
}

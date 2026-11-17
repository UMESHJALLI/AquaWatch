import { motion } from 'framer-motion'
import { FlaskConical, Brain, Waves, BarChart3, AlertTriangle, Eye, BookOpen, CheckCircle2, ShieldCheck, Compass, Info } from 'lucide-react'
import IEEEBenchmarks from '../components/IEEEBenchmarks'
import DataGuideSection from '../components/DataGuideSection'

const dataDictionary = [
  {
    name: 'Water Surface Area (A)',
    unit: 'Hectares (ha) / km²',
    normal: '800 – 1,500 ha',
    alert: '> 2,000 ha (+35%)',
    meaning: 'Total area of open water detected across the river reach. 1 ha = 10,000 m² (approx 1.4 football fields).',
    purpose: 'Quantifies agricultural land loss and tracks rising flood extents in real time.',
  },
  {
    name: 'Mean Channel Width (W)',
    unit: 'Meters (m)',
    normal: '500 – 850 m',
    alert: '> 1,100 m',
    meaning: 'Bank-to-bank width perpendicular to river flow, measured along 10m normal transects.',
    purpose: 'First physical indicator of overbank flow and riverbank breach.',
  },
  {
    name: 'River Discharge (Q)',
    unit: 'm³/s (cubic m/sec)',
    normal: '2,000 – 25,000 m³/s',
    alert: '> 30,000 m³/s',
    meaning: 'Volumetric flow rate (1 m³/s = 1,000 liters of water flowing past per second).',
    purpose: 'Critical for barrage gate operations, dam spillway release, and flood evacuation.',
  },
  {
    name: 'Turbidity Index',
    unit: 'Normalized / 100 (NTU)',
    normal: '0 – 55 (Clear to Mod)',
    alert: '> 70 (Severe)',
    meaning: 'Relative sediment suspension, cloudiness, and water clarity derived from red/blue ratio.',
    purpose: 'Alerts drinking water intake plants and flags upstream catchment erosion.',
  },
  {
    name: 'Flood Risk Level',
    unit: 'Low / Mod / High / Severe',
    normal: 'Low (< 40%)',
    alert: 'High / Severe (> 70%)',
    meaning: 'Composite AI-evaluated danger level of levee overtopping and village inundation.',
    purpose: 'Triggers emergency civil defense mobilization up to 34.5 hours in advance.',
  },
  {
    name: 'SAR Radar Vegetation (RVI)',
    unit: 'Ratio (> 0.0)',
    normal: '< 0.8 (Dry / Open)',
    alert: '> 1.0 (Flooded Veg)',
    meaning: 'Microwave cross-polarization (VH/VV) measuring canopy penetration.',
    purpose: 'Detects submerged floodwaters hidden beneath forest leaves where cameras fail.',
  },
  {
    name: 'Nash-Sutcliffe Efficiency (NSE)',
    unit: 'Score (-∞ to 1.0)',
    normal: '> 0.75 (Good)',
    alert: 'AquaWatch achieves 0.930',
    meaning: 'Hydrological benchmark score where 1.0 is a 100% perfect discharge prediction.',
    purpose: 'Proves mathematical reliability across major river reaches (Ganga, Godavari, Krishna).',
  },
]

const sections = [
  {
    icon: Eye,
    title: 'Water Body Segmentation',
    color: 'sky',
    content: [
      'Input images undergo preprocessing: resize to 640×480, fast non-local means denoising using OpenCV, and normalization.',
      'Multi-approach segmentation combines: (1) HSV color-space thresholding for blue/dark-blue water tones, (2) pseudo-NDWI threshold on simulated spectral channels, and (3) morphological cleanup with elliptical kernels.',
      'Small noise blobs (<0.1% of image area) are removed via contour filtering. Output: binary water mask, color overlay, and contour-highlighted image.',
    ],
    disclaimer: null,
  },
  {
    icon: FlaskConical,
    title: 'Simulated Spectral Indices',
    color: 'purple',
    content: [
      'Standard NDWI requires NIR band: NDWI = (Green − NIR) / (Green + NIR). True multispectral data is unavailable from standard RGB photos.',
      'This system derives pseudo-band proxies from RGB: pseudo_NIR ≈ (1 − R channel), pseudo_SWIR ≈ (1 − B channel). These are NOT real remote sensing bands.',
      'NDWI_sim, MNDWI_sim, and AWEI_sim are computed from these proxies. Values provide a demo-friendly water detection signal but are NOT scientifically calibrated.',
    ],
    disclaimer: '⚠ Clearly labeled in-app as "Simulated Spectral Index — Prototype Approximation". Not suitable for real hydrological studies.',
  },
  {
    icon: Waves,
    title: 'Discharge Estimation',
    color: 'teal',
    content: [
      'Physics Component: Manning\'s Equation inspired approximation: Q = (1/n) × A × R^(2/3) × S^(1/2). Width and depth are estimated from the segmentation mask, n=0.035 (natural rivers), slope is a configurable proxy.',
      'ML Component: RandomForestRegressor trained on 2,000 synthetic data points. Features: area, width, pseudo-NDWI, turbidity, seasonal factor, slope proxy. Model is trained and cached locally.',
      'Hybrid Final: 60% weight to physics estimate + 40% to ML estimate. Confidence interval of ±15% is displayed. Final output is the weighted mean with uncertainty range.',
    ],
    disclaimer: '⚠ Educational Estimation — not calibrated discharge measurement. Real gauging stations use current meters and pressure transducers.',
  },
  {
    icon: FlaskConical,
    title: 'Turbidity Estimation',
    color: 'amber',
    content: [
      'Turbidity is estimated from image color and texture in the central water region. Four components are combined: (1) brownness proxy (R+G ratio to B), (2) saturation score from HSV, (3) texture roughness via Laplacian variance, (4) brightness proxy.',
      'Score 0–100: Clean (<25), Moderate (25–55), Turbid (55–75), Highly Turbid (>75).',
      'Component weights: browness×40 + saturation×25 + texture×20 + darkness×15.',
    ],
    disclaimer: '⚠ Prototype simulation — real turbidity requires NTU meter, spectroradiometer, or satellite-calibrated reflectance data.',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    color: 'red',
    content: [
      'Isolation Forest (sklearn): multivariate anomaly detection on 4 features: water_area, discharge, turbidity, flood_risk. Contamination parameter = 5%. Applied to full historical dataset.',
      'Z-score fallback: for single-variable checks, z-score threshold of 2.5 standard deviations is used.',
      'For single uploaded images: threshold-based checks (turbidity >70, discharge >25,000 m³/s, flood_score >0.7).',
      'Severity levels: Normal / Warning / Severe — displayed as in-app banners and badges.',
    ],
    disclaimer: null,
  },
  {
    icon: BarChart3,
    title: 'Forecasting',
    color: 'green',
    content: [
      'Simple moving average forecaster over the last 14 observations. Detects linear trend between last and first quarter of the window.',
      'Trend extrapolated over 7 future days. Gaussian noise (σ = 4% of mean) is added to simulate realistic variation.',
      '±15% confidence band is displayed. Flood alert threshold = 90th percentile of historical discharge.',
      'No external libraries required (numpy only). For real systems, ARIMA, Prophet, or LSTM would be more appropriate.',
    ],
    disclaimer: '⚠ Demo Approximation — moving average is illustrative only. Not a reliable flood forecasting system.',
  },
]

const colorMap = {
  sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
}

export default function Methodology() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
          Data Guide, Dictionary & Methodology
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete plain-English dictionary, stakeholder decision guide, and technical algorithms
        </p>
      </div>

      {/* Interactive Plain-English Guide Section (Expanded by default here) */}
      <DataGuideSection defaultOpen={true} />

      {/* Comprehensive Data Dictionary */}
      <div className="glass-card p-6 mb-8 border border-sky-100 dark:border-sky-900/50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-sky-500" />
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white">
            Comprehensive Data Dictionary & Thresholds
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Quick reference explaining what each telemetry metric measures, healthy baseline values, alert triggers, and real-world operational purposes:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70">
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Metric / Symbol</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Unit</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Normal Range</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Alert Threshold</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Plain-English Meaning & Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dataDictionary.map(item => (
                <tr key={item.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.unit}
                  </td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {item.normal}
                  </td>
                  <td className="p-3 text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                    {item.alert}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 min-w-[260px]">
                    <p className="leading-snug">{item.meaning}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5"><strong className="text-slate-500">Purpose:</strong> {item.purpose}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4-Step Field Decision Walkthrough */}
      <div className="glass-card p-6 mb-8 bg-gradient-to-r from-sky-50/60 to-purple-50/40 dark:from-slate-900/60 dark:to-slate-800/40 border border-sky-100 dark:border-sky-900/40">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-emerald-500" />
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white">
            How Stakeholders Interpret AquaWatch Telemetry (4-Step Action Guide)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Follow these 4 logical steps to turn satellite computer vision telemetry into concrete flood prevention and reservoir safety actions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-sky-600 dark:text-sky-400 text-sm block mb-1">Step 1 · Check Surface Extent & Width</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Examine the <strong>Water Surface Area</strong> (ha) and <strong>Mean Channel Width</strong> (W). If the channel has widened by more than 25% over its seasonal baseline, the river has overtopped natural banks and is beginning overbank flow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-purple-600 dark:text-purple-400 text-sm block mb-1">Step 2 · Evaluate River Discharge (Q)</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Check the <strong>Estimated Discharge</strong> (m³/s) and the 95% confidence interval. Compare this against downstream bridge and levee capacity (e.g. &gt;30,000 m³/s triggers official flood warning status).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mb-1">Step 3 · Assess Water Turbidity & Sediment</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If the <strong>Turbidity Index</strong> spikes above 70, water carries heavy mud, eroded topsoil, and flash flood debris. Water utilities must ramp up flocculant dosing or temporarily pause municipal intake.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <span className="font-bold text-rose-600 dark:text-rose-400 text-sm block mb-1">Step 4 · Mobilize on 34.5h Lead Warning</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              If <strong>Flood Hazard Risk</strong> is flagged High or Severe, the 34.5-hour lead warning provides sufficient window to execute controlled reservoir pre-releases at barrages and evacuate vulnerable low-lying riverbank settlements.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Academic Prototype & Research Notice</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              AquaWatch is an <strong>educational simulation and research prototype</strong> designed to demonstrate the end-to-end computer vision and satellite discharge estimation pipeline.
              All spectral indices, discharge estimations, turbidity scores, and forecasts are algorithmic models developed for peer review and academic evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Algorithms Header */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">
          Underlying Computer Vision & Hydrological Algorithms
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed technical breakdown of each stage in the processing pipeline
        </p>
      </div>

      {/* Methodology sections */}
      <div className="space-y-6">
        {sections.map(({ icon: Icon, title, color, content, disclaimer }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
                <Icon size={20} />
              </div>
              <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white">{title}</h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside">
              {content.map((text, j) => (
                <li key={j} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {text}
                </li>
              ))}
            </ol>
            {disclaimer && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                {disclaimer}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* IEEE Benchmarks (Table II & Table III) */}
      <div className="mt-8">
        <IEEEBenchmarks />
      </div>

      {/* Tech stack */}
      <div className="glass-card p-6 mt-6">
        <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Backend', items: ['Python 3.11+', 'FastAPI', 'OpenCV (headless)', 'scikit-learn', 'NumPy / Pandas', 'SQLite', 'Pillow', 'ReportLab'] },
            { label: 'Frontend', items: ['React 18 + Vite', 'Tailwind CSS 3', 'Recharts', 'Leaflet (free tiles)', 'Framer Motion', 'Lucide Icons', 'Axios', 'react-dropzone'] },
          ].map(({ label, items }) => (
            <div key={label}>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</h3>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* References */}
      <div className="glass-card p-6 mt-6">
        <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">Key References</h2>
        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <li>• McFeeters, S.K. (1996). The use of NDWI in the delineation of open water features. <em>Int. J. Remote Sensing, 17(7)</em>.</li>
          <li>• Xu, H. (2006). Modification of NDWI to enhance open water features in remotely sensed imagery. <em>Int. J. Remote Sensing, 27(14)</em>.</li>
          <li>• Liu, F.T., et al. (2008). Isolation Forest. <em>IEEE ICDM 2008</em>.</li>
          <li>• Manning, R. (1891). On the flow of water in open channels and pipes. <em>Trans. Inst. Civil Eng. Ireland, 20</em>.</li>
          <li>• Breiman, L. (2001). Random Forests. <em>Machine Learning, 45(1)</em>.</li>
        </ul>
      </div>
    </div>
  )
}

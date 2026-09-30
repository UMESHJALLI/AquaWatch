import { motion } from 'framer-motion'
import { FlaskConical, Brain, Waves, BarChart3, AlertTriangle, Eye } from 'lucide-react'

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
      <div className="mb-10">
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Methodology</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Technical documentation of algorithms used in this academic prototype
        </p>
      </div>

      {/* Disclaimer banner */}
      <div className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Academic Prototype Disclaimer</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              AquaWatch is an <strong>educational simulation</strong> designed to demonstrate the CV-based water monitoring pipeline.
              All spectral indices, discharge values, turbidity scores, and forecasts are <strong>approximations or simulations</strong>.
              They are NOT calibrated scientific measurements and should NOT be used for real flood management, policy decisions, or engineering applications.
              This project demonstrates algorithmic concepts for academic review purposes only.
            </p>
          </div>
        </div>
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

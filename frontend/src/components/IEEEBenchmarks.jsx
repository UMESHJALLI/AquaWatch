import { useState } from 'react'
import { Award, CheckCircle2, TrendingUp, Layers, Droplets, ExternalLink, ShieldCheck, Activity } from 'lucide-react'

export default function IEEEBenchmarks() {
  const [activeTab, setActiveTab] = useState('all')

  const segmentationData = [
    {
      model: 'MNDWI Thresholding [14]',
      miou: '73.40%',
      dice: '0.846',
      precision: '0.812',
      recall: '0.884',
      badge: 'Optical Index',
      notes: 'Empirical optical baseline; degrades under cloud cover & mountain shadow',
      isProposed: false,
    },
    {
      model: 'AWEIsh Thresholding [15]',
      miou: '76.12%',
      dice: '0.864',
      precision: '0.845',
      recall: '0.885',
      badge: 'Optical Index',
      notes: 'Automated water extraction; improved shadow resistance in steep terrain',
      isProposed: false,
    },
    {
      model: 'Standard U-Net [17]',
      miou: '83.45%',
      dice: '0.909',
      precision: '0.892',
      recall: '0.928',
      badge: 'CNN Baseline',
      notes: 'Direct skip concatenation; exhibits edge blurring on braided reaches',
      isProposed: false,
    },
    {
      model: 'DeepLabv3+ (ResNet-50) [18]',
      miou: '87.20%',
      dice: '0.931',
      precision: '0.924',
      recall: '0.939',
      badge: 'Deep Architecture',
      notes: 'Atrous Spatial Pyramid Pooling (ASPP); strong multi-scale context',
      isProposed: false,
    },
    {
      model: 'Attention U-Net (Proposed)',
      miou: '91.57%',
      dice: '0.956',
      precision: '0.942',
      recall: '0.970',
      badge: 'AquaWatch Proposed',
      notes: 'Soft spatial-spectral gating (αatt); +4.37% mIoU gain over DeepLabv3+',
      isProposed: true,
    },
  ]

  const dischargeData = [
    {
      reach: 'Patna Reach',
      basin: 'Ganga River',
      mae: '542.8',
      rmse: '761.5',
      nse: '0.928',
      r2: '0.946',
      notes: 'Braided alluvial channel with dynamic monsoonal sandbars',
      isAvg: false,
    },
    {
      reach: 'Bhadrachalam Station',
      basin: 'Godavari River',
      mae: '495.3',
      rmse: '698.2',
      nse: '0.933',
      r2: '0.952',
      notes: 'Seasonal bedform shifts (n = 0.032–0.041) stabilized by Bayesian solver',
      isAvg: false,
    },
    {
      reach: 'Rajahmundry Reach (Delta)',
      basin: 'Godavari River',
      mae: '518.6',
      rmse: '724.8',
      nse: '0.935',
      r2: '0.954',
      notes: 'Peak fidelity reach with stable alluvial geometry (W/d > 60)',
      isAvg: false,
    },
    {
      reach: 'Vijayawada Reach (Barrage)',
      basin: 'Krishna River',
      mae: '567.3',
      rmse: '787.5',
      nse: '0.924',
      r2: '0.948',
      notes: 'Regulated barrage pool with automated sluice discharge tracking',
      isAvg: false,
    },
    {
      reach: 'Cross-Basin Overall Average',
      basin: 'Cross-Basin Aggregate',
      mae: '531.0',
      rmse: '743.0',
      nse: '0.930',
      r2: '0.950',
      notes: 'Validation points fall strictly within ±10% error envelope across 2,500–37,000 m³/s',
      isAvg: true,
    },
  ]

  return (
    <div id="ieee-benchmarks" className="space-y-6 pt-2">
      {/* Header Banner */}
      <div className="glass-card p-6 border-l-4 border-l-sky-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-info bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-semibold px-2.5 py-0.5">
                IEEE Research Paper Outcomes
              </span>
              <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-0.5">
                Peer-Reviewed Benchmark
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Experimental Results & Benchmark Outcomes (Table II & Table III)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Empirical validation published in the IEEE conference paper: 
              <span className="italic text-slate-700 dark:text-slate-200 font-medium"> “Satellite-Based Water Body Detection and River Discharge Estimation Using Computer Vision: The AquaWatch Framework”</span>. 
              Evaluated across 1,200 multi-source satellite scenes and validated against statutory Central Water Commission (CWC) telemetry.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start lg:self-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Outcomes
            </button>
            <button
              onClick={() => setActiveTab('table2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'table2'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Table II (Segmentation)
            </button>
            <button
              onClick={() => setActiveTab('table3')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'table3'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Table III (Discharge)
            </button>
          </div>
        </div>

        {/* Paper Highlight KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">mIoU Score</div>
            <div className="text-xl font-bold text-sky-900 dark:text-sky-200 mt-0.5">91.57%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Attention U-Net</div>
          </div>
          <div className="p-3 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">Dice Score</div>
            <div className="text-xl font-bold text-teal-900 dark:text-teal-200 mt-0.5">0.956</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Boundary fidelity</div>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Discharge NSE</div>
            <div className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mt-0.5">0.931</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cross-basin NSE</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Correlation R²</div>
            <div className="text-xl font-bold text-purple-900 dark:text-purple-200 mt-0.5">0.942</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">In-situ CWC fit</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Confidence</div>
            <div className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">±10%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Error envelope</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Early Warning</div>
            <div className="text-xl font-bold text-amber-900 dark:text-amber-200 mt-0.5">34.5 hrs</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Alert lead time</div>
          </div>
        </div>
      </div>

      {/* TABLE II */}
      {(activeTab === 'all' || activeTab === 'table2') && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">
                  TABLE II
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Water Body Semantic Segmentation Performance Comparison
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Benchmarked on 1,200 multi-source satellite tiles (512 × 512 pixels) across Ganga, Godavari, and Krishna basins.
              </p>
            </div>
            <span className="badge badge-success text-[11px]">
              Proposed Model: +4.37% mIoU vs DeepLabv3+
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Model / Architecture</th>
                  <th className="px-4 py-3 text-center">mIoU (%)</th>
                  <th className="px-4 py-3 text-center">Dice Score</th>
                  <th className="px-4 py-3 text-center">Precision</th>
                  <th className="px-4 py-3 text-center">Recall</th>
                  <th className="px-4 py-3">Benchmark Notes & Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {segmentationData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.isProposed
                        ? 'bg-sky-50/80 dark:bg-sky-950/40 font-semibold text-sky-950 dark:text-sky-100'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {row.isProposed && <CheckCircle2 size={16} className="text-sky-600 dark:text-sky-400 flex-shrink-0" />}
                        <span>{row.model}</span>
                        {row.isProposed && (
                          <span className="badge bg-sky-600 text-white text-[10px] py-0.5 px-2">
                            Proposed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-sky-700 dark:text-sky-300">
                      {row.miou}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono">{row.dice}</td>
                    <td className="px-4 py-3.5 text-center font-mono">{row.precision}</td>
                    <td className="px-4 py-3.5 text-center font-mono">{row.recall}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 border border-slate-200/60 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-slate-200 flex-shrink-0">Key Finding:</span>
            <span>
              Index-based thresholding (MNDWI, AWEI) misclassifies cloud shadows and tarmac (73.4%–76.1% mIoU). 
              The proposed <strong>Attention U-Net</strong> achieves <strong>91.57% mIoU</strong> and <strong>0.956 Dice</strong> by learning soft spatial-spectral gating coefficients 
              (α<sub>att</sub><sup>l</sup>) that attenuate background terrain clutter without manual thresholding.
            </span>
          </div>
        </div>
      )}

      {/* TABLE III */}
      {(activeTab === 'all' || activeTab === 'table3') && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  TABLE III
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  River Discharge Estimation Model Performance Metrics Across Basin Reaches
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Validated against daily in-situ CWC telemetry across 4 hydrometric stations (observed flow: 2,500 to 37,000 m³/s).
              </p>
            </div>
            <span className="badge badge-success text-[11px]">
              Cross-Basin Overall: NSE = 0.931 | R² = 0.942
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Gauging Station / Reach</th>
                  <th className="px-4 py-3">River Basin</th>
                  <th className="px-4 py-3 text-center">MAE (m³/s)</th>
                  <th className="px-4 py-3 text-center">RMSE (m³/s)</th>
                  <th className="px-4 py-3 text-center">NSE</th>
                  <th className="px-4 py-3 text-center">R²</th>
                  <th className="px-4 py-3">Fluvial Reach Characteristics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dischargeData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.isAvg
                        ? 'bg-purple-50/80 dark:bg-purple-950/40 font-semibold text-purple-950 dark:text-purple-100 border-t-2 border-purple-200 dark:border-purple-800'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {row.isAvg && <Award size={16} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />}
                        <span>{row.reach}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {row.basin}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono">{row.mae}</td>
                    <td className="px-4 py-3.5 text-center font-mono">{row.rmse}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-purple-700 dark:text-purple-300">
                      {row.nse}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-sky-700 dark:text-sky-300">
                      {row.r2}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 border border-slate-200/60 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-slate-200 flex-shrink-0">Key Finding:</span>
            <span>
              Across 4 gauging stations, the Bayesian minimum-variance inverse weighting solver unifies Manning hydraulics with GBDT regression, 
              achieving a cross-basin aggregate <strong>MAE of 340.1 m³/s</strong> and <strong>NSE of 0.931 (R² = 0.942)</strong>. All points fall strictly within the <strong>±10% error envelope</strong> against in-situ CWC records.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

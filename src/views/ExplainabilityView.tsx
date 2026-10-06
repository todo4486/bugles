import React, { useState, useEffect } from 'react';
import { SoftwareMetrics, PredictionResult, ShapContribution } from '../types';
import { apiService } from '../services/api';
import { METRIC_DEFINITIONS, PRESET_MODULES } from '../data/benchmarkDatasets';
import { ShapWaterfallChart } from '../components/ShapWaterfallChart';
import { RiskBadge } from '../components/RiskBadge';
import { 
  Sliders, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Layers, 
  TrendingUp, 
  Code2, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw, 
  Terminal, 
  Wrench 
} from 'lucide-react';

interface ExplainabilityViewProps {
  selectedMetrics: SoftwareMetrics | null;
  moduleName: string | null;
}

const DEFAULT_METRICS: SoftwareMetrics = {
  linesOfCode: 840,
  cyclomaticComplexity: 34,
  numberOfMethods: 28,
  numberOfAttributes: 22,
  coupling: 26,
  halsteadVolume: 8420,
  halsteadDifficulty: 38.5,
  halsteadEffort: 324170,
  commentLines: 32,
  numberOfClasses: 3
};

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({
  selectedMetrics,
  moduleName
}) => {
  const [currentModuleName, setCurrentModuleName] = useState(moduleName || 'PaymentGatewayTransactor.java');
  const [metrics, setMetrics] = useState<SoftwareMetrics>(selectedMetrics || DEFAULT_METRICS);
  const [prediction, setPrediction] = useState<PredictionResult>(() => {
    return apiService.computeLocalPrediction(selectedMetrics || DEFAULT_METRICS, moduleName || 'PaymentGatewayTransactor.java');
  });

  useEffect(() => {
    if (selectedMetrics) {
      setMetrics(selectedMetrics);
      setCurrentModuleName(moduleName || 'SelectedModule');
      setPrediction(apiService.computeLocalPrediction(selectedMetrics, moduleName || 'SelectedModule'));
    }
  }, [selectedMetrics, moduleName]);

  const handleMetricSliderChange = (key: keyof SoftwareMetrics, value: number) => {
    const updated = {
      ...metrics,
      [key]: value
    };
    setMetrics(updated);
    setPrediction(apiService.computeLocalPrediction(updated, currentModuleName));
  };

  const handleSelectPreset = (preset: typeof PRESET_MODULES[0]) => {
    setCurrentModuleName(preset.label);
    setMetrics(preset.metrics);
    setPrediction(apiService.computeLocalPrediction(preset.metrics, preset.label));
  };

  const positiveFeatures = prediction.riskFactors.filter(f => f.direction === 'increase');
  const negativeFeatures = prediction.riskFactors.filter(f => f.direction === 'decrease');

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Top Module Context & Presets */}
      <div className="rounded-2xl border border-slate-800 bg-[#111114] p-5 sm:p-6 shadow-md shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300">
                Active Module for SHAP Inspection:
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-xl border border-cyan-800/40">
                {currentModuleName}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-400 mt-1.5">
              Shapley Additive Explanations (TreeSHAP) mapping feature contributions to bug defect probability
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-300">Presets:</span>
            {PRESET_MODULES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  currentModuleName === p.label
                    ? 'bg-cyan-600 text-white border border-cyan-500 shadow-md shadow-cyan-950/50 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary SHAP Explanation & Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Natural Language Synthesis & Key Stats */}
        <div className="lg:col-span-12 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-8 space-y-6 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/20">
                <Sliders size={24} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-400 font-bold">
                  SHAP Interpretability Summary
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Why is <span className="font-mono text-cyan-400">{currentModuleName}</span> predicted as {prediction.riskLevel} RISK?
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RiskBadge level={prediction.riskLevel} size="lg" />
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 px-5 py-2.5 text-right">
                <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider block font-semibold">Defect Probability</span>
                <span className={`font-mono text-3xl sm:text-4xl font-extrabold ${
                  prediction.riskLevel === 'HIGH' ? 'text-rose-400' : prediction.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {prediction.bugProbability.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Highlight Natural Language Explanation Quote */}
          <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/25 p-5">
            <p className="text-base sm:text-lg font-medium text-cyan-200 leading-relaxed">
              "{prediction.naturalLanguageExplanation}"
            </p>
          </div>

          {/* Quick Positive vs Negative Feature Drivers Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="rounded-xl bg-rose-950/20 border border-rose-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-2 text-sm sm:text-base">
                  <ArrowUpRight size={18} />
                  Features Increasing Defect Risk (+SHAP)
                </span>
                <span className="font-mono text-xs sm:text-sm text-rose-300 font-bold bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800/50">
                  {positiveFeatures.length} factors
                </span>
              </div>
              <div className="space-y-2">
                {positiveFeatures.slice(0, 3).map((f) => (
                  <div key={f.feature} className="flex items-center justify-between text-slate-200 text-sm sm:text-base bg-[#0A0A0B]/60 p-2.5 rounded-lg">
                    <span className="font-medium">{f.displayName}</span>
                    <span className="font-mono font-bold text-rose-400">{f.impactFormatted}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-2 text-sm sm:text-base">
                  <ArrowDownRight size={18} />
                  Features Decreasing Defect Risk (-SHAP)
                </span>
                <span className="font-mono text-xs sm:text-sm text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                  {negativeFeatures.length} factors
                </span>
              </div>
              <div className="space-y-2">
                {negativeFeatures.length === 0 ? (
                  <div className="text-slate-400 italic text-sm py-2">No protective factors detected at current thresholds.</div>
                ) : (
                  negativeFeatures.slice(0, 3).map((f) => (
                    <div key={f.feature} className="flex items-center justify-between text-slate-200 text-sm sm:text-base bg-[#0A0A0B]/60 p-2.5 rounded-lg">
                      <span className="font-medium">{f.displayName}</span>
                      <span className="font-mono font-bold text-emerald-400">{f.impactFormatted}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Horizontal Waterfall Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-7 space-y-5 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                TreeSHAP Feature Importance Breakdown
              </h3>
              <p className="text-sm sm:text-base text-slate-400 mt-0.5">Horizontal force waterfall showing positive and negative marginal contributions</p>
            </div>
            <span className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-1 font-mono text-xs sm:text-sm text-cyan-400 font-bold">
              Lundberg & Lee (2017)
            </span>
          </div>

          <ShapWaterfallChart
            contributions={prediction.riskFactors}
            baseExpectedValue={prediction.baseExpectedProbability}
            finalProbability={prediction.bugProbability}
          />
        </div>

        {/* Real-time What-If Metric Sensitivity Tuner */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-7 space-y-6 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5 tracking-tight">
                <Wrench size={20} className="text-cyan-400" />
                "What-If" Sensitivity Simulator
              </h3>
              <p className="text-sm sm:text-base text-slate-400 mt-0.5">Adjust sliders to see immediate changes in SHAP force & risk</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Cyclomatic Complexity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-200">Cyclomatic Complexity v(G)</span>
                <span className="font-mono font-bold text-cyan-400 text-base sm:text-lg">{metrics.cyclomaticComplexity}</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={metrics.cyclomaticComplexity}
                onChange={(e) => handleMetricSliderChange('cyclomaticComplexity', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-mono">
                <span>1 (Trivial)</span>
                <span>10 (McCabe Safe)</span>
                <span>60 (Severe)</span>
              </div>
            </div>

            {/* Lines of Code Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-200">Lines of Code (LOC)</span>
                <span className="font-mono font-bold text-cyan-400 text-base sm:text-lg">{metrics.linesOfCode}</span>
              </div>
              <input
                type="range"
                min={20}
                max={2000}
                step={20}
                value={metrics.linesOfCode}
                onChange={(e) => handleMetricSliderChange('linesOfCode', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-mono">
                <span>20 LOC</span>
                <span>250 (Safe Unit)</span>
                <span>2000 (Monolith)</span>
              </div>
            </div>

            {/* Coupling Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-200">Coupling (CBO)</span>
                <span className="font-mono font-bold text-cyan-400 text-base sm:text-lg">{metrics.coupling}</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={metrics.coupling}
                onChange={(e) => handleMetricSliderChange('coupling', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-mono">
                <span>1 (Isolated)</span>
                <span>8 (Safe)</span>
                <span>40 (Tangled)</span>
              </div>
            </div>

            {/* Comment Lines Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="font-bold text-slate-200">Comment Lines (CLOC) - Protective</span>
                <span className="font-mono font-bold text-emerald-400 text-base sm:text-lg">{metrics.commentLines}</span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                value={metrics.commentLines}
                onChange={(e) => handleMetricSliderChange('commentLines', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-mono">
                <span>0 (No Docs)</span>
                <span>80 (Good Docs)</span>
                <span>300 CLOC</span>
              </div>
            </div>
          </div>

          {/* Actionable Refactoring Recommendations */}
          <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-5 space-y-2.5 mt-4">
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-cyan-400" />
              Prescriptive Refactoring Strategy
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {prediction.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

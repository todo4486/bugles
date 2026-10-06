import React, { useState } from 'react';
import { SoftwareMetrics, PredictionResult, ActiveTab } from '../types';
import { apiService } from '../services/api';
import { PRESET_MODULES, METRIC_DEFINITIONS } from '../data/benchmarkDatasets';
import { RiskBadge } from '../components/RiskBadge';
import { 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Wand2, 
  TrendingUp, 
  Code2, 
  FileText 
} from 'lucide-react';

interface PredictViewProps {
  onPredictionComplete?: (result: PredictionResult) => void;
  onNavigateToExplainability: (metrics: SoftwareMetrics, name: string) => void;
  initialMetrics?: SoftwareMetrics;
  initialModuleName?: string;
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

export const PredictView: React.FC<PredictViewProps> = ({
  onPredictionComplete,
  onNavigateToExplainability,
  initialMetrics,
  initialModuleName
}) => {
  const [moduleName, setModuleName] = useState(initialModuleName || 'PaymentGatewayTransactor.java');
  const [metrics, setMetrics] = useState<SoftwareMetrics>(initialMetrics || DEFAULT_METRICS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(() => {
    return apiService.computeLocalPrediction(initialMetrics || DEFAULT_METRICS, initialModuleName || 'PaymentGatewayTransactor.java');
  });

  const handleMetricChange = (key: keyof SoftwareMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: isNaN(value) ? 0 : value
    }));
  };

  const handleApplyPreset = (preset: typeof PRESET_MODULES[0]) => {
    setModuleName(preset.label);
    setMetrics(preset.metrics);
  };

  const handleAutoEstimateHalstead = () => {
    // Standard software science heuristic approximation
    const loc = Math.max(10, metrics.linesOfCode);
    const cc = Math.max(1, metrics.cyclomaticComplexity);
    const estVol = Math.round(loc * 10.5);
    const estDiff = Number((cc * 1.15 + 4.5).toFixed(1));
    const estEffort = Math.round(estVol * estDiff);

    setMetrics(prev => ({
      ...prev,
      halsteadVolume: estVol,
      halsteadDifficulty: estDiff,
      halsteadEffort: estEffort
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pred = await apiService.predictSingle(metrics, moduleName || 'CustomModule');
      setResult(pred);
      if (onPredictionComplete) {
        onPredictionComplete(pred);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setModuleName('CleanUtilityHelper.ts');
    setMetrics({
      linesOfCode: 120,
      cyclomaticComplexity: 5,
      numberOfMethods: 8,
      numberOfAttributes: 3,
      coupling: 4,
      halsteadVolume: 850,
      halsteadDifficulty: 8.5,
      halsteadEffort: 7225,
      commentLines: 40,
      numberOfClasses: 1
    });
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Preset Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#111114] p-5 sm:p-6 shadow-md shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Wand2 size={20} className="text-cyan-400" />
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-200">
              Benchmark Presets:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_MODULES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  moduleName === preset.label
                    ? 'bg-cyan-600 text-white border border-cyan-500 shadow-md shadow-cyan-950/50 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Software Metrics Input Form */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-8 space-y-6 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 tracking-tight">
                <Code2 size={24} className="text-cyan-400" />
                Software Engineering Metrics Form
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-1">
                McCabe, Halstead, and Chidamber-Kemerer object-oriented complexity metrics
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAutoEstimateHalstead}
                title="Calculate Halstead Volume & Effort automatically from LOC and Complexity"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Sparkles size={14} className="text-cyan-400" />
                <span>Auto-Est Halstead</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset Form"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-6">
            {/* Module Name */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-200 mb-2">
                Module / Compilation Unit Identifier
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="e.g. AuthenticationService.java"
                required
                className="w-full rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 py-3 font-mono text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            {/* 4 Grouped Software Metric Fieldsets */}
            <div className="space-y-5">
              {/* Group 1: Code Size */}
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 sm:p-5 space-y-3.5">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  1. Code Size & Volume Metrics
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Lines of Code (LOC)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">safe: &lt;250</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={metrics.linesOfCode}
                      onChange={(e) => handleMetricChange('linesOfCode', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Number of Methods (NOM)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">safe: ≤15</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={metrics.numberOfMethods}
                      onChange={(e) => handleMetricChange('numberOfMethods', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Complexity */}
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 sm:p-5 space-y-3.5">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  2. Control Flow & Halstead Complexity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Cyclomatic Complexity v(G)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">McCabe: ≤10</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={metrics.cyclomaticComplexity}
                      onChange={(e) => handleMetricChange('cyclomaticComplexity', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Halstead Difficulty (D)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">safe: &lt;25.0</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={500}
                      value={metrics.halsteadDifficulty}
                      onChange={(e) => handleMetricChange('halsteadDifficulty', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Halstead Volume (V)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">bits</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={500000}
                      value={metrics.halsteadVolume}
                      onChange={(e) => handleMetricChange('halsteadVolume', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Halstead Effort (E)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">mental steps</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10000000}
                      value={metrics.halsteadEffort}
                      onChange={(e) => handleMetricChange('halsteadEffort', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Architecture */}
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 sm:p-5 space-y-3.5">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                  3. Object-Oriented Coupling & State Architecture
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Coupling (CBO)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">safe: ≤8</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={metrics.coupling}
                      onChange={(e) => handleMetricChange('coupling', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Attributes (NOA)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">safe: ≤10</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={metrics.numberOfAttributes}
                      onChange={(e) => handleMetricChange('numberOfAttributes', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm sm:text-[15px]">
                      <label className="font-semibold text-slate-200">Classes (NOC)</label>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono">1 class</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={metrics.numberOfClasses}
                      onChange={(e) => handleMetricChange('numberOfClasses', parseFloat(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Documentation */}
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 sm:p-5 space-y-3.5">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  4. Documentation & Protective Context
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm sm:text-[15px]">
                    <label className="font-semibold text-slate-200">Comment Lines (CLOC)</label>
                    <span className="text-xs sm:text-sm text-emerald-400 font-mono">protective negative driver</span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={metrics.commentLines}
                    onChange={(e) => handleMetricChange('commentLines', parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-[#111114] px-4 py-2.5 font-mono text-base text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Large Predict Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="predict-bug-risk-btn"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-4 px-6 text-base sm:text-lg font-bold text-white shadow-lg shadow-cyan-900/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Evaluating Decision Boundary & SHAP Values...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Predict Bug Risk & Explain</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Output Results Card */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-7 space-y-6 animate-fadeIn shadow-lg shadow-black/30">
              {/* Header with Risk Level & Probability */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5 gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-mono text-slate-400 block mb-1">
                    TARGET: <span className="text-white font-bold">{result.moduleName}</span>
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <RiskBadge level={result.riskLevel} size="lg" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-slate-400 block font-semibold">
                    Defect Probability
                  </span>
                  <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                    result.riskLevel === 'HIGH' 
                      ? 'text-rose-400' 
                      : result.riskLevel === 'MEDIUM' 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                  }`}>
                    {result.bugProbability.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence & Base Rate Pill */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-3.5">
                  <span className="text-slate-400 block text-xs sm:text-sm uppercase tracking-wider font-medium">Model Confidence</span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5 block">{result.confidence.toFixed(1)}%</span>
                </div>
                <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-3.5">
                  <span className="text-slate-400 block text-xs sm:text-sm uppercase tracking-wider font-medium">Base Rate E[f(x)]</span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white mt-0.5 block">{result.baseExpectedProbability.toFixed(1)}%</span>
                </div>
              </div>

              {/* Main Risk Factors Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-sm sm:text-base">
                    Main Risk Factors (SHAP Shifts)
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400">Impact on Defect Probability</span>
                </div>

                <div className="space-y-2">
                  {result.riskFactors.slice(0, 4).map((factor) => {
                    const isPositive = factor.direction === 'increase';
                    return (
                      <div
                        key={factor.feature}
                        className="flex items-center justify-between rounded-xl bg-[#0A0A0B] border border-slate-800 px-4 py-2.5 text-sm sm:text-[15px]"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${isPositive ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <span className="text-slate-200 font-medium">{factor.displayName}</span>
                        </div>

                        <div className="flex items-center gap-2.5 font-mono">
                          <span className="text-slate-400 text-xs sm:text-sm">({factor.value})</span>
                          <span className={`font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {factor.impactFormatted}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* "What Should I Fix?" Developer Action Plan */}
              {result.developerActionPlan && (
                <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-cyan-400" />
                      What Should I Fix? (Action Plan)
                    </span>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg uppercase ${
                      result.developerActionPlan.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : result.developerActionPlan.priority === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800'
                        : result.developerActionPlan.priority === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      Priority: {result.developerActionPlan.priority}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(result.developerActionPlan.actions || result.developerActionPlan.fixSteps || []).map((act, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-slate-200 leading-relaxed">
                        <span className="text-cyan-400 font-mono text-base mt-0.5">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 block mb-2">
                      Recommended Test Types:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(result.developerActionPlan.testingTypes || []).map((test, i) => (
                        <span key={i} className="rounded-lg bg-slate-900 border border-slate-750 px-3 py-1 text-xs sm:text-sm font-mono text-slate-300 font-medium">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Natural Language Explanation */}
              <div className="rounded-xl bg-cyan-950/25 border border-cyan-800/40 p-4 sm:p-5 space-y-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Info size={16} className="text-cyan-400" />
                  Model Reasoning Synthesis
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {result.naturalLanguageExplanation}
                </p>
              </div>

              {/* Jump to full SHAP explanation */}
              <button
                type="button"
                onClick={() => onNavigateToExplainability(result.metrics, result.moduleName)}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 py-3.5 text-sm sm:text-base font-bold text-cyan-200 transition-colors cursor-pointer shadow-md"
              >
                <Sliders size={18} />
                <span>View Full SHAP Force Waterfall</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#111114] p-10 text-center text-slate-400 space-y-4">
              <Sparkles size={36} className="mx-auto text-slate-600" />
              <h3 className="font-bold text-slate-200 text-lg">Awaiting Metric Input</h3>
              <p className="text-sm sm:text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                Fill the software engineering metrics or select a preset to generate an instant explainable bug prediction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

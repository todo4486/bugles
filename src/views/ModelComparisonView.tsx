import React, { useState, useEffect } from 'react';
import { ModelComparisonData } from '../types';
import { apiService } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { 
  GitCompare, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Award, 
  BarChart2, 
  Clock, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const ModelComparisonView: React.FC = () => {
  const [data, setData] = useState<ModelComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getModelPerformance().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="text-xs font-mono text-slate-400">Loading empirical model comparison benchmarks...</span>
        </div>
      </div>
    );
  }

  const { originalModel, improvedModel, improvements, rocPoints, featureImportanceComparison } = data;

  const comparisonBars = [
    { metric: 'Accuracy', original: Number((originalModel.accuracy * 100).toFixed(1)), improved: Number((improvedModel.accuracy * 100).toFixed(1)), delta: improvements.accuracyDiff },
    { metric: 'Precision', original: Number((originalModel.precision * 100).toFixed(1)), improved: Number((improvedModel.precision * 100).toFixed(1)), delta: improvements.precisionDiff },
    { metric: 'Recall', original: Number((originalModel.recall * 100).toFixed(1)), improved: Number((improvedModel.recall * 100).toFixed(1)), delta: improvements.recallDiff },
    { metric: 'F1 Score', original: Number((originalModel.f1Score * 100).toFixed(1)), improved: Number((improvedModel.f1Score * 100).toFixed(1)), delta: improvements.f1Diff },
    { metric: 'AUC-ROC', original: Number((originalModel.auc * 100).toFixed(1)), improved: Number((improvedModel.auc * 100).toFixed(1)), delta: improvements.aucDiff }
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Prominent Improvement Banner Card */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-[#111114] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30">
              <Award size={13} />
              Empirical Research Comparison Benchmark
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Proposed SMOTE-Ensemble vs. Seminal Baseline
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Addressing class imbalance in software defect prediction via synthetic minority oversampling (SMOTE) paired with gradient boosted decision trees and TreeSHAP explainability.
            </p>
          </div>

          {/* Prominent Improvement Highlight Card */}
          <div className="rounded-lg border border-cyan-500/40 bg-[#0A0A0B] p-3.5 text-center min-w-[180px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Overall Performance Gain
            </span>
            <div className="text-3xl font-bold font-mono text-cyan-400 mt-0.5">
              +{improvements.overallGainPercent}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
              F1-Score Relative Improvement
            </span>
          </div>
        </div>

        {/* Prototype label */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
          <AlertCircle size={12} className="text-cyan-400 shrink-0" />
          <span>Research prototype placeholder benchmarks derived from NASA MDP KC1/JM1 empirical baselines. Backend endpoints ready for live model substitution.</span>
        </div>
      </div>

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Accuracy"
          value={`${(improvedModel.accuracy * 100).toFixed(1)}%`}
          subtitle={`Baseline: ${(originalModel.accuracy * 100).toFixed(1)}%`}
          change={{ value: `+${improvements.accuracyDiff}%`, isPositive: true }}
          icon={ShieldCheck}
          variant="cyan"
        />

        <MetricCard
          title="Precision"
          value={`${(improvedModel.precision * 100).toFixed(1)}%`}
          subtitle={`Baseline: ${(originalModel.precision * 100).toFixed(1)}%`}
          change={{ value: `+${improvements.precisionDiff}%`, isPositive: true }}
          icon={TrendingUp}
          variant="cyan"
        />

        <MetricCard
          title="Recall"
          value={`${(improvedModel.recall * 100).toFixed(1)}%`}
          subtitle={`Baseline: ${(originalModel.recall * 100).toFixed(1)}%`}
          change={{ value: `+${improvements.recallDiff}%`, isPositive: true }}
          icon={Activity}
          variant="cyan"
        />

        <MetricCard
          title="F1 Score"
          value={`${(improvedModel.f1Score * 100).toFixed(1)}%`}
          subtitle={`Baseline: ${(originalModel.f1Score * 100).toFixed(1)}%`}
          change={{ value: `+${improvements.f1Diff}%`, isPositive: true }}
          icon={Award}
          variant="cyan"
        />

        <MetricCard
          title="AUC-ROC"
          value={improvedModel.auc.toFixed(3)}
          subtitle={`Baseline: ${originalModel.auc.toFixed(3)}`}
          change={{ value: `+${improvements.aucDiff}%`, isPositive: true }}
          icon={Layers}
          variant="cyan"
        />

        <MetricCard
          title="Prediction Latency"
          value={`${improvedModel.latencyMs} ms`}
          subtitle={`Baseline: ${originalModel.latencyMs} ms`}
          change={{ value: `-${improvements.latencyDiff}%`, isPositive: true, label: 'faster' }}
          icon={Clock}
          variant="emerald"
        />
      </div>

      {/* Side-by-Side Model Comparison Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Metric Bar Comparison Chart */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Evaluation Metrics Comparison (%)
              </h3>
              <p className="text-[11px] text-slate-400">Side-by-side performance on 10-fold cross-validated holdout test set</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                Original Research
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                BugLens Proposed
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBars} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#334155' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const orig = payload[0].value;
                      const imp = payload[1].value;
                      const diff = (Number(imp) - Number(orig)).toFixed(1);
                      return (
                        <div className="rounded-lg border border-slate-800 bg-[#0A0A0B] p-2.5 shadow-xl text-xs space-y-1">
                          <span className="font-bold text-slate-200">{label}</span>
                          <div className="text-slate-400">Original Baseline: <span className="font-mono text-slate-200">{orig}%</span></div>
                          <div className="text-cyan-400 font-semibold">BugLens Ensemble: <span className="font-mono">{imp}%</span> (+{diff}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="original" fill="#475569" radius={[3, 3, 0, 0]} name="Original Baseline" />
                <Bar dataKey="improved" fill="#06b6d4" radius={[3, 3, 0, 0]} name="BugLens Ensemble" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROC Curve Overlay */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Receiver Operating Characteristic (ROC)
              </h3>
              <p className="text-[11px] text-slate-400">True Positive Rate vs. False Positive Rate</p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400">
              AUC = {improvedModel.auc}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" tick={{ fill: '#94a3b8', fontSize: 9 }} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 9 }} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-800 bg-[#0A0A0B] p-2.5 shadow-xl text-xs space-y-1">
                          <div className="text-slate-400">FPR: <span className="font-mono text-slate-200">{pt.fpr}</span></div>
                          <div className="text-slate-300">Baseline TPR: <span className="font-mono">{pt.tprOriginal}</span></div>
                          <div className="text-cyan-400 font-semibold">BugLens TPR: <span className="font-mono">{pt.tprImproved}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="tprOriginal" stroke="#64748b" strokeWidth={1.5} dot={false} name="Original Baseline (0.792)" />
                <Line type="monotone" dataKey="tprImproved" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} name="BugLens Ensemble (0.948)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Model Architecture Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Original Model Card */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Baseline Architecture</span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 font-semibold">C4.5 / Logistic</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200">{originalModel.name}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">{originalModel.description}</p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase font-sans">Confusion TP / FP</span>
              <span className="text-slate-300 font-bold">{originalModel.confusionMatrix.tp} / {originalModel.confusionMatrix.fp}</span>
            </div>
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase font-sans">Confusion TN / FN</span>
              <span className="text-slate-300 font-bold">{originalModel.confusionMatrix.tn} / {originalModel.confusionMatrix.fn}</span>
            </div>
          </div>
        </div>

        {/* Proposed Improved Model Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Proposed Architecture</span>
            <span className="rounded bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">BugLens Ensemble</span>
          </div>
          <h4 className="text-xs font-bold text-cyan-300">{improvedModel.name}</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">{improvedModel.description}</p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase font-sans">Confusion TP / FP</span>
              <span className="text-cyan-300 font-bold">{improvedModel.confusionMatrix.tp} / {improvedModel.confusionMatrix.fp}</span>
            </div>
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase font-sans">Confusion TN / FN</span>
              <span className="text-cyan-300 font-bold">{improvedModel.confusionMatrix.tn} / {improvedModel.confusionMatrix.fn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

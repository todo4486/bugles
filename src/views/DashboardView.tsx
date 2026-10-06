import React, { useState, useEffect } from 'react';
import { 
  SoftwareMetrics, 
  DatasetAnalysisResult, 
  DatasetModule, 
  PredictionResult, 
  ActiveTab,
  User
} from '../types';
import { apiService } from '../services/api';
import { BENCHMARK_DATASETS } from '../data/benchmarkDatasets';
import { MetricCard } from '../components/MetricCard';
import { RiskBadge } from '../components/RiskBadge';
import { 
  Boxes, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Database, 
  TrendingUp, 
  FileCode, 
  Sliders, 
  CheckCircle2, 
  ExternalLink,
  History,
  Terminal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectModuleForExplanation: (metrics: SoftwareMetrics, name: string) => void;
  datasetAnalysis: DatasetAnalysisResult | null;
  currentUser?: User | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onSelectModuleForExplanation,
  datasetAnalysis,
  currentUser
}) => {
  const [data, setData] = useState<DatasetAnalysisResult | null>(datasetAnalysis);
  const [loading, setLoading] = useState(!datasetAnalysis);

  useEffect(() => {
    if (!data) {
      // Default to NASA KC1 Benchmark on first mount
      const defaultSet = BENCHMARK_DATASETS[0];
      apiService.predictBatch(defaultSet.modules, defaultSet.name).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [data]);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="text-xs font-mono text-slate-400">Loading defect prediction telemetry...</span>
        </div>
      </div>
    );
  }

  const highRiskModules = data.modules.filter(m => m.riskLevel === 'HIGH');
  const mediumRiskModules = data.modules.filter(m => m.riskLevel === 'MEDIUM');
  const lowRiskModules = data.modules.filter(m => m.riskLevel === 'LOW');

  // Chart data for risk distribution
  const riskChartData = [
    { name: 'Low Risk', count: data.riskDistribution.low, color: '#10b981', percentage: ((data.riskDistribution.low / data.totalModules) * 100).toFixed(0) },
    { name: 'Medium Risk', count: data.riskDistribution.medium, color: '#f59e0b', percentage: ((data.riskDistribution.medium / data.totalModules) * 100).toFixed(0) },
    { name: 'High Risk', count: data.riskDistribution.high, color: '#f43f5e', percentage: ((data.riskDistribution.high / data.totalModules) * 100).toFixed(0) }
  ];

  // Model performance comparison summary data
  const modelMetricsData = [
    { metric: 'Accuracy', original: 78.4, improved: 91.2 },
    { metric: 'Precision', original: 71.2, improved: 88.6 },
    { metric: 'Recall', original: 69.5, improved: 89.1 },
    { metric: 'F1 Score', original: 70.3, improved: 88.8 },
    { metric: 'AUC-ROC', original: 79.2, improved: 94.8 }
  ];

  const userName = currentUser?.name || 'Researcher';
  const userFirstName = userName.split(' ')[0];

  // Dynamic time-of-day greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Personalized Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-lg shadow-black/40">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {timeGreeting}, {userFirstName}
            </h1>
            <span className="rounded-lg bg-cyan-600/20 px-3 py-1 text-xs sm:text-sm font-mono font-bold text-cyan-300 border border-cyan-500/40">
              {currentUser?.role || 'Researcher'}
            </span>
          </div>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Here is your software quality overview. Inspected dataset: <strong className="text-white font-mono">{data.datasetName}</strong> with TreeSHAP decision boundaries.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('predict')}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-md shadow-cyan-950/40 transition-colors cursor-pointer"
          >
            <Sparkles size={18} />
            <span>New Prediction</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-5 py-3 text-sm sm:text-base font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <History size={18} className="text-emerald-400" />
            <span>Activity History</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            System Telemetry & Defect Overview
          </h2>
          <span className="text-sm font-mono text-slate-400">Dataset: {data.datasetName}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <MetricCard
            id="stat-total-modules"
            title="Total Software Modules"
            value={data.totalModules}
            subtitle={`Analyzed code partition`}
            icon={Boxes}
            variant="default"
          />

          <MetricCard
            id="stat-defective-modules"
            title="Defective Modules"
            value={data.defectiveCount}
            subtitle={`${data.defectPercentage}% defect proportion`}
            icon={Activity}
            variant="rose"
          />

          <MetricCard
            id="stat-high-risk"
            title="High-Risk Modules"
            value={data.riskDistribution.high}
            subtitle={`${((data.riskDistribution.high / data.totalModules) * 100).toFixed(1)}% of total code base`}
            icon={ShieldAlert}
            variant="rose"
            badgeText="≥65% Prob"
          />

          <MetricCard
            id="stat-medium-risk"
            title="Medium-Risk Modules"
            value={data.riskDistribution.medium}
            subtitle={`${((data.riskDistribution.medium / data.totalModules) * 100).toFixed(1)}% of total code base`}
            icon={AlertTriangle}
            variant="amber"
            badgeText="35-64% Prob"
          />

          <MetricCard
            id="stat-low-risk"
            title="Low-Risk Clean Modules"
            value={data.riskDistribution.low}
            subtitle={`${((data.riskDistribution.low / data.totalModules) * 100).toFixed(1)}% safe code base`}
            icon={ShieldCheck}
            variant="emerald"
            badgeText="<35% Prob"
          />

          <MetricCard
            id="stat-f1-score"
            title="Model Macro F1 Score"
            value="0.888"
            subtitle="Validated on NASA MDP"
            change={{ value: '+26.3%', isPositive: true, label: 'vs Baseline' }}
            icon={TrendingUp}
            variant="cyan"
            badgeText="SMOTE"
          />

          <MetricCard
            id="stat-auc-score"
            title="Model ROC-AUC"
            value="0.948"
            subtitle="Discrimination index"
            change={{ value: '+19.7%', isPositive: true, label: 'gain' }}
            icon={Sparkles}
            variant="cyan"
            badgeText="Ensemble"
          />

          <MetricCard
            id="stat-explainability"
            title="Explainability Engine"
            value="TreeSHAP"
            subtitle="Game-Theoretic Axioms"
            icon={Sliders}
            variant="default"
            badgeText="Exact"
          />
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Risk Distribution Chart Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-black/30">
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Bug Risk Distribution
                </h3>
                <p className="text-sm text-slate-400 mt-1">Classified software modules by predicted defect severity</p>
              </div>
              <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 font-mono text-xs font-bold text-slate-300">
                N = {data.totalModules}
              </span>
            </div>

            <div className="h-60 sm:h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111114" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-slate-800 bg-[#0A0A0B] p-3 shadow-2xl text-sm">
                            <span className="font-bold text-white text-base">{item.name}</span>
                            <div className="font-mono text-cyan-400 mt-1.5 font-bold text-sm">
                              {item.count} modules ({item.percentage}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-5 text-center mt-3">
            {riskChartData.map((r) => (
              <div key={r.name} className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                  <span>{r.name}</span>
                </div>
                <div className="font-mono text-base sm:text-lg font-bold text-white">
                  {r.count} <span className="text-xs sm:text-sm font-normal text-slate-400">({r.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance Comparison Chart Card */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#111114] p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-black/30">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Model Performance Benchmark
                </h3>
                <p className="text-sm text-slate-400 mt-1">Original research baseline vs. Proposed BugLens SMOTE Ensemble (%)</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Full Comparison</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm mb-4 text-slate-300 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-600" />
                <span>Original Research Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-cyan-500" />
                <span className="font-semibold text-cyan-300">Proposed Improved Ensemble</span>
              </div>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelMetricsData} barGap={6} margin={{ top: 12, right: 15, left: -10, bottom: 5 }}>
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }} 
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-800 bg-[#0A0A0B] p-3 shadow-2xl text-sm space-y-1.5">
                            <span className="font-bold text-white text-base">{label}</span>
                            <div className="text-slate-300 font-mono text-sm">
                              Baseline: <span className="text-white font-semibold">{payload[0].value}%</span>
                            </div>
                            <div className="text-cyan-400 font-mono text-sm font-bold">
                              BugLens: <span>{payload[1].value}%</span> (+{(Number(payload[1].value) - Number(payload[0].value)).toFixed(1)}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="original" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Baseline" />
                  <Bar dataKey="improved" fill="#06b6d4" radius={[4, 4, 0, 0]} name="BugLens Ensemble" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-sm text-slate-300 flex-wrap gap-2">
            <span>Validated across NASA MDP KC1, JM1 and Apache Software Corpora</span>
            <span className="font-mono text-cyan-400 font-bold text-base">+26.3% F1 Gain</span>
          </div>
        </div>
      </div>

      {/* High-Risk Module Priority Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#111114] overflow-hidden shadow-lg shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldAlert size={22} className="text-rose-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High-Risk Software Modules Alert Queue
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Modules exceeding acceptable defect probability thresholds — Immediate peer review recommended
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dataset')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <span>View All {data.totalModules} Modules</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-[15px]">
            <thead className="bg-[#0A0A0B] border-b border-slate-800 text-sm font-bold uppercase tracking-wider text-slate-300">
              <tr>
                <th className="px-6 py-4">Software Module</th>
                <th className="px-5 py-4">Bug Probability</th>
                <th className="px-5 py-4">Risk Level</th>
                <th className="px-5 py-4">Key Metric Driver</th>
                <th className="px-5 py-4">Recommended Action</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {highRiskModules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-base">
                    No high-risk modules identified in current dataset partition.
                  </td>
                </tr>
              ) : (
                highRiskModules.slice(0, 6).map((module) => (
                  <tr key={module.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2.5 font-mono font-bold text-slate-100 text-base">
                        <FileCode size={18} className="text-rose-400 shrink-0" />
                        <span className="truncate max-w-[240px]">{module.name}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                        LOC: <span className="text-slate-200 font-mono font-medium">{module.metrics.linesOfCode}</span> | v(G): <span className="text-slate-200 font-mono font-medium">{module.metrics.cyclomaticComplexity}</span> | CBO: <span className="text-slate-200 font-mono font-medium">{module.metrics.coupling}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4.5 font-mono font-bold text-rose-400 text-base">
                      {module.bugProbability.toFixed(1)}%
                    </td>

                    <td className="px-5 py-4.5">
                      <RiskBadge level={module.riskLevel} size="md" />
                    </td>

                    <td className="px-5 py-4.5 text-slate-200 font-medium">
                      <span className="rounded-lg bg-rose-500/15 px-3 py-1 text-rose-300 border border-rose-500/30 font-mono text-xs sm:text-sm font-bold">
                        {module.topRiskFactor}
                      </span>
                    </td>

                    <td className="px-5 py-4.5 text-slate-300 max-w-sm truncate text-sm leading-normal">
                      {module.recommendation}
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectModuleForExplanation(module.metrics, module.name);
                          setActiveTab('explainability');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-cyan-600 hover:text-white border border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 transition-colors cursor-pointer shadow-sm"
                      >
                        <Sliders size={14} />
                        <span>Explain (SHAP)</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

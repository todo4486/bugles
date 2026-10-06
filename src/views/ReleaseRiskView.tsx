import React, { useState } from 'react';
import { 
  GitCompare, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  FileCode2, 
  Scale 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts';

interface ReleaseSnapshot {
  version: string;
  name: string;
  totalModules: number;
  defectiveRate: number;       // e.g. 24.2%
  highRiskCount: number;
  medRiskCount: number;
  lowRiskCount: number;
  avgComplexity: number;
  avgLoc: number;
  avgCoupling: number;
  avgBugProbability: number;
  criticalModules: Array<{
    name: string;
    prevProb: number;
    currProb: number;
    prevRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    currRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    delta: number;
    reason: string;
  }>;
}

export const ReleaseRiskView: React.FC = () => {
  const [selectedComparison, setSelectedComparison] = useState<'v1_to_v2' | 'kc1_to_refactored'>('v1_to_v2');

  const releaseScenarios: Record<string, { baseline: ReleaseSnapshot; target: ReleaseSnapshot; description: string }> = {
    v1_to_v2: {
      description: 'Sprint 14 Release (v1.4.0) vs. Sprint 15 Post-Refactoring Release (v2.0.0)',
      baseline: {
        version: 'v1.4.0 (Sprint 14)',
        name: 'Legacy Monolith Baseline',
        totalModules: 142,
        defectiveRate: 26.8,
        highRiskCount: 38,
        medRiskCount: 44,
        lowRiskCount: 60,
        avgComplexity: 14.6,
        avgLoc: 384,
        avgCoupling: 11.2,
        avgBugProbability: 46.2,
        criticalModules: [
          { name: 'PaymentGatewayRouter.ts', prevProb: 88.4, currProb: 42.1, prevRisk: 'HIGH', currRisk: 'MEDIUM', delta: -46.3, reason: 'Refactored 4 nested switch ladders into Strategy dispatch' },
          { name: 'AuthenticationSession.ts', prevProb: 76.5, currProb: 31.0, prevRisk: 'HIGH', currRisk: 'LOW', delta: -45.5, reason: 'Decoupled TokenStore and reduced CBO from 18 to 6' },
          { name: 'AnalyticsBatchWorker.ts', prevProb: 68.2, currProb: 64.0, prevRisk: 'HIGH', currRisk: 'MEDIUM', delta: -4.2, reason: 'Minor cleanup, still has heavy synchronous disk I/O' },
          { name: 'DataMigrationPipeline.ts', prevProb: 44.0, currProb: 74.8, prevRisk: 'MEDIUM', currRisk: 'HIGH', delta: +30.8, reason: '⚠️ New schema transform added 12 new unvalidated branches' }
        ]
      },
      target: {
        version: 'v2.0.0 (Sprint 15)',
        name: 'Refactored Micro-Module Build',
        totalModules: 156,
        defectiveRate: 15.4,
        highRiskCount: 16,
        medRiskCount: 36,
        lowRiskCount: 104,
        avgComplexity: 8.9,
        avgLoc: 215,
        avgCoupling: 6.4,
        avgBugProbability: 28.5,
        criticalModules: []
      }
    },
    kc1_to_refactored: {
      description: 'NASA KC1 Flight Software Baseline vs. Automated Taint-Refactored Candidate',
      baseline: {
        version: 'NASA KC1 (Raw)',
        name: 'Avionics System Baseline',
        totalModules: 2107,
        defectiveRate: 15.4,
        highRiskCount: 325,
        medRiskCount: 640,
        lowRiskCount: 1142,
        avgComplexity: 16.8,
        avgLoc: 412,
        avgCoupling: 13.5,
        avgBugProbability: 38.6,
        criticalModules: [
          { name: 'guidance_vector_calc.c', prevProb: 91.2, currProb: 38.5, prevRisk: 'HIGH', currRisk: 'MEDIUM', delta: -52.7, reason: 'Decomposed 350-line trigonometric matrix multiplication loop' },
          { name: 'telemetry_packet_sync.c', prevProb: 84.6, currProb: 41.2, prevRisk: 'HIGH', currRisk: 'MEDIUM', delta: -43.4, reason: 'Extracted CRC verification into standalone pure utility' }
        ]
      },
      target: {
        version: 'NASA KC1 (Refactored)',
        name: 'Optimized Avionics Suite',
        totalModules: 2280,
        defectiveRate: 8.2,
        highRiskCount: 112,
        medRiskCount: 420,
        lowRiskCount: 1748,
        avgComplexity: 9.4,
        avgLoc: 238,
        avgCoupling: 7.2,
        avgBugProbability: 21.3,
        criticalModules: []
      }
    }
  };

  const currentScenario = releaseScenarios[selectedComparison];
  const { baseline, target } = currentScenario;

  // Dynamic Delta Calculations
  const bugProbDelta = Number((target.avgBugProbability - baseline.avgBugProbability).toFixed(1));
  const highRiskDelta = target.highRiskCount - baseline.highRiskCount;
  const highRiskPctDelta = Number(((highRiskDelta / baseline.highRiskCount) * 100).toFixed(1));
  const complexityDelta = Number((target.avgComplexity - baseline.avgComplexity).toFixed(1));
  const complexityPctDelta = Number(((complexityDelta / baseline.avgComplexity) * 100).toFixed(1));
  const defectRateDelta = Number((target.defectiveRate - baseline.defectiveRate).toFixed(1));

  // Risk Tier Distribution Bar Chart Data
  const riskTierData = [
    { tier: 'High Risk (≥65%)', Baseline: baseline.highRiskCount, Target: target.highRiskCount },
    { tier: 'Medium Risk (35-64%)', Baseline: baseline.medRiskCount, Target: target.medRiskCount },
    { tier: 'Low Risk (<35%)', Baseline: baseline.lowRiskCount, Target: target.lowRiskCount }
  ];

  // Radar Comparison Data
  const radarData = [
    { subject: 'Bug Probability (%)', Baseline: baseline.avgBugProbability, Target: target.avgBugProbability, fullMark: 100 },
    { subject: 'Cyclomatic v(G)', Baseline: baseline.avgComplexity * 4, Target: target.avgComplexity * 4, fullMark: 100 },
    { subject: 'Coupling (CBO)', Baseline: baseline.avgCoupling * 5, Target: target.avgCoupling * 5, fullMark: 100 },
    { subject: 'Defect Rate (%)', Baseline: baseline.defectiveRate * 2.5, Target: target.defectiveRate * 2.5, fullMark: 100 },
    { subject: 'High-Risk Share', Baseline: (baseline.highRiskCount / baseline.totalModules) * 150, Target: (target.highRiskCount / target.totalModules) * 150, fullMark: 100 }
  ];

  const isReleaseSafe = bugProbDelta < 0 && highRiskDelta < 0;

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner Overview */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              Release Risk Analysis & Regression Drift
            </h2>
            <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
              Comparative Release Audit
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            Compare software defect risk distributions across sequential sprints or major releases. Quantify the empirical impact of code refactoring on defect probability and module risk tiers.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0B] p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedComparison('v1_to_v2')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              selectedComparison === 'v1_to_v2' 
                ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sprint 14 vs 15
          </button>
          <button
            type="button"
            onClick={() => setSelectedComparison('kc1_to_refactored')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              selectedComparison === 'kc1_to_refactored' 
                ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            NASA KC1 Refactor
          </button>
        </div>
      </div>

      {/* Release Verdict Card */}
      <div className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4 ${
        isReleaseSafe 
          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' 
          : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            isReleaseSafe ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
          }`}>
            {isReleaseSafe ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold block">
              Release Readiness Verdict
            </span>
            <h3 className="text-sm font-bold text-white">
              {isReleaseSafe 
                ? `APPROVED FOR RELEASE: ${target.version} reduced defect vulnerability by ${Math.abs(bugProbDelta)}%` 
                : `RELEASE BLOCKED: High risk regression detected in ${target.version}`
              }
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              High-risk modules decreased from <span className="font-bold text-white">{baseline.highRiskCount}</span> down to <span className="font-bold text-emerald-400">{target.highRiskCount}</span> ({highRiskPctDelta}% change).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#0A0A0B]/80 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[9px] text-slate-400 block">Mean Bug Risk</span>
            <span className="font-bold text-emerald-400">{target.avgBugProbability}% ({bugProbDelta}%)</span>
          </div>
        </div>
      </div>

      {/* Dynamic KPI Delta Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* High Risk Modules Delta */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            High-Risk Modules
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{target.highRiskCount}</span>
            <span className="text-xs font-mono text-slate-400">was {baseline.highRiskCount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold font-mono text-emerald-400">
            <TrendingDown size={12} />
            <span>{highRiskDelta} ({highRiskPctDelta}%)</span>
          </div>
        </div>

        {/* Average Bug Probability Delta */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Avg Bug Probability
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{target.avgBugProbability}%</span>
            <span className="text-xs font-mono text-slate-400">was {baseline.avgBugProbability}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold font-mono text-emerald-400">
            <TrendingDown size={12} />
            <span>{bugProbDelta}% overall</span>
          </div>
        </div>

        {/* Cyclomatic Complexity Delta */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Mean Cyclomatic v(G)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{target.avgComplexity}</span>
            <span className="text-xs font-mono text-slate-400">was {baseline.avgComplexity}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold font-mono text-emerald-400">
            <TrendingDown size={12} />
            <span>{complexityDelta} ({complexityPctDelta}%)</span>
          </div>
        </div>

        {/* Defective Module Rate */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Defective Ratio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">{target.defectiveRate}%</span>
            <span className="text-xs font-mono text-slate-400">was {baseline.defectiveRate}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold font-mono text-emerald-400">
            <TrendingDown size={12} />
            <span>{defectRateDelta}% lower</span>
          </div>
        </div>
      </div>

      {/* Comparison Visualizations: Risk Distribution Shifts & Architectural Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Distribution Shift Grouped Bar Chart */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Module Risk Tier Migration
              </h4>
              <p className="text-[11px] text-slate-400">
                Comparing count of modules in High, Medium, and Low risk brackets.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-2 w-2 rounded-xs bg-slate-600" />
                {baseline.version}
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="h-2 w-2 rounded-xs bg-cyan-500" />
                {target.version}
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskTierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="tier" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#27272a' }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={{ stroke: '#27272a' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-800 bg-[#0A0A0B] p-2.5 text-xs shadow-xl space-y-1">
                          <span className="font-bold text-white">{label}</span>
                          <div className="text-slate-400 font-mono text-[11px]">
                            {baseline.version}: <span className="text-white font-bold">{payload[0].value} modules</span>
                          </div>
                          <div className="text-cyan-400 font-mono text-[11px] font-bold">
                            {target.version}: <span>{payload[1].value} modules</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Baseline" fill="#475569" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Target" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Metric Profile */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              System Quality Profile Radar
            </h4>
            <p className="text-[11px] text-slate-400">
              Normalized metric footprint comparison (smaller area = healthier code).
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" tick={false} />
                <Radar name={baseline.version} dataKey="Baseline" stroke="#64748b" fill="#64748b" fillOpacity={0.25} />
                <Radar name={target.version} dataKey="Target" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Module Drift Table */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Critical Modules Risk Drift Audit
            </h4>
            <p className="text-[11px] text-slate-400">
              Tracking individual module probability transitions between releases.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-2">Module Name</th>
                <th className="pb-2">{baseline.version}</th>
                <th className="pb-2">{target.version}</th>
                <th className="pb-2">Risk Delta</th>
                <th className="pb-2">Engineering Rationale & Refactor Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {baseline.criticalModules.map((mod, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-mono text-slate-200 font-medium flex items-center gap-1.5">
                    <FileCode2 size={13} className="text-cyan-400" />
                    <span>{mod.name}</span>
                  </td>
                  <td className="py-2.5 font-mono">
                    <span className="text-rose-400 font-bold">{mod.prevProb}%</span> ({mod.prevRisk})
                  </td>
                  <td className="py-2.5 font-mono">
                    <span className={mod.currRisk === 'HIGH' ? 'text-rose-400 font-bold' : mod.currRisk === 'MEDIUM' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {mod.currProb}%
                    </span> ({mod.currRisk})
                  </td>
                  <td className="py-2.5 font-mono font-bold">
                    <span className={mod.delta < 0 ? 'text-emerald-400 flex items-center gap-0.5' : 'text-rose-400 flex items-center gap-0.5'}>
                      {mod.delta < 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                      {mod.delta > 0 ? `+${mod.delta}%` : `${mod.delta}%`}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400 text-[11px]">
                    {mod.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

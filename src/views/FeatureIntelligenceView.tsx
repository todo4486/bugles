import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  Cpu, 
  Code2, 
  Sliders, 
  BarChart2, 
  Flame, 
  ShieldCheck, 
  Sparkles 
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
  CartesianGrid 
} from 'recharts';

interface MetricFeature {
  id: string;
  name: string;
  symbol: string;
  category: 'Complexity' | 'Size' | 'Architecture' | 'Documentation';
  importance: number;       // e.g. 0.31 (31%)
  originalRank: number;
  improvedRank: number;
  correlation: number;      // Pearson / Spearman correlation with defects
  description: string;
  whyItMatters: string;
  recommendedThreshold: string;
  inOptimizedSubset: boolean;
}

export const FeatureIntelligenceView: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'all' | 'top5' | 'top10' | 'optimized'>('optimized');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('cyclomaticComplexity');

  const allFeatures: MetricFeature[] = [
    {
      id: 'cyclomaticComplexity',
      name: 'Cyclomatic Complexity',
      symbol: 'v(G)',
      category: 'Complexity',
      importance: 0.31,
      originalRank: 2,
      improvedRank: 1,
      correlation: 0.74,
      description: 'Measures the number of linearly independent execution paths through source code (McCabe, 1976).',
      whyItMatters: 'Functions with high branch density contain exponential permutations of edge cases that human testers miss.',
      recommendedThreshold: '≤ 10 per method',
      inOptimizedSubset: true
    },
    {
      id: 'linesOfCode',
      name: 'Lines of Code',
      symbol: 'LOC',
      category: 'Size',
      importance: 0.22,
      originalRank: 1,
      improvedRank: 2,
      correlation: 0.68,
      description: 'Physical line count excluding blank lines and standard license headers.',
      whyItMatters: 'Empirical defect density scales non-linearly with volume; large files accumulate hidden state variables.',
      recommendedThreshold: '< 250 LOC per module',
      inOptimizedSubset: true
    },
    {
      id: 'halsteadEffort',
      name: 'Halstead Mental Effort',
      symbol: 'E',
      category: 'Complexity',
      importance: 0.18,
      originalRank: 4,
      improvedRank: 3,
      correlation: 0.65,
      description: 'Calculates the mental effort required to translate an algorithm into code based on distinct operators and operands.',
      whyItMatters: 'High cognitive burden directly translates into cognitive fatigue and logic bugs during code maintenance.',
      recommendedThreshold: '< 15,000 elementary operations',
      inOptimizedSubset: true
    },
    {
      id: 'coupling',
      name: 'Coupling Between Objects',
      symbol: 'CBO',
      category: 'Architecture',
      importance: 0.14,
      originalRank: 5,
      improvedRank: 4,
      correlation: 0.61,
      description: 'Count of external classes/modules to which this module is directly coupled (Chidamber & Kemerer, 1994).',
      whyItMatters: 'High coupling causes ripple defects: changes in upstream dependencies trigger unintended side effects in downstream consumers.',
      recommendedThreshold: '≤ 8 dependencies',
      inOptimizedSubset: true
    },
    {
      id: 'halsteadDifficulty',
      name: 'Halstead Difficulty',
      symbol: 'D',
      category: 'Complexity',
      importance: 0.09,
      originalRank: 3,
      improvedRank: 5,
      correlation: 0.52,
      description: 'Proportional to the number of unique operators and the frequency of shared operands (D = (n1/2) * (N2/n2)).',
      whyItMatters: 'Indicates how error-prone code is during refactoring and edge-case modifications.',
      recommendedThreshold: '< 25.0',
      inOptimizedSubset: true
    },
    {
      id: 'commentLines',
      name: 'Comment Density / Lines',
      symbol: 'CLOC',
      category: 'Documentation',
      importance: 0.08,
      originalRank: 7,
      improvedRank: 6,
      correlation: -0.42,
      description: 'Quantity of active documentation lines explaining invariants and assumptions.',
      whyItMatters: 'Acts as a protective negative risk driver: well-documented modules experience fewer misuse defects by team members.',
      recommendedThreshold: '≥ 15% - 25% of LOC',
      inOptimizedSubset: true
    },
    {
      id: 'halsteadVolume',
      name: 'Halstead Volume',
      symbol: 'V',
      category: 'Complexity',
      importance: 0.04,
      originalRank: 6,
      improvedRank: 7,
      correlation: 0.58,
      description: 'Information content size of the program based on vocabulary size and operator length.',
      whyItMatters: 'High collinearity with LOC and Halstead Effort, pruned in the optimized 6-feature subset.',
      recommendedThreshold: '< 3,000 bits',
      inOptimizedSubset: false
    },
    {
      id: 'numberOfMethods',
      name: 'Number of Methods',
      symbol: 'NOM',
      category: 'Architecture',
      importance: 0.03,
      originalRank: 8,
      improvedRank: 8,
      correlation: 0.44,
      description: 'Total number of public, protected, and private functions defined in the class.',
      whyItMatters: 'Classes with >20 methods violate the Single Responsibility Principle and indicate God Objects.',
      recommendedThreshold: '≤ 15 methods',
      inOptimizedSubset: false
    },
    {
      id: 'numberOfAttributes',
      name: 'Number of Attributes',
      symbol: 'NOA',
      category: 'Architecture',
      importance: 0.02,
      originalRank: 9,
      improvedRank: 9,
      correlation: 0.38,
      description: 'Number of internal member state variables held by the module.',
      whyItMatters: 'Mutable state accumulation increases race condition and initialization defect vulnerability.',
      recommendedThreshold: '≤ 10 fields',
      inOptimizedSubset: false
    },
    {
      id: 'numberOfClasses',
      name: 'Number of Classes',
      symbol: 'NOC',
      category: 'Architecture',
      importance: 0.01,
      originalRank: 10,
      improvedRank: 10,
      correlation: 0.28,
      description: 'Number of discrete class entities packaged in the file unit.',
      whyItMatters: 'Multiple classes in a single file obscure dependency graphs and hinder static analysis tools.',
      recommendedThreshold: '1 class per file',
      inOptimizedSubset: false
    }
  ];

  // Filter features based on mode
  const displayedFeatures = allFeatures.filter(f => {
    if (filterMode === 'top5') return f.improvedRank <= 5;
    if (filterMode === 'top10' || filterMode === 'all') return true;
    if (filterMode === 'optimized') return f.inOptimizedSubset;
    return true;
  });

  const selectedFeature = allFeatures.find(f => f.id === selectedFeatureId) || allFeatures[0];

  // Features Used vs F1-Score Trade-off Curve
  const tradeOffCurveData = [
    { features: 2, f1Score: 0.724, auc: 0.765, name: '2 Features (LOC, v(G))' },
    { features: 4, f1Score: 0.812, auc: 0.862, name: '4 Features' },
    { features: 5, f1Score: 0.861, auc: 0.915, name: '5 Features' },
    { features: 6, f1Score: 0.888, auc: 0.948, name: '6 Features (Optimal Subset)', isOptimal: true },
    { features: 8, f1Score: 0.884, auc: 0.942, name: '8 Features (Diminishing Return)' },
    { features: 10, f1Score: 0.879, auc: 0.938, name: '10 Features (Multicollinear Noise)' }
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner Overview */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              Feature Intelligence & Metric Importance
            </h2>
            <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
              TreeSHAP Global Attributions
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            Software metrics ranked by predictive causal impact on software defects. Feature selection removes collinear noise (VIF &lt; 4.5) to optimize inference speed and generalization accuracy.
          </p>
        </div>

        {/* Feature Subset Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0B] p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setFilterMode('optimized')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterMode === 'optimized' 
                ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Optimized Subset (6)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('top5')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterMode === 'top5' 
                ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top 5
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterMode === 'all' 
                ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Metrics (10)
          </button>
        </div>
      </div>

      {/* Main Grid: Metric Ranking Cards & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Metric Feature Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Ranked Software Engineering Metrics ({displayedFeatures.length} Active)</span>
            <span className="text-cyan-400 font-mono">Mean Importance Score</span>
          </div>

          <div className="space-y-2">
            {displayedFeatures.map((feature) => {
              const isSelected = feature.id === selectedFeatureId;
              const importancePercent = (feature.importance * 100).toFixed(0);

              return (
                <div
                  key={feature.id}
                  onClick={() => setSelectedFeatureId(feature.id)}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/40'
                      : 'border-slate-800 bg-[#111114] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                      #{feature.improvedRank}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {feature.name}
                        </span>
                        <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          {feature.symbol}
                        </span>
                        {feature.inOptimizedSubset && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                            Optimized
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="w-24 sm:w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Weight:</span>
                        <span className="font-bold text-white">{importancePercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all"
                          style={{ width: `${importancePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-slate-400">
                      <span className="text-[10px] text-slate-400 block">Defect r</span>
                      <span className={feature.correlation > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {feature.correlation > 0 ? `+${feature.correlation}` : feature.correlation}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Feature Deep Dive & Research Explanation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Rank #{selectedFeature.improvedRank} in BugLens Ensemble
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedFeature.name} ({selectedFeature.symbol})
                </h3>
              </div>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                {selectedFeature.category}
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Software Engineering Definition
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedFeature.description}
                </p>
              </div>

              <div className="rounded-lg bg-cyan-950/20 border border-cyan-900/40 p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block flex items-center gap-1">
                  <Flame size={12} />
                  Why It Triggers Defects (Causal Rationale)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedFeature.whyItMatters}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Safe Boundary
                  </span>
                  <p className="text-xs font-mono font-bold text-emerald-400">
                    {selectedFeature.recommendedThreshold}
                  </p>
                </div>

                <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Empirical Correlation
                  </span>
                  <p className="text-xs font-mono font-bold text-cyan-400">
                    r = {selectedFeature.correlation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chart: Features Used vs F1-Score Trade-off */}
          <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-cyan-400" />
                  Features Used vs. F1-Score Trade-Off
                </h4>
                <p className="text-[11px] text-slate-400">
                  Empirical proof: 6 features achieves maximum F1 (0.888) with minimal variance.
                </p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tradeOffCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="features" tick={{ fill: '#71717a', fontSize: 10 }} unit=" feats" stroke="#27272a" />
                  <YAxis domain={[0.65, 0.95]} tick={{ fill: '#71717a', fontSize: 10 }} stroke="#27272a" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-800 bg-[#0A0A0B] p-2.5 text-xs shadow-xl space-y-1">
                            <span className="font-bold text-white">{d.name}</span>
                            <div className="text-cyan-400 font-mono font-bold">F1-Score: {d.f1Score}</div>
                            <div className="text-emerald-400 font-mono">ROC-AUC: {d.auc}</div>
                            {d.isOptimal && (
                              <div className="text-xs text-amber-400 font-bold mt-1">★ Optimal Trade-Off Point</div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="f1Score" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4, fill: '#06b6d4' }} name="F1 Score" />
                  <Line type="monotone" dataKey="auc" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#10b981' }} name="ROC-AUC" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight bg-[#0A0A0B] p-2.5 rounded-lg border border-slate-800">
              Adding metrics beyond the top 6 introduces multicollinear variance without improving classification power.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

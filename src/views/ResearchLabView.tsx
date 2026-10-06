import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  Layers, 
  TrendingUp, 
  RotateCcw, 
  History, 
  CheckCircle2, 
  Sliders, 
  BrainCircuit, 
  Award, 
  Scale, 
  Filter, 
  Cpu, 
  Database, 
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
import { apiService } from '../services/api';
import { ExperimentRun } from '../types';

export const ResearchLabView: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('NASA KC1 (Flight Avionics)');
  const [selectedBalancing, setSelectedBalancing] = useState('SMOTE');
  const [selectedFeatureSelection, setSelectedFeatureSelection] = useState('Mutual Information (Top 6)');
  const [selectedModel, setSelectedModel] = useState('Proposed Ensemble (LightGBM + XGBoost + CatBoost)');
  const [selectedCv, setSelectedCv] = useState('10-fold Stratified CV');
  const [isRunning, setIsRunning] = useState(false);

  const [experimentHistory, setExperimentHistory] = useState<ExperimentRun[]>([
    {
      id: 'exp-init-1',
      timestamp: '14:20:11',
      dataset: 'NASA KC1',
      balancingMethod: 'SMOTE',
      featureSelection: 'Mutual Information',
      modelAlgorithm: 'Proposed Ensemble',
      crossValidation: '10-fold Stratified',
      accuracy: 0.912,
      precision: 0.886,
      recall: 0.891,
      f1Score: 0.888,
      rocAuc: 0.948,
      prAuc: 0.923,
      trainingTimeMs: 240
    },
    {
      id: 'exp-init-2',
      timestamp: '14:15:02',
      dataset: 'NASA KC1',
      balancingMethod: 'None (Raw)',
      featureSelection: 'None (All 10)',
      modelAlgorithm: 'Random Forest',
      crossValidation: '5-fold',
      accuracy: 0.824,
      precision: 0.760,
      recall: 0.715,
      f1Score: 0.737,
      rocAuc: 0.832,
      prAuc: 0.774,
      trainingTimeMs: 180
    },
    {
      id: 'exp-init-3',
      timestamp: '14:02:44',
      dataset: 'NASA KC1',
      balancingMethod: 'None (Raw)',
      featureSelection: 'None (All 10)',
      modelAlgorithm: 'Baseline (LR + C4.5)',
      crossValidation: '10-fold Stratified',
      accuracy: 0.784,
      precision: 0.712,
      recall: 0.695,
      f1Score: 0.703,
      rocAuc: 0.792,
      prAuc: 0.738,
      trainingTimeMs: 140
    }
  ]);

  const ablationStages = apiService.getAblationStages();

  const handleRunExperiment = async () => {
    setIsRunning(true);
    try {
      const balancingKey = selectedBalancing.includes('SMOTE') ? 'SMOTE' 
        : selectedBalancing.includes('ADASYN') ? 'ADASYN' 
        : selectedBalancing.includes('RUS') ? 'RUS' : 'None';
      
      const featureKey = selectedFeatureSelection.includes('Mutual') ? 'Mutual Information'
        : selectedFeatureSelection.includes('RFE') ? 'RFE'
        : selectedFeatureSelection.includes('SelectKBest') ? 'SelectKBest' : 'None';

      const modelKey = selectedModel.includes('Proposed') ? 'Proposed Ensemble'
        : selectedModel.includes('XGBoost') ? 'XGBoost'
        : selectedModel.includes('Random Forest') ? 'Random Forest' : 'Baseline';

      const res = await apiService.runExperiment({
        dataset: selectedDataset.split(' ')[0] + ' ' + (selectedDataset.split(' ')[1] || ''),
        balancingMethod: balancingKey,
        featureSelection: featureKey,
        modelAlgorithm: modelKey,
        crossValidation: selectedCv
      });

      setExperimentHistory(prev => [res, ...prev]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearHistory = () => {
    setExperimentHistory([]);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner Overview */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              Research Lab & Empirical Ablation Study
            </h2>
            <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
              Experimental Testbed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            Configure custom machine learning experimentation pipelines. Validate the individual performance contributions of SMOTE balancing, feature pruning, and gradient boosted ensembles across empirical benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isRunning}
            onClick={handleRunExperiment}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RotateCcw size={14} className="animate-spin" />
                <span>Running Fold Cross-Validation...</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-white" />
                <span>Run Experiment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Experiment Pipeline Configurator Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Sliders size={14} className="text-cyan-400" />
            Experiment Hyperparameter & Pipeline Controls
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Optuna Bayesian Tuned Defaults
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Dataset Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Database size={11} className="text-cyan-400" />
              <span>Benchmark Dataset</span>
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] p-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="NASA KC1 (Flight Avionics)">NASA KC1 (2,107 modules)</option>
              <option value="NASA JM1 (Ground Systems)">NASA JM1 (10,885 modules)</option>
              <option value="NASA PC1 (Satellite Flight)">NASA PC1 (1,109 modules)</option>
              <option value="Apache Lucene v2.4">Apache Lucene (340 classes)</option>
            </select>
          </div>

          {/* Class Balancing Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Scale size={11} className="text-cyan-400" />
              <span>Class Balancing</span>
            </label>
            <select
              value={selectedBalancing}
              onChange={(e) => setSelectedBalancing(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] p-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="SMOTE">SMOTE (Synthetic Minority, k=5)</option>
              <option value="ADASYN">ADASYN (Adaptive Synthetic)</option>
              <option value="RUS">Random Under-Sampling (RUS)</option>
              <option value="None">None (Imbalanced Raw 81/19)</option>
            </select>
          </div>

          {/* Feature Selection Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Filter size={11} className="text-cyan-400" />
              <span>Feature Selection</span>
            </label>
            <select
              value={selectedFeatureSelection}
              onChange={(e) => setSelectedFeatureSelection(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] p-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Mutual Information (Top 6)">Mutual Information (Top 6 Pruned)</option>
              <option value="RFE">Recursive Feature Elimination (RFE)</option>
              <option value="SelectKBest">SelectKBest (ANOVA F-value)</option>
              <option value="None">None (All 10 Raw Features)</option>
            </select>
          </div>

          {/* Model Algorithm Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Cpu size={11} className="text-cyan-400" />
              <span>Model Classifier</span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] p-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Proposed Ensemble (LightGBM + XGBoost + CatBoost)">Proposed Soft-Voting Ensemble</option>
              <option value="XGBoost">Single XGBoost Classifier</option>
              <option value="Random Forest">Random Forest (100 Trees)</option>
              <option value="Baseline">Baseline (Logistic Reg + Decision Tree)</option>
            </select>
          </div>

          {/* Validation Split */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <BrainCircuit size={11} className="text-cyan-400" />
              <span>Validation Protocol</span>
            </label>
            <select
              value={selectedCv}
              onChange={(e) => setSelectedCv(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] p-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="10-fold Stratified CV">10-fold Stratified Cross-Validation</option>
              <option value="5-fold Stratified CV">5-fold Stratified Cross-Validation</option>
              <option value="80/20 Holdout Split">80/20 Train/Test Holdout Split</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ablation Study Progression (5-Stage Scientific Breakdown) */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award size={16} className="text-cyan-400" />
              Formal 5-Stage Ablation Study
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Empirical step-by-step performance validation on NASA KC1 dataset.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
            Cumulative F1 Gain: +26.3%
          </span>
        </div>

        {/* Ablation Chart */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ablationStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: '#27272a' }} />
              <YAxis domain={[0.65, 1.0]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={{ stroke: '#27272a' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-800 bg-[#0A0A0B] p-3 text-xs shadow-xl space-y-1 max-w-xs">
                        <span className="font-bold text-white block">{d.stage}: {d.configuration}</span>
                        <div className="text-cyan-400 font-mono font-bold">F1 Score: {d.f1Score} (+{d.gainVsBaseline}%)</div>
                        <div className="text-emerald-400 font-mono">ROC-AUC: {d.rocAuc}</div>
                        <div className="text-slate-400 font-mono">Accuracy: {d.accuracy}</div>
                        <p className="text-[10px] text-slate-300 pt-1 border-t border-slate-800 mt-1">{d.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="f1Score" fill="#06b6d4" name="F1-Score" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rocAuc" fill="#10b981" name="ROC-AUC" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ablation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-2">Stage</th>
                <th className="pb-2">Architecture Configuration</th>
                <th className="pb-2">F1 Score</th>
                <th className="pb-2">ROC-AUC</th>
                <th className="pb-2">Accuracy</th>
                <th className="pb-2">Gain vs. Baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {ablationStages.map((stage, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-2.5 font-mono text-cyan-400 font-bold">{stage.stage}</td>
                  <td className="py-2.5 font-medium text-slate-200">
                    <div>{stage.configuration}</div>
                    <div className="text-[10px] text-slate-400">{stage.description}</div>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-white">{stage.f1Score}</td>
                  <td className="py-2.5 font-mono text-emerald-400 font-bold">{stage.rocAuc}</td>
                  <td className="py-2.5 font-mono text-slate-300">{stage.accuracy}</td>
                  <td className="py-2.5 font-mono font-bold">
                    <span className={stage.gainVsBaseline > 0 ? 'text-emerald-400' : 'text-slate-500'}>
                      {stage.gainVsBaseline > 0 ? `+${stage.gainVsBaseline}%` : '0.0% (Ref)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Experiment Run History Table */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={15} className="text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Experiment Run History ({experimentHistory.length} Runs)
            </h4>
          </div>

          {experimentHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear History
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                <th className="pb-2">Time</th>
                <th className="pb-2">Dataset</th>
                <th className="pb-2">Balancing</th>
                <th className="pb-2">Feature Selection</th>
                <th className="pb-2">Classifier</th>
                <th className="pb-2">F1 Score</th>
                <th className="pb-2">ROC-AUC</th>
                <th className="pb-2">Precision</th>
                <th className="pb-2">Recall</th>
                <th className="pb-2">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {experimentHistory.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-900/40">
                  <td className="py-2 font-mono text-slate-400 text-[11px]">{exp.timestamp}</td>
                  <td className="py-2 font-mono text-slate-300">{exp.dataset}</td>
                  <td className="py-2 font-mono text-cyan-400 font-semibold">{exp.balancingMethod}</td>
                  <td className="py-2 text-slate-300">{exp.featureSelection}</td>
                  <td className="py-2 font-medium text-white">{exp.modelAlgorithm}</td>
                  <td className="py-2 font-mono font-bold text-cyan-400">{exp.f1Score}</td>
                  <td className="py-2 font-mono font-bold text-emerald-400">{exp.rocAuc}</td>
                  <td className="py-2 font-mono text-slate-300">{exp.precision}</td>
                  <td className="py-2 font-mono text-slate-300">{exp.recall}</td>
                  <td className="py-2 font-mono text-slate-400 text-[11px]">{exp.trainingTimeMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

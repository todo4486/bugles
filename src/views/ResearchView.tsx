import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  GitBranch, 
  Scale, 
  Filter, 
  Cpu, 
  Boxes, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  FileText, 
  Award, 
  ChevronRight 
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const pipelineSteps = [
    {
      id: 0,
      title: 'Dataset Acquisition',
      tag: 'Step 1',
      icon: Layers,
      summary: 'Ingestion of software metrics from NASA MDP (KC1, JM1, CM1) and PROMISE open-science repositories.',
      details: 'Extracts 10 static software engineering metrics spanning McCabe Cyclomatic Complexity, Halstead Software Science, and Chidamber & Kemerer object-oriented coupling metrics across over 20,000 compiled source modules.'
    },
    {
      id: 1,
      title: 'Data Preprocessing & Normalization',
      tag: 'Step 2',
      icon: GitBranch,
      summary: 'Outlier truncation, logarithmic transformation, and standard robust z-score feature scaling.',
      details: 'Mitigates exponential distributions typical in software metrics (e.g. Halstead Effort varying from 10^2 to 10^7) using power transforms to stabilize variance before model ingestion.'
    },
    {
      id: 2,
      title: 'Class Balancing using SMOTE',
      tag: 'Step 3',
      icon: Scale,
      summary: 'Synthetic Minority Over-sampling Technique to resolve severe defect-to-clean class skew (85:15).',
      details: 'Generates synthetic minority defect instances in the metric feature space via k-nearest neighbor interpolation, eliminating inductive bias toward majority non-defective classes.'
    },
    {
      id: 3,
      title: 'Feature Selection & Collinearity',
      tag: 'Step 4',
      icon: Filter,
      summary: 'Variance Inflation Factor (VIF) filtering and Mutual Information scoring.',
      details: 'Removes redundant correlated metrics while preserving key defect signals across structural complexity v(G), cognitive burden (Halstead Effort), and inter-module coupling (CBO).'
    },
    {
      id: 4,
      title: 'Machine Learning Base Models',
      tag: 'Step 5',
      icon: Cpu,
      summary: 'Training heterogeneous gradient boosting trees, support vectors, and regularized linear classifiers.',
      details: 'Evaluates LightGBM, XGBoost, CatBoost, Random Forests, and Radial Basis Function (RBF) SVMs using stratified 10-fold cross-validation.'
    },
    {
      id: 5,
      title: 'Ensemble Stacking Model',
      tag: 'Step 6',
      icon: Boxes,
      summary: 'Meta-learning layer combining probability outputs with Optuna Bayesian hyperparameter tuning.',
      details: 'A regularized meta-logistic classifier learns optimal weighting across base tree ensembles, maximizing both Area Under the ROC Curve (AUC) and F1-score simultaneously.'
    },
    {
      id: 6,
      title: 'Bug Prediction & Thresholding',
      tag: 'Step 7',
      icon: Sparkles,
      summary: 'Calibrated probability outputs mapped into LOW, MEDIUM, and HIGH defect risk tiers.',
      details: 'Implements cost-sensitive decision threshold optimization (Youden J index) ensuring maximum recall on critical defect pathways without overwhelming developer code review pipelines with false alarms.'
    },
    {
      id: 7,
      title: 'SHAP Explainability Engine',
      tag: 'Step 8',
      icon: Sliders,
      summary: 'TreeSHAP game-theoretic Shapley values providing local and global feature attribution.',
      details: 'Computes exact Shapley values in polynomial time, producing intuitive force waterfalls that explain why a specific module was flagged as defect-prone.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Overview */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen size={14} />
          <span>Research Methodology & Technical Architecture</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Explainable Machine-Learning-Based Software Defect Prediction
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Traditional software defect prediction models suffer from the "black-box" dilemma: developers reject automated predictions when they cannot understand <i>why</i> a module was flagged. BugLens bridges empirical software science with TreeSHAP game theory to deliver actionable, transparent risk intelligence.
        </p>
      </div>

      {/* Interactive Methodology Pipeline Flow */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            End-to-End Methodology Pipeline
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5">
            Interactive 8-Stage Research Lifecycle
          </h3>
          <p className="text-xs text-slate-400">
            Click any phase to inspect mathematical formulation, dataset handling, and algorithmic mechanisms.
          </p>
        </div>

        {/* Step Flow Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-col items-center text-center p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-sm'
                    : 'border-slate-800 bg-[#0A0A0B] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-[9px] font-mono font-bold text-cyan-400 mb-1">{step.tag}</span>
                <div className={`p-1.5 rounded-md mb-1.5 ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[11px] font-semibold line-clamp-2 leading-tight">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Step Expanded Details */}
        <div className="rounded-lg border border-cyan-500/30 bg-[#0A0A0B] p-4 space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              {pipelineSteps[activeStep].tag}: {pipelineSteps[activeStep].title}
            </span>
            <span className="text-slate-500 text-[10px]">Pipeline Node #{activeStep + 1} of 8</span>
          </div>
          <h4 className="text-xs font-bold text-white">{pipelineSteps[activeStep].summary}</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{pipelineSteps[activeStep].details}</p>
        </div>
      </div>

      {/* Structured Research Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Research Problem */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">1. Research Problem</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Software quality assurance teams spend over 45% of engineering cycles on manual testing and defect remediation. While automated static analysis tools produce thousands of rule violations with high false-positive rates, empirical software defect prediction models often suffer from:
          </p>
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            <li><b className="text-slate-200">Severe Class Imbalance:</b> Defective modules typically comprise &lt; 15% of historical commits, leading standard classifiers to default to clean labels.</li>
            <li><b className="text-slate-200">Opaque Decision Boundaries:</b> Complex non-linear neural or ensemble models cannot articulate feature contributions to software architects.</li>
            <li><b className="text-slate-200">High Multicollinearity:</b> Correlated software metrics (e.g., LOC vs. Halstead Volume) distort linear coefficient weights.</li>
          </ul>
        </div>

        {/* 2. Existing Approach */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">2. Existing Approach & Limitations</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Seminal studies (e.g. Menzies et al., Lessmann et al.) relied on naive Bayes, single C4.5 decision trees, or unregularized logistic regressions without synthetic minority oversampling:
          </p>
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            <li><b className="text-slate-200">Low Recall on Rare Bugs:</b> Failing to identify critical defect-prone components before release (baseline recall ~69.5%).</li>
            <li><b className="text-slate-200">Global vs. Local Explanation Gap:</b> Presenting static Gini importance charts that fail to explain why a <i>specific</i> pull request is high risk.</li>
            <li><b className="text-slate-200">Static Thresholding:</b> Hardcoded heuristic cutoffs (e.g., McCabe &gt; 10) ignoring inter-metric compounding effects.</li>
          </ul>
        </div>

        {/* 3. Proposed Improvement */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">3. Proposed Improvement (BugLens)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            BugLens introduces a dual-phase architectural pipeline combining balanced ensemble learning with game-theoretic interpretability:
          </p>
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            <li><b className="text-slate-200">SMOTE + Heterogeneous Ensemble:</b> Blends LightGBM, XGBoost, and CatBoost over sampled manifolds to lift recall to 89.1%.</li>
            <li><b className="text-slate-200">Exact TreeSHAP Interpretability:</b> Quantifies marginal attribution for each metric, identifying exact line and complexity drivers.</li>
            <li><b className="text-slate-200">Protective Factor Modeling:</b> Explicitly credits high comment density and modular coupling as negative risk dampers.</li>
          </ul>
        </div>

        {/* 4. Experimental Results */}
        <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">4. Experimental Results & Ablation</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Cross-dataset evaluation over NASA MDP KC1/JM1 and Apache Software Foundation repositories confirms substantial empirical gains:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans uppercase">Accuracy</span>
              <span className="text-cyan-300 font-bold text-sm">91.2%</span>
              <span className="text-[10px] text-green-400 block font-bold">(+12.8%)</span>
            </div>
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans uppercase">F1-Score</span>
              <span className="text-cyan-300 font-bold text-sm">88.8%</span>
              <span className="text-[10px] text-green-400 block font-bold">(+26.3%)</span>
            </div>
            <div className="rounded bg-[#0A0A0B] p-2 border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-sans uppercase">AUC-ROC</span>
              <span className="text-cyan-300 font-bold text-sm">0.948</span>
              <span className="text-[10px] text-green-400 block font-bold">(+0.156)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Future Work */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-2.5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">5. Limitations & Future Work</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="rounded-lg bg-[#0A0A0B] p-3 border border-slate-800 space-y-1">
            <b className="text-slate-200 font-semibold block text-[11px]">AST & Semantic Graph Embeddings</b>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Extending from traditional static McCabe/Halstead metrics to Abstract Syntax Tree (AST) tree-LSTMs and Graph Neural Networks for cross-repository semantic transfer.
            </p>
          </div>
          <div className="rounded-lg bg-[#0A0A0B] p-3 border border-slate-800 space-y-1">
            <b className="text-slate-200 font-semibold block text-[11px]">Just-In-Time (JIT) Commit Defect Prediction</b>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Evaluating diff-level churn, developer experience entropy, and micro-commit frequency alongside compilation unit metrics in CI/CD pipelines.
            </p>
          </div>
          <div className="rounded-lg bg-[#0A0A0B] p-3 border border-slate-800 space-y-1">
            <b className="text-slate-200 font-semibold block text-[11px]">Automated Refactoring Synthesis</b>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Generating prescriptive AST transformation patches that minimize cyclomatic branching while maintaining zero behavioral regression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

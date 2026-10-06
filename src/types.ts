export interface SoftwareMetrics {
  linesOfCode: number;         // LOC
  cyclomaticComplexity: number;// v(G)
  numberOfMethods: number;     // NOM
  numberOfAttributes: number;  // NOA
  coupling: number;            // CBO (Coupling Between Objects)
  halsteadVolume: number;      // V
  halsteadDifficulty: number;  // D
  halsteadEffort: number;      // E
  commentLines: number;        // CLOC
  numberOfClasses: number;     // NOC
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ShapContribution {
  feature: keyof SoftwareMetrics;
  displayName: string;
  value: number;
  shapValue: number;          // Log-odds / Probability delta (+ or -)
  direction: 'increase' | 'decrease';
  impactPercentage: number;   // e.g. 31%
  impactFormatted: string;    // e.g. "+31%" or "-14%"
  baseline: number;           // Mean reference value in benchmark dataset
  description: string;
}

export interface PredictionResult {
  id: string;
  moduleName: string;
  metrics: SoftwareMetrics;
  bugProbability: number;     // 0 - 100 percentage
  riskLevel: RiskLevel;
  confidence: number;         // 0 - 100 percentage
  riskFactors: ShapContribution[];
  recommendation: string;
  naturalLanguageExplanation: string;
  baseExpectedProbability: number; // e.g. 18.5%
  timestamp: string;
  isMock: boolean;
  baselineComparison?: {
    baselineProbability: number;
    baselineRiskLevel: RiskLevel;
    probabilityDelta: number;
    explanation: string;
  };
  developerActionPlan?: {
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    testingTypes: string[];
    fixSteps: string[];
    actions?: string[];
  };
}

export interface DatasetModule {
  id: string;
  name: string;
  metrics: SoftwareMetrics;
  bugProbability: number;
  riskLevel: RiskLevel;
  confidence: number;
  isDefective: boolean;
  recommendation: string;
  topRiskFactor: string;
}

export interface DatasetQualityReport {
  healthScore: number; // 0 - 100
  totalRows: number;
  totalColumns: number;
  missingValuesCount: number;
  duplicateRowsCount: number;
  numericFeaturesCount: number;
  targetColumnDetected: boolean;
  classImbalanceRatio: string;
  outliersDetected: number;
  warnings: string[];
  passedChecks: string[];
}

export interface DatasetAnalysisResult {
  datasetName: string;
  totalModules: number;
  defectiveCount: number;
  nonDefectiveCount: number;
  defectPercentage: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  modules: DatasetModule[];
  averageComplexity: number;
  averageLoc: number;
  averageCoupling: number;
  qualityReport?: DatasetQualityReport;
}

export interface ModelMetrics {
  name: string;
  algorithm: string;
  description: string;
  accuracy: number;     // e.g. 0.912
  precision: number;    // e.g. 0.886
  recall: number;       // e.g. 0.891
  f1Score: number;      // e.g. 0.888
  auc: number;          // e.g. 0.948
  prAuc?: number;       // e.g. 0.923
  latencyMs: number;    // e.g. 16.4
  trainingTimeSec?: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}

export interface ModelComparisonData {
  originalModel: ModelMetrics;
  improvedModel: ModelMetrics;
  alternativeModels?: Record<string, ModelMetrics>;
  improvements: {
    accuracyDiff: number;
    precisionDiff: number;
    recallDiff: number;
    f1Diff: number;
    aucDiff: number;
    latencyDiff: number;
    overallGainPercent: number;
  };
  rocPoints: {
    fpr: number;
    tprOriginal: number;
    tprImproved: number;
    tprRandomForest?: number;
    tprSvm?: number;
    tprXGBoost?: number;
  }[];
  prPoints?: {
    recall: number;
    precisionOriginal: number;
    precisionImproved: number;
    precisionRandomForest?: number;
    precisionSvm?: number;
    precisionXGBoost?: number;
  }[];
  featureImportanceComparison: {
    feature: string;
    originalRank: number;
    improvedRank: number;
    importanceOriginal: number;
    importanceImproved: number;
  }[];
}

export interface ExperimentRun {
  id: string;
  timestamp: string;
  dataset: string;
  balancingMethod: string;
  featureSelection: string;
  modelAlgorithm: string;
  crossValidation: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  trainingTimeMs: number;
}

export interface AblationStage {
  stage: string;
  configuration: string;
  accuracy: number;
  f1Score: number;
  rocAuc: number;
  gainVsBaseline: number;
  description: string;
}

export type UserRole = 'Student' | 'Researcher' | 'Developer' | 'Software Engineer' | 'Other';

export interface UserStats {
  predictionsCount: number;
  datasetsAnalyzedCount: number;
  experimentsCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  createdAt: string;
  avatarInitials: string;
  stats: UserStats;
}

export interface UserActivity {
  id: string;
  timestamp: string;
  activityType: 'prediction' | 'dataset' | 'experiment' | 'comparison' | 'report' | 'auth';
  title: string;
  target: string;
  result: string;
  status: 'HIGH_RISK' | 'MEDIUM_RISK' | 'LOW_RISK' | 'SUCCESS' | 'INFO';
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: UserRole;
  organization?: string;
  agreeTerms?: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'pipeline'
  | 'predict'
  | 'dataset'
  | 'feature-intelligence'
  | 'explainability'
  | 'comparison'
  | 'release-risk'
  | 'research-lab'
  | 'research'
  | 'activity'
  | 'profile';


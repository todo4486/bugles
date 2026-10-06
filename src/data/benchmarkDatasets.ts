import { SoftwareMetrics, DatasetModule, DatasetAnalysisResult } from '../types';

export const METRIC_DEFINITIONS: Record<keyof SoftwareMetrics, { name: string; unit: string; description: string; safeThreshold: string }> = {
  linesOfCode: {
    name: 'Lines of Code (LOC)',
    unit: 'lines',
    description: 'Total executable and non-blank source lines in the module.',
    safeThreshold: '< 250 lines'
  },
  cyclomaticComplexity: {
    name: 'Cyclomatic Complexity (v(G))',
    unit: 'score',
    description: 'Number of linearly independent execution paths (McCabe metric).',
    safeThreshold: '≤ 10'
  },
  numberOfMethods: {
    name: 'Number of Methods (NOM)',
    unit: 'methods',
    description: 'Total member and static routines defined within the class.',
    safeThreshold: '≤ 15'
  },
  numberOfAttributes: {
    name: 'Number of Attributes (NOA)',
    unit: 'attributes',
    description: 'Total instance and class state variables.',
    safeThreshold: '≤ 10'
  },
  coupling: {
    name: 'Coupling (CBO)',
    unit: 'dependencies',
    description: 'Coupling Between Objects: count of other classes coupled to this module.',
    safeThreshold: '≤ 8'
  },
  halsteadVolume: {
    name: 'Halstead Volume (V)',
    unit: 'bits',
    description: 'Information content size derived from vocabulary and operator/operand lengths.',
    safeThreshold: '< 1500'
  },
  halsteadDifficulty: {
    name: 'Halstead Difficulty (D)',
    unit: 'ratio',
    description: 'Error-proneness measure based on unique operators and operands.',
    safeThreshold: '≤ 20'
  },
  halsteadEffort: {
    name: 'Halstead Effort (E)',
    unit: 'effort units',
    description: 'Mental effort required to develop or comprehend the module code.',
    safeThreshold: '< 50,000'
  },
  commentLines: {
    name: 'Comment Lines (CLOC)',
    unit: 'lines',
    description: 'Lines of documentation and in-line code comments.',
    safeThreshold: '> 15% of LOC'
  },
  numberOfClasses: {
    name: 'Number of Classes (NOC)',
    unit: 'classes',
    description: 'Number of discrete class declarations within the compilation unit.',
    safeThreshold: '1 - 3'
  }
};

export const PRESET_MODULES: Array<{ label: string; tag: string; metrics: SoftwareMetrics; description: string }> = [
  {
    label: 'PaymentGatewayTransactor.java',
    tag: 'High Risk (Complex Flow)',
    description: 'Heavy transaction processing module with extensive error branching and nested states.',
    metrics: {
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
    }
  },
  {
    label: 'QueryOptimizerEngine.cpp',
    tag: 'High Risk (Spaghetti Logic)',
    description: 'Heuristic query optimization tree parser with heavy recursion and high coupling.',
    metrics: {
      linesOfCode: 1120,
      cyclomaticComplexity: 48,
      numberOfMethods: 36,
      numberOfAttributes: 29,
      coupling: 31,
      halsteadVolume: 12900,
      halsteadDifficulty: 52.0,
      halsteadEffort: 670800,
      commentLines: 45,
      numberOfClasses: 2
    }
  },
  {
    label: 'StringFormatUtils.ts',
    tag: 'Low Risk (Clean Utility)',
    description: 'Pure functional utility functions with low cyclomatic paths and high comment density.',
    metrics: {
      linesOfCode: 85,
      cyclomaticComplexity: 4,
      numberOfMethods: 8,
      numberOfAttributes: 2,
      coupling: 3,
      halsteadVolume: 410,
      halsteadDifficulty: 6.2,
      halsteadEffort: 2542,
      commentLines: 38,
      numberOfClasses: 1
    }
  },
  {
    label: 'UserSessionManager.go',
    tag: 'Medium Risk (Moderate Coupling)',
    description: 'Handles token rotation, caching, and state synchronization across microservices.',
    metrics: {
      linesOfCode: 380,
      cyclomaticComplexity: 16,
      numberOfMethods: 14,
      numberOfAttributes: 9,
      coupling: 14,
      halsteadVolume: 3200,
      halsteadDifficulty: 18.4,
      halsteadEffort: 58880,
      commentLines: 72,
      numberOfClasses: 2
    }
  },
  {
    label: 'ProtocolBufferEncoder.rs',
    tag: 'Low Risk (Optimized Code)',
    description: 'High-throughput serialization routine with concise structures and strict unit testing.',
    metrics: {
      linesOfCode: 160,
      cyclomaticComplexity: 7,
      numberOfMethods: 9,
      numberOfAttributes: 5,
      coupling: 6,
      halsteadVolume: 1150,
      halsteadDifficulty: 11.0,
      halsteadEffort: 12650,
      commentLines: 60,
      numberOfClasses: 1
    }
  }
];

export const BENCHMARK_DATASETS: Array<{
  id: string;
  name: string;
  source: string;
  description: string;
  language: string;
  modules: Array<{ name: string; metrics: SoftwareMetrics; trueDefect: boolean }>;
}> = [
  {
    id: 'nasa-kc1',
    name: 'NASA MDP KC1 (Ground Flight System)',
    source: 'NASA Metrics Data Program / PROMISE Repository',
    language: 'C++',
    description: 'Subsystem for receiver calibration and orbital tracking telemetry (2,109 raw modules subsampled to 42 representative units).',
    modules: [
      {
        name: 'org.nasa.kc1.TelemetryDemuxer',
        metrics: { linesOfCode: 640, cyclomaticComplexity: 28, numberOfMethods: 22, numberOfAttributes: 14, coupling: 19, halsteadVolume: 5800, halsteadDifficulty: 32.4, halsteadEffort: 187920, commentLines: 35, numberOfClasses: 2 },
        trueDefect: true
      },
      {
        name: 'org.nasa.kc1.OrbitalEphemerisCalc',
        metrics: { linesOfCode: 920, cyclomaticComplexity: 39, numberOfMethods: 31, numberOfAttributes: 24, coupling: 25, halsteadVolume: 9400, halsteadDifficulty: 44.1, halsteadEffort: 414540, commentLines: 48, numberOfClasses: 3 },
        trueDefect: true
      },
      {
        name: 'org.nasa.kc1.AntennaAzimuthController',
        metrics: { linesOfCode: 420, cyclomaticComplexity: 18, numberOfMethods: 15, numberOfAttributes: 11, coupling: 13, halsteadVolume: 3600, halsteadDifficulty: 19.5, halsteadEffort: 70200, commentLines: 62, numberOfClasses: 2 },
        trueDefect: true
      },
      {
        name: 'org.nasa.kc1.SignalNoiseFilter',
        metrics: { linesOfCode: 190, cyclomaticComplexity: 8, numberOfMethods: 9, numberOfAttributes: 6, coupling: 7, halsteadVolume: 1420, halsteadDifficulty: 12.0, halsteadEffort: 17040, commentLines: 54, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.ChecksumValidator',
        metrics: { linesOfCode: 75, cyclomaticComplexity: 4, numberOfMethods: 5, numberOfAttributes: 2, coupling: 3, halsteadVolume: 480, halsteadDifficulty: 7.5, halsteadEffort: 3600, commentLines: 30, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.SensorPacketHeaderParser',
        metrics: { linesOfCode: 310, cyclomaticComplexity: 14, numberOfMethods: 12, numberOfAttributes: 8, coupling: 11, halsteadVolume: 2400, halsteadDifficulty: 16.2, halsteadEffort: 38880, commentLines: 40, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.DopplerShiftCompensator',
        metrics: { linesOfCode: 780, cyclomaticComplexity: 33, numberOfMethods: 27, numberOfAttributes: 19, coupling: 22, halsteadVolume: 7900, halsteadDifficulty: 37.0, halsteadEffort: 292300, commentLines: 42, numberOfClasses: 3 },
        trueDefect: true
      },
      {
        name: 'org.nasa.kc1.TimeSyncPulseGenerator',
        metrics: { linesOfCode: 120, cyclomaticComplexity: 5, numberOfMethods: 6, numberOfAttributes: 4, coupling: 5, halsteadVolume: 820, halsteadDifficulty: 8.8, halsteadEffort: 7216, commentLines: 45, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.ThermalControlActuator',
        metrics: { linesOfCode: 510, cyclomaticComplexity: 21, numberOfMethods: 18, numberOfAttributes: 13, coupling: 16, halsteadVolume: 4600, halsteadDifficulty: 24.0, halsteadEffort: 110400, commentLines: 50, numberOfClasses: 2 },
        trueDefect: true
      },
      {
        name: 'org.nasa.kc1.RawTelemetryLogger',
        metrics: { linesOfCode: 140, cyclomaticComplexity: 6, numberOfMethods: 7, numberOfAttributes: 4, coupling: 4, halsteadVolume: 950, halsteadDifficulty: 9.2, halsteadEffort: 8740, commentLines: 55, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.MatrixInversionKernel',
        metrics: { linesOfCode: 260, cyclomaticComplexity: 11, numberOfMethods: 8, numberOfAttributes: 6, coupling: 8, halsteadVolume: 2100, halsteadDifficulty: 14.5, halsteadEffort: 30450, commentLines: 42, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.nasa.kc1.EmergencyAbortSequencer',
        metrics: { linesOfCode: 860, cyclomaticComplexity: 37, numberOfMethods: 29, numberOfAttributes: 21, coupling: 24, halsteadVolume: 8800, halsteadDifficulty: 41.2, halsteadEffort: 362560, commentLines: 38, numberOfClasses: 3 },
        trueDefect: true
      }
    ]
  },
  {
    id: 'apache-lucene-4',
    name: 'Apache Lucene / Solr Core (Search Engine)',
    source: 'Apache Software Foundation Defect Archive',
    language: 'Java',
    description: 'High-performance text indexing, inverted index postings traversal, and query scoring engine.',
    modules: [
      {
        name: 'org.apache.lucene.index.IndexWriter',
        metrics: { linesOfCode: 1450, cyclomaticComplexity: 62, numberOfMethods: 48, numberOfAttributes: 38, coupling: 42, halsteadVolume: 16400, halsteadDifficulty: 64.0, halsteadEffort: 1049600, commentLines: 120, numberOfClasses: 4 },
        trueDefect: true
      },
      {
        name: 'org.apache.lucene.search.BooleanQueryWeight',
        metrics: { linesOfCode: 680, cyclomaticComplexity: 29, numberOfMethods: 24, numberOfAttributes: 16, coupling: 21, halsteadVolume: 6200, halsteadDifficulty: 31.5, halsteadEffort: 195300, commentLines: 75, numberOfClasses: 2 },
        trueDefect: true
      },
      {
        name: 'org.apache.lucene.util.BytesRefArray',
        metrics: { linesOfCode: 210, cyclomaticComplexity: 9, numberOfMethods: 12, numberOfAttributes: 7, coupling: 8, halsteadVolume: 1700, halsteadDifficulty: 13.2, halsteadEffort: 22440, commentLines: 60, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.apache.lucene.codecs.BlockTreeTermsReader',
        metrics: { linesOfCode: 1050, cyclomaticComplexity: 44, numberOfMethods: 34, numberOfAttributes: 26, coupling: 28, halsteadVolume: 11200, halsteadDifficulty: 48.0, halsteadEffort: 537600, commentLines: 88, numberOfClasses: 3 },
        trueDefect: true
      },
      {
        name: 'org.apache.lucene.analysis.StandardTokenizer',
        metrics: { linesOfCode: 290, cyclomaticComplexity: 12, numberOfMethods: 14, numberOfAttributes: 8, coupling: 10, halsteadVolume: 2350, halsteadDifficulty: 15.0, halsteadEffort: 35250, commentLines: 65, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.apache.lucene.store.DirectoryLockFactory',
        metrics: { linesOfCode: 95, cyclomaticComplexity: 5, numberOfMethods: 6, numberOfAttributes: 3, coupling: 4, halsteadVolume: 620, halsteadDifficulty: 8.0, halsteadEffort: 4960, commentLines: 40, numberOfClasses: 1 },
        trueDefect: false
      },
      {
        name: 'org.apache.lucene.search.FuzzyTermsEnum',
        metrics: { linesOfCode: 540, cyclomaticComplexity: 23, numberOfMethods: 19, numberOfAttributes: 14, coupling: 17, halsteadVolume: 4900, halsteadDifficulty: 26.5, halsteadEffort: 129850, commentLines: 58, numberOfClasses: 2 },
        trueDefect: true
      },
      {
        name: 'org.apache.lucene.util.BitUtil',
        metrics: { linesOfCode: 110, cyclomaticComplexity: 6, numberOfMethods: 8, numberOfAttributes: 2, coupling: 3, halsteadVolume: 750, halsteadDifficulty: 8.5, halsteadEffort: 6375, commentLines: 50, numberOfClasses: 1 },
        trueDefect: false
      }
    ]
  }
];

export function generateSampleCsv(): string {
  const headers = [
    'module_name',
    'lines_of_code',
    'cyclomatic_complexity',
    'number_of_methods',
    'number_of_attributes',
    'coupling',
    'halstead_volume',
    'halstead_difficulty',
    'halstead_effort',
    'comment_lines',
    'number_of_classes'
  ];

  const rows = [
    ['AuthTokenService.java', '450', '22', '16', '12', '18', '4200', '24.5', '102900', '45', '2'],
    ['OrderFulfillmentWorker.ts', '780', '35', '26', '18', '24', '7900', '39.0', '308100', '38', '3'],
    ['MathVectorUtil.py', '90', '4', '7', '3', '3', '520', '6.8', '3536', '35', '1'],
    ['DatabaseConnectionPool.cpp', '620', '27', '21', '15', '20', '5900', '29.2', '172280', '52', '2'],
    ['EncryptionKeyVault.go', '310', '13', '11', '8', '11', '2500', '16.0', '40000', '60', '1'],
    ['JsonParserFast.rs', '180', '8', '10', '5', '6', '1350', '11.5', '15525', '48', '1'],
    ['ReportGeneratorPdf.java', '960', '42', '32', '24', '28', '9800', '46.0', '450800', '40', '3'],
    ['NotificationDispatcher.ts', '240', '10', '12', '7', '9', '1900', '13.8', '26220', '55', '1'],
    ['LegacyMigrationScript.py', '1250', '56', '40', '32', '35', '14200', '58.0', '823600', '20', '4'],
    ['HealthCheckPing.go', '65', '3', '4', '2', '2', '380', '5.2', '1976', '30', '1']
  ];

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

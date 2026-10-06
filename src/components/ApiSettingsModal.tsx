import React, { useState } from 'react';
import { getApiConfig, setApiConfig, apiService, ApiConfig } from '../services/api';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Code, Shield } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: (config: ApiConfig) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChange
}) => {
  const currentConfig = getApiConfig();
  const [baseUrl, setBaseUrl] = useState(currentConfig.baseUrl);
  const [useBackend, setUseBackend] = useState(currentConfig.useBackendApi);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = setApiConfig({
      baseUrl,
      useBackendApi: useBackend
    });
    onConfigChange(updated);
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await apiService.testBackendConnection(baseUrl);
    setTesting(false);
    setTestResult(result);
  };

  const fastApiCodeSnippet = `# fast_api_server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="BugLens ML Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MetricsInput(BaseModel):
    lines_of_code: float
    cyclomatic_complexity: float
    number_of_methods: float
    number_of_attributes: float
    coupling: float
    halstead_volume: float
    halstead_difficulty: float
    halstead_effort: float
    comment_lines: float
    number_of_classes: float

@app.get("/api/health")
def health():
    return {"status": "online", "model_version": "XGBoost-SMOTE-v2"}

@app.post("/api/predict")
def predict_bug_risk(payload: dict):
    # Load model and run tree_explainer.shap_values()
    return {"status": "ok", "bugProbability": 84.7, "riskLevel": "HIGH"}
`;

  const copyCode = () => {
    navigator.clipboard.writeText(fastApiCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
              <Server size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Backend Integration & REST API</h2>
              <p className="text-xs text-slate-400">Configure Python REST API endpoint or use built-in ML simulation engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Engine Mode Selector */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Model Execution Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUseBackend(false)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  !useBackend
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs text-slate-200 mb-1">
                  <span>Built-in ML Engine</span>
                  {!useBackend && <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] text-cyan-300">ACTIVE</span>}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Uses NASA MDP / PROMISE calibrated heuristic & TreeSHAP mathematical model inside browser.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUseBackend(true)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  useBackend
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs text-slate-200 mb-1">
                  <span>External Python REST API</span>
                  {useBackend && <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] text-cyan-300">ACTIVE</span>}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sends requests to your local/remote FastAPI or Flask service (e.g. scikit-learn / PyTorch).
                </p>
              </button>
            </div>
          </div>

          {/* Backend URL input if enabled */}
          {useBackend && (
            <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-300">
                Python Server Base URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {testing ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>Test /health</>
                  )}
                </button>
              </div>

              {testResult && (
                <div className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
                  testResult.success 
                    ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40' 
                    : 'bg-rose-900/30 text-rose-300 border border-rose-800/40'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold">{testResult.message}</span>
                    {!testResult.success && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        Note: The frontend runs gracefully on the built-in ML research engine until your Python API is connected.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Endpoints specification */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Supported REST Endpoints
            </h3>
            <div className="divide-y divide-slate-800/60 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs font-mono">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">POST</span>
                  <span className="text-slate-200">/api/predict</span>
                </div>
                <span className="text-[11px] font-sans text-slate-400">Single module inference + SHAP</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">POST</span>
                  <span className="text-slate-200">/api/predict-batch</span>
                </div>
                <span className="text-[11px] font-sans text-slate-400">CSV dataset batch risk scoring</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-400">GET</span>
                  <span className="text-slate-200">/api/model-performance</span>
                </div>
                <span className="text-[11px] font-sans text-slate-400">Accuracy, AUC, F1 benchmarks</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">POST</span>
                  <span className="text-slate-200">/api/explain</span>
                </div>
                <span className="text-[11px] font-sans text-slate-400">TreeSHAP waterfall breakdown</span>
              </div>
            </div>
          </div>

          {/* Python Starter Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code size={13} /> Python FastAPI Starter Template
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedSnippet ? 'Copied' : 'Copy snippet'}
              </button>
            </div>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-36">
              {fastApiCodeSnippet}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield size={13} className="text-cyan-400" />
            <span>Research Prototype • Fallback simulation ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

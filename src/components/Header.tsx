import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, User } from '../types';
import { Sparkles, Database, Server, Info, ShieldCheck, Terminal, User as UserIcon, LogOut, History, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApiSettings: () => void;
  isBackendConnected: boolean;
  currentUser: User | null;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiSettings,
  isBackendConnected,
  currentUser,
  onOpenProfile,
  onLogout
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Defect Prediction Dashboard',
      subtitle: 'Real-time telemetry, risk distribution, and high-risk module monitoring'
    },
    predict: {
      title: 'Single Module Defect Predictor',
      subtitle: 'Input software engineering metrics for immediate bug probability and risk factor analysis'
    },
    dataset: {
      title: 'Batch Dataset Analysis',
      subtitle: 'Upload CSV or evaluate standard NASA/Apache defect prediction benchmarks'
    },
    explainability: {
      title: 'SHAP Explainability & Feature Importance',
      subtitle: 'Interpret machine learning decision boundaries via Shapley additive contributions'
    },
    comparison: {
      title: 'Model Performance & Research Comparison',
      subtitle: 'Benchmark original research baseline against the proposed improved SMOTE-Ensemble model'
    },
    pipeline: {
      title: '10-Stage ML Research Pipeline',
      subtitle: 'End-to-end data ingestion, SMOTE balancing, feature selection, and ensemble modeling'
    },
    'feature-intelligence': {
      title: 'Feature Intelligence & Metric Ranking',
      subtitle: 'Mutual information, ANOVA F-value, and metric trade-off distribution analysis'
    },
    'release-risk': {
      title: 'Release Risk Drift & Build Comparison',
      subtitle: 'Multi-release defect velocity, risk migration, and release readiness gatekeeper'
    },
    'research-lab': {
      title: 'Research Lab & Empirical Ablation Study',
      subtitle: 'Configure experimental pipelines, test cross-validation folds, and inspect 5-stage ablation'
    },
    research: {
      title: 'Methodology & Research Architecture',
      subtitle: 'Theoretical foundation, class balancing empirical proofs, and peer benchmarks'
    },
    activity: {
      title: 'User Activity & Audit Log',
      subtitle: 'Chronological timeline of all defect predictions, dataset audits, and model experiments'
    },
    profile: {
      title: 'User Account & Profile Settings',
      subtitle: 'Manage research credentials, institutional affiliations, and security tokens'
    }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="border-b border-slate-800 bg-[#0D0D10] px-6 sm:px-8 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {current.title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-cyan-600/15 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30">
            <ShieldCheck size={13} />
            TreeSHAP Verified
          </span>
        </div>
        <p className="text-sm sm:text-[15px] text-slate-400 mt-1 leading-normal">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Prototype notice badge */}
        <div className="hidden xl:flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300">
          <Terminal size={14} className="text-cyan-400" />
          <span className="font-mono text-xs">NASA MDP Grounded</span>
        </div>

        {/* Quick Predict shortcut if not on predict tab */}
        {activeTab !== 'predict' && (
          <button
            type="button"
            onClick={() => setActiveTab('predict')}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3.5 py-2 text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles size={15} />
            <span>New Prediction</span>
          </button>
        )}

        {/* Quick CSV upload shortcut */}
        {activeTab !== 'dataset' && (
          <button
            type="button"
            onClick={() => setActiveTab('dataset')}
            className="hidden md:inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Database size={15} />
            <span>Analyze Dataset</span>
          </button>
        )}

        {/* API connection indicator */}
        <button
          type="button"
          onClick={onOpenApiSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 transition-colors cursor-pointer"
          title="Backend REST Configuration"
        >
          <span className={`h-2 w-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-400'}`} />
          <span className="font-mono text-xs hidden sm:inline">{isBackendConnected ? 'Python API: 8000' : 'Local ML Engine'}</span>
        </button>

        {/* Authenticated User Profile Dropdown */}
        {currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id="header-user-avatar-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 p-1.5 sm:pr-3 text-sm font-medium text-slate-200 transition-all cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-700 to-cyan-500 flex items-center justify-center font-mono font-bold text-sm text-white shadow-sm">
                {currentUser.avatarInitials || 'DR'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-bold text-slate-100 leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:inline ml-1" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-xl border border-slate-800 bg-[#111114] shadow-2xl shadow-black z-50 p-2 text-sm divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
                {/* User Header Summary */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[15px] truncate">{currentUser.name}</span>
                    <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</p>
                  {currentUser.organization && (
                    <p className="text-xs text-slate-400 truncate">{currentUser.organization}</p>
                  )}
                </div>

                {/* Dropdown Navigation Actions */}
                <div className="py-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left cursor-pointer font-medium"
                  >
                    <UserIcon size={16} className="text-cyan-400" />
                    <span>My Profile & Stats</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('activity');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition-colors text-left cursor-pointer font-medium"
                  >
                    <History size={16} className="text-emerald-400" />
                    <span>Activity History & Audit</span>
                  </button>
                </div>

                {/* Logout Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="header-logout-btn"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors text-left cursor-pointer font-semibold"
                  >
                    <LogOut size={16} className="text-rose-400" />
                    <span>Sign Out of Platform</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

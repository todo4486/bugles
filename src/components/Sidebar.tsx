import React from 'react';
import { ActiveTab, User } from '../types';
import { 
  LayoutDashboard, 
  Sparkles, 
  Database, 
  Sliders, 
  GitCompare, 
  BookOpen, 
  Shield, 
  Server, 
  Bug, 
  Activity,
  History,
  User as UserIcon,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isBackendConnected: boolean;
  onOpenApiSettings: () => void;
  currentUser: User | null;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isBackendConnected,
  onOpenApiSettings,
  currentUser,
  onOpenProfile,
  onLogout
}) => {
  const navSections: Array<{
    title: string;
    items: Array<{
      id: ActiveTab;
      label: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      badge?: string;
    }>;
  }> = [
    {
      title: 'Core Platform',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'predict', label: 'Predict Module', icon: Sparkles, badge: 'Live' },
        { id: 'dataset', label: 'Dataset & Health', icon: Database },
        { id: 'release-risk', label: 'Release Risk Drift', icon: Activity, badge: 'v1/v2' },
        { id: 'activity', label: 'Activity Audit', icon: History, badge: 'Logs' }
      ]
    },
    {
      title: 'Machine Learning & XAI',
      items: [
        { id: 'pipeline', label: 'Analysis Pipeline', icon: Shield, badge: '10-Stage' },
        { id: 'feature-intelligence', label: 'Feature Intelligence', icon: Sliders },
        { id: 'explainability', label: 'TreeSHAP Attribution', icon: Bug, badge: 'SHAP' },
        { id: 'comparison', label: 'Model Benchmarks', icon: GitCompare }
      ]
    },
    {
      title: 'Empirical Research',
      items: [
        { id: 'research-lab', label: 'Research Lab & Ablation', icon: Server, badge: '5-Stage' },
        { id: 'research', label: 'Methodology & Proofs', icon: BookOpen }
      ]
    }
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-slate-800 bg-[#111114] flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-5 py-4.5 border-b border-slate-800">
          <div className="w-9 h-9 bg-cyan-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md shadow-cyan-900/40 shrink-0">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">BugLens</span>
              <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30">
                RESEARCH
              </span>
            </div>
            <p className="text-[13px] text-slate-400 font-medium mt-0.5">Explainable Defect Intelligence</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3.5 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <div className="px-3 py-1.5 text-[13px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[15px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-200 font-semibold border-l-4 border-cyan-400 rounded-r-lg rounded-l-none shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon 
                        size={20} 
                        className={isActive ? 'text-cyan-400 shrink-0' : 'text-slate-400 shrink-0'} 
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold shrink-0 ml-2 ${
                        isActive 
                          ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40' 
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Card & Engine Status Footer */}
      <div className="p-3.5 border-t border-slate-800 space-y-3 bg-[#0D0D10]">
        {/* Logged in User Bar */}
        {currentUser && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 text-left min-w-0 flex-1 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <div className="h-9 w-9 rounded-lg bg-cyan-700/60 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm text-white shrink-0">
                {currentUser.avatarInitials || 'DR'}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold text-slate-100 block truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-xs font-mono text-cyan-400 block truncate mt-0.5">
                  {currentUser.role}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Model Pipeline Tag */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-[13px]">
            <span className="text-slate-400 font-medium">Model Pipeline:</span>
            <span className="font-mono text-cyan-400 font-bold">SMOTE + XGBoost</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-[13px]">
            <span className="text-slate-400 font-medium">Engine Mode:</span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-400'}`} />
              <span className="font-mono text-xs text-slate-300">
                {isBackendConnected ? 'Python API' : 'Browser ML'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenApiSettings}
            className="w-full mt-1.5 flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-750 py-2 px-3 text-xs sm:text-[13px] font-semibold text-slate-200 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
          >
            <Server size={14} className="text-cyan-400" />
            <span>Configure Backend API</span>
          </button>
        </div>

        {/* Prototype notice */}
        <div className="bg-slate-900/80 rounded-lg p-2 text-xs font-mono text-slate-400 uppercase tracking-wider font-bold text-center border border-slate-800/60">
          Experimental v2.4 • NASA MDP
        </div>
      </div>
    </aside>
  );
};

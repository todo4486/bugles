import React, { useState, useEffect } from 'react';
import { ActiveTab, SoftwareMetrics, DatasetAnalysisResult, PredictionResult, User } from './types';
import { getApiConfig, ApiConfig } from './services/api';
import { authService } from './services/authService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { PipelineView } from './views/PipelineView';
import { PredictView } from './views/PredictView';
import { DatasetAnalysisView } from './views/DatasetAnalysisView';
import { FeatureIntelligenceView } from './views/FeatureIntelligenceView';
import { ExplainabilityView } from './views/ExplainabilityView';
import { ModelComparisonView } from './views/ModelComparisonView';
import { ReleaseRiskView } from './views/ReleaseRiskView';
import { ResearchLabView } from './views/ResearchLabView';
import { ResearchView } from './views/ResearchView';
import { ActivityView } from './views/ActivityView';
import { Menu, X, Terminal, ShieldAlert } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // App Routing & Config
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [apiConfig, setApiConfigState] = useState<ApiConfig>(getApiConfig());
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-view state
  const [datasetAnalysis, setDatasetAnalysis] = useState<DatasetAnalysisResult | null>(null);
  const [selectedModuleForExplanation, setSelectedModuleForExplanation] = useState<{
    metrics: SoftwareMetrics;
    name: string;
  } | null>(null);

  // Subscribe to auth service state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsProfileOpen(false);
    setActiveTab('dashboard');
  };

  const handleSelectModuleForExplanation = (metrics: SoftwareMetrics, name: string) => {
    setSelectedModuleForExplanation({ metrics, name });
    setActiveTab('explainability');
  };

  // If user is not authenticated, render the dedicated AuthView (Login/Signup/Forgot Password)
  if (!currentUser) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-slate-200 antialiased font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Responsive drawer on mobile, sticky on desktop) */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          isBackendConnected={apiConfig.useBackendApi}
          onOpenApiSettings={() => {
            setIsApiModalOpen(true);
            setMobileMenuOpen(false);
          }}
          currentUser={currentUser}
          onOpenProfile={() => {
            setIsProfileOpen(true);
            setMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between border-b border-slate-800 bg-[#0D0D10] px-4 py-3 sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">BugLens</span>
            <span className="rounded bg-cyan-600/20 px-1.5 py-0.2 text-[9px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
              ML
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="h-6 w-6 rounded bg-cyan-600 font-mono text-xs font-bold text-white flex items-center justify-center"
            >
              {currentUser.avatarInitials || 'DR'}
            </button>
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="rounded-md border border-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800"
            >
              API
            </button>
          </div>
        </div>

        {/* Global Desktop Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenApiSettings={() => setIsApiModalOpen(true)}
          isBackendConnected={apiConfig.useBackendApi}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={handleLogout}
        />

        {/* Research Prototype Notice Banner */}
        <div className="bg-[#111114] border-b border-slate-800 px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-bold text-slate-200 text-xs sm:text-[13px] uppercase tracking-wider font-mono">
              Research Prototype:
            </span>
            <span className="text-xs sm:text-sm text-slate-400">
              Defect prediction model trained on NASA MDP & PROMISE datasets with exact TreeSHAP game-theoretic attribution.
            </span>
          </div>
          <div className="font-mono text-xs sm:text-[13px] text-slate-400 shrink-0">
            Version: <span className="text-cyan-400 font-bold">2.4-Ensemble</span>
          </div>
        </div>

        {/* Active Tab View Body */}
        <main className="flex-1 px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onSelectModuleForExplanation={handleSelectModuleForExplanation}
              datasetAnalysis={datasetAnalysis}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineView />
          )}

          {activeTab === 'predict' && (
            <PredictView
              onPredictionComplete={(pred) => {
                // Log activity
                authService.logActivity({
                  activityType: 'prediction',
                  title: 'Defect Prediction Evaluated',
                  target: pred.moduleName,
                  result: `${(pred.bugProbability * 100).toFixed(1)}% bug probability (${pred.riskLevel} risk)`,
                  status: pred.riskLevel === 'HIGH' ? 'HIGH_RISK' : pred.riskLevel === 'MEDIUM' ? 'MEDIUM_RISK' : 'LOW_RISK'
                });
                authService.incrementUserStat('predictionsCount');
              }}
              onNavigateToExplainability={(metrics, name) => {
                setSelectedModuleForExplanation({ metrics, name });
                setActiveTab('explainability');
              }}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetAnalysisView
              currentResult={datasetAnalysis}
              onAnalysisUpdate={(analysis) => {
                setDatasetAnalysis(analysis);
                if (analysis) {
                  authService.logActivity({
                    activityType: 'dataset',
                    title: 'Batch Dataset Analysis',
                    target: analysis.datasetName,
                    result: `${analysis.totalModules} modules analyzed (${analysis.defectiveCount} defective, ${analysis.defectPercentage}%)`,
                    status: 'SUCCESS'
                  });
                  authService.incrementUserStat('datasetsAnalyzedCount');
                }
              }}
              onSelectModuleForExplanation={handleSelectModuleForExplanation}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'feature-intelligence' && (
            <FeatureIntelligenceView />
          )}

          {activeTab === 'explainability' && (
            <ExplainabilityView
              selectedMetrics={selectedModuleForExplanation?.metrics || null}
              moduleName={selectedModuleForExplanation?.name || null}
            />
          )}

          {activeTab === 'comparison' && (
            <ModelComparisonView />
          )}

          {activeTab === 'release-risk' && (
            <ReleaseRiskView />
          )}

          {activeTab === 'research-lab' && (
            <ResearchLabView />
          )}

          {activeTab === 'research' && (
            <ResearchView />
          )}

          {activeTab === 'activity' && (
            <ActivityView setActiveTab={setActiveTab} />
          )}
        </main>
      </div>

      {/* User Profile & Account Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUserUpdated={(updatedUser) => setCurrentUser(updatedUser)}
        onLogout={handleLogout}
      />

      {/* Backend API Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onConfigChange={(newConfig) => setApiConfigState(newConfig)}
      />
    </div>
  );
}

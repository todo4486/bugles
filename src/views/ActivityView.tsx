import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Sparkles, 
  Database, 
  FlaskConical, 
  GitCompare, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { authService } from '../services/authService';
import { UserActivity, ActiveTab } from '../types';

interface ActivityViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({ setActiveTab }) => {
  const [activities, setActivities] = useState<UserActivity[]>(authService.getUserActivities());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PREDICTION' | 'DATASET' | 'EXPERIMENT' | 'AUTH'>('ALL');

  const handleClearHistory = () => {
    authService.clearActivities();
    setActivities([]);
  };

  const handleRefresh = () => {
    setActivities(authService.getUserActivities());
  };

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.result.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PREDICTION') return act.activityType === 'prediction';
    if (selectedFilter === 'DATASET') return act.activityType === 'dataset';
    if (selectedFilter === 'EXPERIMENT') return act.activityType === 'experiment';
    if (selectedFilter === 'AUTH') return act.activityType === 'auth';

    return true;
  });

  const getActivityIcon = (type: UserActivity['activityType']) => {
    switch (type) {
      case 'prediction':
        return <Sparkles size={14} className="text-cyan-400" />;
      case 'dataset':
        return <Database size={14} className="text-emerald-400" />;
      case 'experiment':
        return <FlaskConical size={14} className="text-purple-400" />;
      case 'comparison':
        return <GitCompare size={14} className="text-amber-400" />;
      case 'auth':
        return <ShieldCheck size={14} className="text-blue-400" />;
      default:
        return <Info size={14} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: UserActivity['status']) => {
    switch (status) {
      case 'HIGH_RISK':
        return (
          <span className="rounded bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300">
            High Risk
          </span>
        );
      case 'MEDIUM_RISK':
        return (
          <span className="rounded bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
            Medium Risk
          </span>
        );
      case 'LOW_RISK':
        return (
          <span className="rounded bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
            Low Risk
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="rounded bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
            Completed
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            Info
          </span>
        );
    }
  };

  const navigateFromActivity = (type: UserActivity['activityType']) => {
    if (type === 'prediction') setActiveTab('predict');
    else if (type === 'dataset') setActiveTab('dataset');
    else if (type === 'experiment') setActiveTab('research-lab');
    else if (type === 'comparison') setActiveTab('comparison');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Overview */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              User Activity & Research Audit Trail
            </h2>
            <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
              Audit Log
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-3xl">
            Real-time chronological timeline tracking all software defect predictions, dataset evaluations, ablation benchmarks, and authentication sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0A0A0B] hover:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Refresh</span>
          </button>

          {activities.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-900/40 bg-rose-950/20 hover:bg-rose-900/40 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear Audit Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by module, dataset, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] pl-9 pr-3.5 py-1.5 text-xs font-medium text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Activity Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mr-1">
              Filter:
            </span>
            {(['ALL', 'PREDICTION', 'DATASET', 'EXPERIMENT', 'AUTH'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setSelectedFilter(filterKey)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedFilter === filterKey
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-[#0A0A0B] text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {filterKey === 'ALL' ? 'All Activities'
                  : filterKey === 'PREDICTION' ? 'Predictions'
                  : filterKey === 'DATASET' ? 'Datasets'
                  : filterKey === 'EXPERIMENT' ? 'Experiments'
                  : 'Auth Sessions'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="rounded-xl border border-slate-800 bg-[#111114] overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <History size={14} className="text-cyan-400" />
            Recorded Events ({filteredActivities.length})
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Persisted in Local Storage (Demo Mode)
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <History size={24} className="mx-auto text-slate-600" />
            <p className="text-xs font-semibold text-slate-300">No activity records found</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search query or filter selection.' : 'Perform a prediction, analyze a dataset, or run an experiment to log activity.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0D0D10] font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Activity Type</th>
                  <th className="py-3 px-4">Target / Software Module</th>
                  <th className="py-3 px-4">Outcome / Evaluation Result</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {act.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-medium text-slate-200">
                        {getActivityIcon(act.activityType)}
                        <span>{act.title}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-cyan-300 font-medium">
                      {act.target}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {act.result}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(act.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {act.activityType !== 'auth' && (
                        <button
                          type="button"
                          onClick={() => navigateFromActivity(act.activityType)}
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                        >
                          <span>Open</span>
                          <ArrowUpRight size={11} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

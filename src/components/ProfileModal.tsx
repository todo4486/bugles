import React, { useState } from 'react';
import { 
  User as UserIcon, 
  X, 
  Mail, 
  Building, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  Database, 
  FlaskConical, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Save,
  RotateCcw
} from 'lucide-react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (user: User) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'security'>('overview');

  // Edit fields
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'Researcher');

  // Security fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const updated = await authService.updateProfile({
        name: name.trim(),
        organization: organization.trim(),
        role: role
      });
      onUserUpdated(updated);
      setSuccessMsg('Profile updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changePassword(oldPassword, newPassword);
      setSuccessMsg(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#111114] shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-[#0D0D10]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold font-mono text-sm">
              {user.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{user.name}</h3>
                <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[10px] font-mono text-cyan-400 font-bold border border-cyan-500/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0A0A0B] px-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Account Security
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Feedback Messages */}
          {errorMsg && (
            <div className="rounded-lg bg-rose-950/40 border border-rose-800/60 p-3 flex items-start gap-2 text-xs text-rose-200">
              <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-3 flex items-start gap-2 text-xs text-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* User Metadata Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Building size={11} className="text-cyan-400" />
                    <span>Organization / Institution</span>
                  </span>
                  <p className="font-semibold text-slate-200">
                    {user.organization || 'Independent Research Laboratory'}
                  </p>
                </div>

                <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar size={11} className="text-cyan-400" />
                    <span>Account Registered</span>
                  </span>
                  <p className="font-semibold text-slate-200 font-mono">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Research Statistics Cards */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Platform Activity & Metrics
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-[#0A0A0B] p-4 text-center space-y-1">
                    <Activity size={18} className="mx-auto text-cyan-400" />
                    <span className="text-2xl font-bold font-mono text-white block">
                      {user.stats.predictionsCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Module Predictions
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0A0A0B] p-4 text-center space-y-1">
                    <Database size={18} className="mx-auto text-emerald-400" />
                    <span className="text-2xl font-bold font-mono text-white block">
                      {user.stats.datasetsAnalyzedCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Datasets Analyzed
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0A0A0B] p-4 text-center space-y-1">
                    <FlaskConical size={18} className="mx-auto text-purple-400" />
                    <span className="text-2xl font-bold font-mono text-white block">
                      {user.stats.experimentsCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Experiments Run
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Status Box */}
              <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Session Protected</span>
                    <span className="text-[11px] text-slate-400">Authenticated in Demo Mode with full research capabilities.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="rounded-lg border border-cyan-700/50 bg-cyan-900/30 hover:bg-cyan-800/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Organization / University / Lab
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Primary Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Researcher">Researcher</option>
                  <option value="Student">Student</option>
                  <option value="Developer">Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="rounded-lg border border-slate-800 bg-[#0A0A0B] hover:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <RotateCcw size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="rounded-lg bg-[#0A0A0B] border border-slate-800 p-3 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Password Management (Demo Mode)</span>
                <p>Update your local session password credentials. Must be at least 8 characters.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0A0A0B] px-3.5 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="rounded-lg border border-slate-800 bg-[#0A0A0B] hover:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <RotateCcw size={13} className="animate-spin" />
                  ) : (
                    <Lock size={13} />
                  )}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer with Logout Action */}
        <div className="border-t border-slate-800 bg-[#0D0D10] p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="rounded-lg border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-[#0A0A0B] hover:bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Sliders, 
  Terminal,
  FlaskConical,
  RotateCcw
} from 'lucide-react';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('Researcher');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password form state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearErrors = () => {
    setErrorMessage(null);
    setResetSuccessMessage(null);
  };

  const handleModeChange = (newMode: AuthMode) => {
    clearErrors();
    setMode(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.login({
        email: loginEmail,
        password: loginPassword,
        rememberMe
      });
      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email address or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    clearErrors();
    setIsLoading(true);
    try {
      const user = await authService.loginDemo();
      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate demo account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        role: signupRole,
        organization: signupOrg,
        agreeTerms
      });
      onAuthSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resetPassword(resetEmail);
      setResetSuccessMessage(result.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-64 bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#111114] shadow-2xl shadow-black/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* Left Side: Brand Identity & Methodology Visuals */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#141418] via-[#111115] to-[#0D0D10] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Background Circuit Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/40 shrink-0">
                <ShieldCheck size={26} className="text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-white">BugLens</span>
                  <span className="rounded bg-cyan-600/25 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40">
                    RESEARCH AI
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Explainable Defect Intelligence</p>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Explainable AI for Mission-Critical Software Quality
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-300 mt-2.5 leading-relaxed">
                Empirical machine learning platform combining SMOTE class balancing, mutual information pruning, soft-voting gradient ensembles, and TreeSHAP game-theoretic attribution.
              </p>
            </div>

            {/* Methodology Flow Badge */}
            <div className="pt-2">
              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <Terminal size={14} />
                  Scientific Methodology Pipeline
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-[13px] text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>Analyze Metrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>Predict Probability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>Explain with SHAP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>Actionable Fixes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Credibility Stats */}
          <div className="relative pt-6 border-t border-slate-800 mt-6 space-y-3.5">
            <div className="grid grid-cols-2 gap-3.5 text-left">
              <div className="rounded-xl bg-[#0A0A0B]/80 border border-slate-800 p-3">
                <span className="text-xs font-mono text-slate-400 block">Proposed F1</span>
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">0.888 (+26.3%)</span>
              </div>
              <div className="rounded-xl bg-[#0A0A0B]/80 border border-slate-800 p-3">
                <span className="text-xs font-mono text-slate-400 block">Model ROC-AUC</span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">0.948 (NASA KC1)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>NASA MDP & PROMISE Benchmarks</span>
              <span className="text-cyan-400 font-bold">v2.4 Ready</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Authentication Forms */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#111114]">
          
          {/* Top Mode Header / Tabs */}
          <div className="mb-7 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                {mode === 'login' ? 'Authentication Portal' : mode === 'signup' ? 'Researcher Registration' : 'Account Recovery'}
              </span>

              {/* Demo Mode Notice Badge */}
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Mode: <strong className="text-slate-300">Demo Prototype</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create your BugLens account'}
              {mode === 'forgot-password' && 'Reset your password'}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              {mode === 'login' && 'Sign in to continue analyzing software quality and inspecting defect telemetry.'}
              {mode === 'signup' && 'Register to evaluate NASA MDP benchmarks, train custom ensembles, and explain defects.'}
              {mode === 'forgot-password' && 'Enter your registered email address to receive password recovery instructions.'}
            </p>
          </div>

          {/* Quick Demo Access Button (Only on Login mode) */}
          {mode === 'login' && (
            <div className="mb-6 rounded-xl border border-cyan-800/50 bg-cyan-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-cyan-300">
                  <Sparkles size={18} className="text-cyan-400" />
                  <span>One-Click Academic Demo</span>
                </div>
                <p className="text-sm text-slate-300">
                  Instantly authenticate as <strong className="text-white">Demo Researcher</strong> (demo@buglens.app).
                </p>
              </div>

              <button
                type="button"
                id="btn-demo-login"
                disabled={isLoading}
                onClick={handleDemoLogin}
                className="shrink-0 h-12 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 text-sm sm:text-base font-bold text-white shadow-md shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RotateCcw size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Try Demo Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-5 rounded-xl bg-rose-950/50 border border-rose-800/80 p-4 flex items-start gap-3 text-sm text-rose-200">
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert Box */}
          {resetSuccessMessage && (
            <div className="mb-5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 p-4 flex items-start gap-3 text-sm text-emerald-200">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-base block">Instructions Dispatched</span>
                <span className="text-slate-200 text-sm">{resetSuccessMessage}</span>
              </div>
            </div>
          )}

          {/* FORM 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                  <Mail size={16} className="text-cyan-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="login-email"
                  required
                  placeholder="e.g. demo@buglens.app or researcher@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-12 sm:h-[50px] rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Lock size={16} className="text-cyan-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot-password')}
                    className="text-sm sm:text-[15px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-12 sm:h-[50px] rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 pr-12 text-base font-medium text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-sm sm:text-[15px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-[#0A0A0B] text-cyan-600 focus:ring-0"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                disabled={isLoading}
                className="w-full h-12 sm:h-[52px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-base sm:text-lg font-bold text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs font-mono uppercase tracking-wider">
                  <span className="bg-[#111114] px-3 text-slate-400">New to BugLens?</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-goto-signup"
                onClick={() => handleModeChange('signup')}
                className="w-full h-12 sm:h-[50px] rounded-xl border border-slate-700 bg-[#0A0A0B] hover:bg-slate-900 text-sm sm:text-base font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                Create Researcher Account
              </button>
            </form>
          )}

          {/* FORM 2: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <UserIcon size={16} className="text-cyan-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Mail size={16} className="text-cyan-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane.doe@university.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Building size={16} className="text-cyan-400" />
                    <span>Organization / College</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MIT CS Department"
                    value={signupOrg}
                    onChange={(e) => setSignupOrg(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Cpu size={16} className="text-cyan-400" />
                    <span>Role *</span>
                  </label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Researcher">Researcher</option>
                    <option value="Student">Student</option>
                    <option value="Developer">Developer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Lock size={16} className="text-cyan-400" />
                    <span>Password (min 8 chars) *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                    <Lock size={16} className="text-cyan-400" />
                    <span>Confirm Password *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#0A0A0B] text-cyan-600 focus:ring-0 mt-1"
                />
                <span>
                  I agree to the <span className="text-cyan-400 font-semibold underline">Terms of Service</span> and acknowledge empirical defect research protocols.
                </span>
              </label>

              <button
                type="submit"
                id="btn-submit-signup"
                disabled={isLoading}
                className="w-full h-12 sm:h-[52px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-base sm:text-lg font-bold text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Researcher Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-sm sm:text-[15px] text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Already have an account? <strong className="text-white underline">Sign In</strong>
                </button>
              </div>
            </form>
          )}

          {/* FORM 3: FORGOT PASSWORD */}
          {mode === 'forgot-password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm sm:text-[15px] font-semibold text-slate-200 flex items-center gap-2">
                  <Mail size={16} className="text-cyan-400" />
                  <span>Your Registered Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. researcher@university.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full h-12 sm:h-[50px] rounded-xl border border-slate-700 bg-[#0A0A0B] px-4 text-base font-medium text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-[#0A0A0B] border border-slate-800 p-4 text-sm text-slate-300 space-y-1.5">
                <span className="font-bold text-slate-100 text-base block">Simulated Password Reset (Demo Mode)</span>
                <p className="leading-relaxed">
                  In this prototype environment, clicking the button below will immediately simulate the password reset dispatcher workflow.
                </p>
              </div>

              <button
                type="submit"
                id="btn-submit-reset"
                disabled={isLoading}
                className="w-full h-12 sm:h-[52px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-base sm:text-lg font-bold text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RotateCcw size={18} className="animate-spin" />
                    <span>Dispatching Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-sm sm:text-[15px] text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Remembered your password? <strong className="text-white underline">Back to Sign In</strong>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs sm:text-sm text-slate-400 font-mono flex items-center gap-4">
        <span>BugLens v2.4</span>
        <span>•</span>
        <span>Explainable Defect Intelligence</span>
        <span>•</span>
        <span>NASA MDP JM1/KC1</span>
      </div>
    </div>
  );
};

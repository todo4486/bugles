import { User, LoginCredentials, SignupCredentials, UserActivity, UserRole } from '../types';

const STORAGE_KEY_USERS = 'buglens_users_db_v1';
const STORAGE_KEY_AUTH_USER = 'buglens_current_user_v1';
const STORAGE_KEY_ACTIVITIES = 'buglens_activities_v1';

const DEFAULT_DEMO_USER: User = {
  id: 'usr-demo-001',
  name: 'Demo Researcher',
  email: 'demo@buglens.app',
  role: 'Researcher',
  organization: 'Aviation Software Lab & NASA MDP Institute',
  createdAt: '2024-09-15T09:30:00Z',
  avatarInitials: 'DR',
  stats: {
    predictionsCount: 48,
    datasetsAnalyzedCount: 12,
    experimentsCount: 29
  }
};

const SEED_ACTIVITIES: UserActivity[] = [
  {
    id: 'act-001',
    timestamp: 'Today, 11:42 AM',
    activityType: 'prediction',
    title: 'Defect Prediction Evaluated',
    target: 'FlightControlModule.cpp (LOC: 840)',
    result: 'High Risk — 87.4% (TreeSHAP Conf: 91%)',
    status: 'HIGH_RISK'
  },
  {
    id: 'act-002',
    timestamp: 'Today, 10:18 AM',
    activityType: 'dataset',
    title: 'Batch Dataset Health Analysis',
    target: 'NASA KC1 Avionics Dataset',
    result: '2,107 modules analyzed • 96.4 Quality Score',
    status: 'SUCCESS'
  },
  {
    id: 'act-003',
    timestamp: 'Yesterday, 4:55 PM',
    activityType: 'experiment',
    title: 'Empirical Ablation Experiment',
    target: 'Stage 5: SMOTE + MI + Soft Voting Ensemble',
    result: 'F1: 0.888 (+26.3% vs Baseline)',
    status: 'SUCCESS'
  },
  {
    id: 'act-004',
    timestamp: 'Yesterday, 2:30 PM',
    activityType: 'prediction',
    title: 'Defect Prediction Evaluated',
    target: 'SensorTelemetryParser.java (LOC: 120)',
    result: 'Low Risk — 14.2% (Safe to deploy)',
    status: 'LOW_RISK'
  },
  {
    id: 'act-005',
    timestamp: '3 days ago',
    activityType: 'comparison',
    title: 'Model Benchmarking Execution',
    target: 'Baseline LR+C4.5 vs Proposed Ensemble',
    result: 'ROC-AUC: 0.948 (Wilcoxon p < 0.001)',
    status: 'SUCCESS'
  },
  {
    id: 'act-006',
    timestamp: '4 days ago',
    activityType: 'auth',
    title: 'Session Authenticated',
    target: 'Demo Account Portal',
    result: 'OAuth Token Generated (Demo Mode)',
    status: 'INFO'
  }
];

class AuthService {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.initStorage();
    this.loadCurrentUser();
  }

  private initStorage() {
    try {
      if (typeof window === 'undefined') return;

      // Seed default users if not present
      const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
      if (!usersRaw) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([DEFAULT_DEMO_USER]));
      }

      // Seed activities if not present
      const activitiesRaw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (!activitiesRaw) {
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
      }
    } catch (e) {
      console.warn('LocalStorage error during AuthService initialization:', e);
    }
  }

  private loadCurrentUser() {
    try {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse current user from storage:', e);
      this.currentUser = null;
    }
  }

  private saveCurrentUser(user: User | null) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch (e) {
      console.warn('Failed to write current user to storage:', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  private generateInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name.substring(0, 2) || 'US').toUpperCase();
  }

  // Simulated Login
  public async login(credentials: LoginCredentials): Promise<User> {
    // Artificial slight network latency for realistic UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const email = credentials.email.trim().toLowerCase();

    // Check if demo user
    if (email === 'demo@buglens.app' || email === 'demo' || email === 'researcher@buglens.app') {
      this.saveCurrentUser(DEFAULT_DEMO_USER);
      this.logActivity({
        activityType: 'auth',
        title: 'User Signed In',
        target: 'Demo Account',
        result: 'Authentication token verified',
        status: 'SUCCESS'
      });
      return DEFAULT_DEMO_USER;
    }

    // Check stored users
    try {
      const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [DEFAULT_DEMO_USER];
      const match = users.find(u => u.email.toLowerCase() === email);

      if (match) {
        this.saveCurrentUser(match);
        this.logActivity({
          activityType: 'auth',
          title: 'User Signed In',
          target: match.email,
          result: 'Session started successfully',
          status: 'SUCCESS'
        });
        return match;
      }
    } catch (e) {
      console.warn('Error querying user registry:', e);
    }

    // Fallback: If password provided and email looks valid, authenticate as dynamic user
    if (email.includes('@')) {
      const nameFromEmail = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Software Engineer';

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: nameFromEmail,
        email: email,
        role: 'Developer',
        organization: 'Independent Research',
        createdAt: new Date().toISOString(),
        avatarInitials: this.generateInitials(nameFromEmail),
        stats: {
          predictionsCount: 3,
          datasetsAnalyzedCount: 1,
          experimentsCount: 2
        }
      };

      this.saveUserToRegistry(newUser);
      this.saveCurrentUser(newUser);
      this.logActivity({
        activityType: 'auth',
        title: 'User Signed In',
        target: newUser.email,
        result: 'Session started successfully',
        status: 'SUCCESS'
      });
      return newUser;
    }

    throw new Error('Invalid email address or credentials. Use demo@buglens.app or create an account.');
  }

  // Quick Demo Account Login
  public async loginDemo(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 350));
    this.saveCurrentUser(DEFAULT_DEMO_USER);
    this.logActivity({
      activityType: 'auth',
      title: 'Demo Session Activated',
      target: 'demo@buglens.app',
      result: 'Full research platform access granted',
      status: 'INFO'
    });
    return DEFAULT_DEMO_USER;
  }

  // Simulated Signup
  public async signup(data: SignupCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 750));

    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Full Name must be at least 2 characters.');
    }
    if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
      throw new Error('A valid email address is required.');
    }
    if (data.password && data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error('Password confirmation does not match.');
    }
    if (data.agreeTerms === false) {
      throw new Error('You must agree to the Terms and Privacy Policy to create an account.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role || 'Developer',
      organization: data.organization?.trim() || 'Software Engineering Lab',
      createdAt: new Date().toISOString(),
      avatarInitials: this.generateInitials(data.name),
      stats: {
        predictionsCount: 0,
        datasetsAnalyzedCount: 0,
        experimentsCount: 0
      }
    };

    this.saveUserToRegistry(newUser);
    this.saveCurrentUser(newUser);
    this.logActivity({
      activityType: 'auth',
      title: 'Account Created',
      target: newUser.name,
      result: `Registered as ${newUser.role}`,
      status: 'SUCCESS'
    });

    return newUser;
  }

  // Logout
  public async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (this.currentUser) {
      this.logActivity({
        activityType: 'auth',
        title: 'User Signed Out',
        target: this.currentUser.email,
        result: 'Session terminated',
        status: 'INFO'
      });
    }
    this.saveCurrentUser(null);
  }

  // Password Recovery (Simulated)
  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    this.logActivity({
      activityType: 'auth',
      title: 'Password Reset Requested',
      target: cleanEmail,
      result: 'Reset link simulated in demo mode',
      status: 'INFO'
    });

    return {
      success: true,
      message: `Password reset instructions have been sent to ${cleanEmail}. (Demo Mode: Reset token simulated).`
    };
  }

  // Profile Update
  public async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in.');
    }

    const updated: User = {
      ...this.currentUser,
      ...updates,
      avatarInitials: updates.name ? this.generateInitials(updates.name) : this.currentUser.avatarInitials
    };

    this.saveUserToRegistry(updated);
    this.saveCurrentUser(updated);
    this.logActivity({
      activityType: 'auth',
      title: 'Profile Updated',
      target: updated.name,
      result: 'User metadata refreshed',
      status: 'SUCCESS'
    });

    return updated;
  }

  // Change Password
  public async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters.');
    }

    this.logActivity({
      activityType: 'auth',
      title: 'Password Changed',
      target: this.currentUser?.email || 'User Account',
      result: 'Security credentials updated (Simulated)',
      status: 'SUCCESS'
    });

    return {
      success: true,
      message: 'Your password has been changed successfully.'
    };
  }

  // Activity Logging & Management
  public getUserActivities(): UserActivity[] {
    try {
      if (typeof window === 'undefined') return SEED_ACTIVITIES;
      const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read activities:', e);
    }
    return SEED_ACTIVITIES;
  }

  public logActivity(item: Omit<UserActivity, 'id' | 'timestamp'> & { timestamp?: string }) {
    const newActivity: UserActivity = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: item.timestamp || 'Just now',
      activityType: item.activityType,
      title: item.title,
      target: item.target,
      result: item.result,
      status: item.status
    };

    try {
      const current = this.getUserActivities();
      const updated = [newActivity, ...current.slice(0, 99)]; // retain last 100
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));

      // Update user stats if relevant
      if (this.currentUser) {
        const stats = { ...this.currentUser.stats };
        if (item.activityType === 'prediction') stats.predictionsCount += 1;
        if (item.activityType === 'dataset') stats.datasetsAnalyzedCount += 1;
        if (item.activityType === 'experiment') stats.experimentsCount += 1;

        const updatedUser = { ...this.currentUser, stats };
        this.currentUser = updatedUser;
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(updatedUser));
        this.saveUserToRegistry(updatedUser);
      }
    } catch (e) {
      console.warn('Failed to save activity log:', e);
    }
  }

  public incrementUserStat(statKey: keyof User['stats'], amount: number = 1): void {
    if (!this.currentUser) return;
    const stats = { ...this.currentUser.stats };
    stats[statKey] = (stats[statKey] || 0) + amount;

    const updatedUser = { ...this.currentUser, stats };
    this.saveCurrentUser(updatedUser);
    this.saveUserToRegistry(updatedUser);
  }

  public clearActivities(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear activities:', e);
    }
  }

  private saveUserToRegistry(user: User) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS);
      const users: User[] = raw ? JSON.parse(raw) : [DEFAULT_DEMO_USER];
      const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());

      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to write to user registry:', e);
    }
  }
}

export const authService = new AuthService();

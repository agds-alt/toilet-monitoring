// Session Management - 7 days persistence
export interface UserSession {
  user: {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
  };
  token: string;
  expiresAt: number;
}

export class SessionManager {
  private static readonly SESSION_KEY = 'toilet_checklist_session';
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  static setSession(user: UserSession['user'], token: string): void {
    const session: UserSession = {
      user,
      token,
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }

  static getSession(): UserSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session: UserSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      this.clearSession();
      return null;
    }
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    const session = this.getSession();
    return session !== null && session.user.isActive;
  }

  static getCurrentUser(): UserSession['user'] | null {
    const session = this.getSession();
    return session?.user || null;
  }

  static refreshSession(): boolean {
    const session = this.getSession();
    if (!session) return false;

    // Extend session by 7 days
    session.expiresAt = Date.now() + this.SESSION_DURATION;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return true;
  }
}

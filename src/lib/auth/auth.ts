// Authentication Service
import { SessionManager } from './session';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export class AuthService {
  // Mock user database - in real app this would be Supabase
  private static mockUsers = [
    {
      id: '1',
      email: 'admin@toilet.com',
      password: 'admin123',
      fullName: 'Admin Toilet',
      isActive: true
    },
    {
      id: '2',
      email: 'cleaner@toilet.com',
      password: 'cleaner123',
      fullName: 'Cleaner Staff',
      isActive: true
    },
    {
      id: '3',
      email: 'inspector@toilet.com',
      password: 'inspector123',
      fullName: 'Inspector Team',
      isActive: true
    }
  ];

  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = this.mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        return { success: false, error: 'Email atau password salah' };
      }

      if (!user.isActive) {
        return { success: false, error: 'Akun tidak aktif' };
      }

      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;

      // Set session
      SessionManager.setSession({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive
      }, token);

      return { 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isActive: user.isActive
        }
      };
    } catch (error) {
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  }

  static async signup(data: SignupData): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = this.mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'Email sudah terdaftar' };
      }

      // Create new user
      const newUser = {
        id: (this.mockUsers.length + 1).toString(),
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        isActive: true
      };

      this.mockUsers.push(newUser);

      // Generate mock token
      const token = `mock_token_${newUser.id}_${Date.now()}`;

      // Set session
      SessionManager.setSession({
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        isActive: newUser.isActive
      }, token);

      return { 
        success: true, 
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          isActive: newUser.isActive
        }
      };
    } catch (error) {
      return { success: false, error: 'Terjadi kesalahan saat registrasi' };
    }
  }

  static logout(): void {
    SessionManager.clearSession();
  }

  static getCurrentUser() {
    return SessionManager.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return SessionManager.isAuthenticated();
  }
}

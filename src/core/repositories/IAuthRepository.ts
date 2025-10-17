// src/core/repositories/IAuthRepository.ts
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<{ userId: string; session: any }>;
  signUp(email: string, password: string, fullName: string, role: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentSession(): Promise<{ userId: string } | null>;
  onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void };
}

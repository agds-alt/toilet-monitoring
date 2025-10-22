// 📁 src/core/repositories/IUserRepository.ts
import { User, UserWithRoles } from '@/core/entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  getUserWithRoles(userId: string): Promise<UserWithRoles | null>;
  updateLastLogin(userId: string): Promise<void>;
}

// ===================================
// 📁 5. src/core/repositories/IUserRepository.ts
// ===================================

// ============================================================================
// INTERFACE
// ============================================================================
import { UserEntity } from '../entities/User';
import { User } from '@/core/types/interfaces';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: User): Promise<UserEntity>;
  update(id: string, data: Partial<User>): Promise<UserEntity>;
}
// ============================================================================
// END INTERFACE
// ============================================================================
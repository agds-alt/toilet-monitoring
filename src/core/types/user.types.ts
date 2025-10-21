// src/core/types/user.types.ts
import { 
  User as DBUser, 
  UserInsert as DBUserInsert, 
  UserUpdate as DBUserUpdate, 
  Role,
  UserRole as DBUserRole
} from './database.types';

// Export renamed to avoid conflicts
export type { DBUserInsert as UserInsert, DBUserUpdate as UserUpdate, Role };

// Extended User type with role
export interface User extends DBUser {
  role?: string;
  roles?: Role[];
}

export type RoleLevel = 'super_admin' | 'admin' | 'supervisor' | 'team_leader' | 'cleaner';

export interface UserWithRoles extends User {
  primaryRole?: Role;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  phone?: string | null;
  profilePhotoUrl?: string | null;
}

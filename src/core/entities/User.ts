// ===================================
// 📁 3. src/core/entities/User.ts
// ===================================

import { UserRole } from '../types/enums';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly role: UserRole,
    public readonly createdAt: Date
  ) {}

  isStaff(): boolean {
    return this.role === UserRole.STAFF;
  }

  isMedical(): boolean {
    return this.role === UserRole.MEDICAL;
  }

  isCleaner(): boolean {
    return this.role === UserRole.CLEANER;
  }

  canCreateInspection(): boolean {
    return true; // All roles can create inspections
  }

  canViewReports(): boolean {
    return this.role === UserRole.CLEANER || this.role === UserRole.MEDICAL;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}

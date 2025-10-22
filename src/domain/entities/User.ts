// Domain Entity: User
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profilePhotoUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly phone: string | undefined,
    public readonly profilePhotoUrl: string | undefined,
    public readonly isActive: boolean,
    public readonly lastLoginAt: Date | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): UserEntity {
    const now = new Date();
    return new UserEntity(
      crypto.randomUUID(),
      data.email,
      data.fullName,
      data.phone,
      data.profilePhotoUrl,
      data.isActive,
      data.lastLoginAt,
      now,
      now
    );
  }

  updateProfile(updates: Partial<Pick<User, 'fullName' | 'phone' | 'profilePhotoUrl'>>): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      updates.fullName ?? this.fullName,
      updates.phone ?? this.phone,
      updates.profilePhotoUrl ?? this.profilePhotoUrl,
      this.isActive,
      this.lastLoginAt,
      this.createdAt,
      new Date()
    );
  }
}

// src/core/repositories/IInspectionRepository.ts
import { Inspection } from '@/core/types/interfaces';
// import { InspectionEntity } from '@/core/entities/Inspection';
// import { GetInspectionHistoryDTO } from '@/core/use-cases/GetInspectionHistory';

export interface IInspectionRepository {
  create(inspection: Inspection): Promise<InspectionEntity>;
  findById(id: string): Promise<InspectionEntity | null>;
  findMany(filters: any): Promise<InspectionEntity[]>;
  update(id: string, data: Partial<Inspection>): Promise<InspectionEntity>;
  delete(id: string): Promise<void>;
}

// src/core/repositories/IUserRepository.ts
import { User } from '@/core/types/interfaces';
// import { UserEntity } from '@/core/entities/User';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: User): Promise<UserEntity>;
  update(id: string, data: Partial<User>): Promise<UserEntity>;
}

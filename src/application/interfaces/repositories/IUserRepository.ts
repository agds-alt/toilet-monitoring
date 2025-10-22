// Repository Interface: IUserRepository
import { UserEntity } from '../../../domain/entities/User';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}

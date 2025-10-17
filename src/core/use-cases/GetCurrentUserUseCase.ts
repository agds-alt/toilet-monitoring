// src/core/use-cases/GetCurrentUserUseCase.ts
import { IAuthRepository } from '../repositories/IAuthRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { UserEntity } from '../entities/User';

export class GetCurrentUserUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserEntity | null> {
    try {
      const session = await this.authRepository.getCurrentSession();
      if (!session) return null;

      const user = await this.userRepository.findById(session.userId);
      return user;
    } catch (error) {
      console.error('GetCurrentUserUseCase error:', error);
      return null;
    }
  }
}

// Use Case: LoginUser
import { UserEntity } from '../../../domain/entities/User';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  user: UserEntity;
  token: string;
}

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    // This would typically integrate with Supabase Auth
    // For now, we'll assume the authentication is handled externally
    // and we just need to get the user data
    
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // In a real implementation, you would get the token from Supabase Auth
    const token = 'mock-jwt-token'; // This should come from Supabase Auth

    return {
      user,
      token
    };
  }
}

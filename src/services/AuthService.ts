import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string
  ) {}

  async registerUser(userData: any): Promise<any> {
    const hashedPassword = await hash(userData.password, 10);
    return this.userRepository.createWithWebsite(
      { ...userData, passwordHash: hashedPassword },
      { domain: userData.domain, verificationCode: `google-${crypto.randomUUID()}` }
    );
  }
}
import { User } from '../../domain/entities/User.js';
import { ConflictError } from '../../domain/errors/DomainError.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { PasswordHasher } from '../../domain/services/PasswordHasher.js';

export interface RegisterUserInput {
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    User.validatePassword(input.password);
    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = new User({ email: input.email, passwordHash });
    // La unicidad real la garantiza el índice único de la BD; esto da el mensaje amable.
    if (await this.userRepository.findByEmail(user.email)) {
      throw new ConflictError('Ese email ya está en uso');
    }
    return this.userRepository.create(user);
  }
}

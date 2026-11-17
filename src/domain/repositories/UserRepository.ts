import type { User } from '../entities/User.js';

/** Contrato de persistencia de usuarios, definido por el dominio. */
export interface UserRepository {
  /** Recibe el email ya normalizado (minúsculas, sin espacios). */
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

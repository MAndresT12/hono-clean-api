import { User } from '../../src/domain/entities/User.js';
import type { UserRepository } from '../../src/domain/repositories/UserRepository.js';

/** Test double: implementa el contrato del dominio sin tocar la BD real. */
export class InMemoryUserRepository implements UserRepository {
  private readonly rows = new Map<number, User>();
  private nextId = 1;

  async findByEmail(email: string): Promise<User | null> {
    return [...this.rows.values()].find((u) => u.email === email) ?? null;
  }

  async create(user: User): Promise<User> {
    const id = this.nextId++;
    const saved = new User({
      id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
    this.rows.set(id, saved);
    return saved;
  }
}

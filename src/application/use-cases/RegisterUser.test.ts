import { describe, expect, it } from 'vitest';
import { User } from '../../domain/entities/User.js';
import { ConflictError } from '../../domain/errors/DomainError.js';
import type { PasswordHasher } from '../../domain/services/PasswordHasher.js';
import { InMemoryUserRepository } from '../../../tests/fakes/InMemoryUserRepository.js';
import { RegisterUser } from './RegisterUser.js';

const fakeHasher: PasswordHasher = { hash: async (plain) => `hashed:${plain}` };

describe('Application: RegisterUser', () => {
  it('crea el usuario y guarda la contraseña con hash, nunca en texto plano', async () => {
    const repo = new InMemoryUserRepository();
    const register = new RegisterUser(repo, fakeHasher);

    const user = await register.execute({ email: ' Ana@Example.com ', password: 'secreto123' });

    expect(user.id).toBe(1);
    const stored = await repo.findByEmail('ana@example.com');
    expect(stored?.passwordHash).toBe('hashed:secreto123');
    expect(stored?.passwordHash).not.toBe('secreto123');
  });

  it('rechaza un email ya registrado, aunque cambien las mayúsculas, y no crea otra cuenta', async () => {
    const repo = new InMemoryUserRepository();
    const register = new RegisterUser(repo, fakeHasher);
    await register.execute({ email: 'ana@example.com', password: 'secreto123' });

    await expect(
      register.execute({ email: 'ANA@Example.com', password: 'otraclave123' }),
    ).rejects.toBeInstanceOf(ConflictError);

    const original = await repo.findByEmail('ana@example.com');
    expect(original?.id).toBe(1);
    expect(original?.passwordHash).toBe('hashed:secreto123');
    expect(await repo.create(new User({ email: 'otra@example.com', passwordHash: 'h' }))).toHaveProperty('id', 2);
  });
});

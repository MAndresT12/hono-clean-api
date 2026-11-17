import { describe, expect, it } from 'vitest';
import { ValidationError } from '../errors/DomainError.js';
import { User } from './User.js';

describe('Domain: User entity', () => {
  it('normaliza el email: sin espacios y en minúsculas', () => {
    const user = new User({ email: '  Ana@Example.COM ', passwordHash: 'h' });
    expect(user.email).toBe('ana@example.com');
  });

  it('rechaza un email con formato inválido', () => {
    for (const email of ['', 'ana', 'ana@', '@example.com', 'ana@example', 'a na@example.com']) {
      expect(() => new User({ email, passwordHash: 'h' })).toThrow(ValidationError);
    }
  });

  it('rechaza una contraseña de menos de 8 caracteres', () => {
    expect(() => User.validatePassword('1234567')).toThrow(ValidationError);
    expect(() => User.validatePassword('12345678')).not.toThrow();
  });
});

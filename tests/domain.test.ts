import { describe, expect, it } from 'vitest';
import { Task } from '../src/domain/entities/Task.js';
import { User } from '../src/domain/entities/User.js';
import { ValidationError } from '../src/domain/errors/DomainError.js';

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

describe('Domain: Task entity', () => {
  it('applies business rules on construction', () => {
    expect(() => new Task({ title: '   ' })).toThrow(ValidationError);
    expect(new Task({ title: '  Comprar leche  ' }).title).toBe('Comprar leche');
  });

  it('changes state through business methods', () => {
    const task = new Task({ title: 'Tarea' });
    expect(task.completed).toBe(false);

    task.markAsCompleted();
    expect(task.completed).toBe(true);

    task.markAsPending();
    expect(task.completed).toBe(false);
  });
});

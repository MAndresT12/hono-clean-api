import { describe, expect, it } from 'vitest';
import { ValidationError } from '../errors/DomainError.js';
import { Task } from './Task.js';

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

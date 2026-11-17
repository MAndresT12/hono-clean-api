import { describe, expect, it } from 'vitest';
import { CreateTask } from '../src/application/use-cases/CreateTask.js';
import { DeleteTask } from '../src/application/use-cases/DeleteTask.js';
import { GetTaskById } from '../src/application/use-cases/GetTaskById.js';
import { ListTasks } from '../src/application/use-cases/ListTasks.js';
import { UpdateTask } from '../src/application/use-cases/UpdateTask.js';
import { RegisterUser } from '../src/application/use-cases/RegisterUser.js';
import { User } from '../src/domain/entities/User.js';
import { ConflictError, NotFoundError } from '../src/domain/errors/DomainError.js';
import type { PasswordHasher } from '../src/domain/services/PasswordHasher.js';
import { InMemoryTaskRepository } from './fakes/InMemoryTaskRepository.js';
import { InMemoryUserRepository } from './fakes/InMemoryUserRepository.js';

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

function makeUseCases() {
  const repo = new InMemoryTaskRepository();
  return {
    repo,
    create: new CreateTask(repo),
    list: new ListTasks(repo),
    getById: new GetTaskById(repo),
    update: new UpdateTask(repo),
    remove: new DeleteTask(repo),
  };
}

describe('Application: use cases (sin Hono ni Drizzle)', () => {
  it('crea, lista, actualiza y elimina una tarea', async () => {
    const uc = makeUseCases();

    const created = await uc.create.execute({ title: 'Tarea de prueba' });
    expect(created.id).toBe(1);

    expect(await uc.list.execute()).toHaveLength(1);

    const updated = await uc.update.execute({ id: created.id!, completed: true });
    expect(updated.completed).toBe(true);

    await uc.remove.execute(created.id!);
    expect(await uc.list.execute()).toHaveLength(0);
  });

  it('lanza NotFoundError cuando la entidad no existe', async () => {
    const uc = makeUseCases();
    await expect(uc.getById.execute(999)).rejects.toBeInstanceOf(NotFoundError);
    await expect(uc.remove.execute(999)).rejects.toBeInstanceOf(NotFoundError);
  });
});

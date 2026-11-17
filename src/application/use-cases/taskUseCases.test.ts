import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors/DomainError.js';
import { InMemoryTaskRepository } from '../../../tests/fakes/InMemoryTaskRepository.js';
import { CreateTask } from './CreateTask.js';
import { DeleteTask } from './DeleteTask.js';
import { GetTaskById } from './GetTaskById.js';
import { ListTasks } from './ListTasks.js';
import { UpdateTask } from './UpdateTask.js';

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

describe('Application: use cases de tareas (sin Hono ni Drizzle)', () => {
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

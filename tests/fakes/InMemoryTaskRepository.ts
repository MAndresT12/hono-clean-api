import { Task } from '../../src/domain/entities/Task.js';
import type { TaskRepository } from '../../src/domain/repositories/TaskRepository.js';

/** Test double: implementa el contrato del dominio sin tocar la BD real. */
export class InMemoryTaskRepository implements TaskRepository {
  private readonly rows = new Map<number, Task>();
  private nextId = 1;

  async findAll(): Promise<Task[]> {
    return [...this.rows.values()];
  }

  async findById(id: number): Promise<Task | null> {
    return this.rows.get(id) ?? null;
  }

  async create(task: Task): Promise<Task> {
    const id = this.nextId++;
    const saved = new Task({
      id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
    this.rows.set(id, saved);
    return saved;
  }

  async update(task: Task): Promise<Task> {
    if (task.id === undefined) throw new Error('Task without id');
    this.rows.set(task.id, task);
    return task;
  }

  async delete(id: number): Promise<boolean> {
    return this.rows.delete(id);
  }
}

import { eq } from 'drizzle-orm';
import { Task } from '../../domain/entities/Task.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';
import type { Database } from '../database/connection.js';
import { tasks, type TaskRow } from '../database/schema.js';

/** Traduce una fila de la BD a la entidad del dominio (anti-corruption layer). */
function toDomain(row: TaskRow): Task {
  return new Task({
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

/**
 * Implementación concreta del repositorio usando Drizzle ORM + SQLite/libSQL.
 * Depende del contrato del dominio, nunca al revés.
 */
export class DrizzleTaskRepository implements TaskRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Task[]> {
    const rows = await this.db.select().from(tasks);
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Task | null> {
    const rows = await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    const row = rows[0];
    return row ? toDomain(row) : null;
  }

  async create(task: Task): Promise<Task> {
    const rows = await this.db
      .insert(tasks)
      .values({
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })
      .returning();

    const row = rows[0];
    if (!row) throw new Error('Failed to create task');
    return toDomain(row);
  }

  async update(task: Task): Promise<Task> {
    if (task.id === undefined) {
      throw new Error('Cannot update a task without an id');
    }

    const rows = await this.db
      .update(tasks)
      .set({
        title: task.title,
        description: task.description,
        completed: task.completed,
        updatedAt: task.updatedAt,
      })
      .where(eq(tasks.id, task.id))
      .returning();

    const row = rows[0];
    if (!row) throw new Error(`Failed to update task ${task.id}`);
    return toDomain(row);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await this.db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });

    return rows.length > 0;
  }
}

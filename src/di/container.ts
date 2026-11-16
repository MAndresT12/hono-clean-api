import { CreateTask } from '../application/use-cases/CreateTask.js';
import { DeleteTask } from '../application/use-cases/DeleteTask.js';
import { GetTaskById } from '../application/use-cases/GetTaskById.js';
import { ListTasks } from '../application/use-cases/ListTasks.js';
import { UpdateTask } from '../application/use-cases/UpdateTask.js';
import { db } from '../infrastructure/database/connection.js';
import { DrizzleTaskRepository } from '../infrastructure/repositories/DrizzleTaskRepository.js';
import { TaskController } from '../presentation/controllers/TaskController.js';
import type { TaskRepository } from '../domain/repositories/TaskRepository.js';

/**
 * Composition Root: único lugar donde se cablean las 4 capas.
 * Acepta un TaskRepository para poder sustituir la infraestructura en tests.
 */
export function buildContainer(
  taskRepository: TaskRepository = new DrizzleTaskRepository(db),
) {
  // Application
  const useCases = {
    createTask: new CreateTask(taskRepository),
    listTasks: new ListTasks(taskRepository),
    getTaskById: new GetTaskById(taskRepository),
    updateTask: new UpdateTask(taskRepository),
    deleteTask: new DeleteTask(taskRepository),
  };

  // Presentation
  const controllers = {
    task: new TaskController(useCases),
  };

  return { taskRepository, useCases, controllers };
}

export type Container = ReturnType<typeof buildContainer>;

/** Contenedor por defecto: usa Drizzle + SQLite como infraestructura real. */
export const container: Container = buildContainer();

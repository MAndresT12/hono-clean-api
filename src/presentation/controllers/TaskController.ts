import type { Context } from 'hono';
import type { CreateTask } from '../../application/use-cases/CreateTask.js';
import type { DeleteTask } from '../../application/use-cases/DeleteTask.js';
import type { GetTaskById } from '../../application/use-cases/GetTaskById.js';
import type { ListTasks } from '../../application/use-cases/ListTasks.js';
import type { UpdateTask } from '../../application/use-cases/UpdateTask.js';
import type { Task } from '../../domain/entities/Task.js';
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validators/task.validators.js';

export interface TaskUseCases {
  createTask: CreateTask;
  listTasks: ListTasks;
  getTaskById: GetTaskById;
  updateTask: UpdateTask;
  deleteTask: DeleteTask;
}

function toResponse(task: Task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * Controlador HTTP: traduce peticiones/respuestas y delega la lógica
 * íntegramente a los casos de uso de Application.
 */
export class TaskController {
  constructor(private readonly useCases: TaskUseCases) {}

  async create(c: Context) {
    const input = createTaskSchema.parse(await c.req.json());
    const task = await this.useCases.createTask.execute(input);
    return c.json({ data: toResponse(task) }, 201);
  }

  async list(c: Context) {
    const tasks = await this.useCases.listTasks.execute();
    return c.json({ data: tasks.map(toResponse) });
  }

  async getById(c: Context) {
    const id = taskIdSchema.parse(c.req.param('id'));
    const task = await this.useCases.getTaskById.execute(id);
    return c.json({ data: toResponse(task) });
  }

  async update(c: Context) {
    const id = taskIdSchema.parse(c.req.param('id'));
    const input = updateTaskSchema.parse(await c.req.json());
    const task = await this.useCases.updateTask.execute({ id, ...input });
    return c.json({ data: toResponse(task) });
  }

  async remove(c: Context) {
    const id = taskIdSchema.parse(c.req.param('id'));
    await this.useCases.deleteTask.execute(id);
    return c.body(null, 204);
  }
}

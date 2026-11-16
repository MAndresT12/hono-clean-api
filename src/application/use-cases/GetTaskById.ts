import type { Task } from '../../domain/entities/Task.js';
import { NotFoundError } from '../../domain/errors/DomainError.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';

export class GetTaskById {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError('Task', id);
    }
    return task;
  }
}

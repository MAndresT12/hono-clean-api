import type { Task } from '../../domain/entities/Task.js';
import { NotFoundError } from '../../domain/errors/DomainError.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class UpdateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskRepository.findById(input.id);
    if (!task) {
      throw new NotFoundError('Task', input.id);
    }

    if (input.title !== undefined) task.rename(input.title);
    if (input.description !== undefined) task.changeDescription(input.description);
    if (input.completed !== undefined) {
      input.completed ? task.markAsCompleted() : task.markAsPending();
    }

    return this.taskRepository.update(task);
  }
}

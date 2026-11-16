import { NotFoundError } from '../../domain/errors/DomainError.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';

export class DeleteTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Task', id);
    }
  }
}

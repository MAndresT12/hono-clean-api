import type { Task } from '../../domain/entities/Task.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';

export class ListTasks {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}

import { Task } from '../../domain/entities/Task.js';
import type { TaskRepository } from '../../domain/repositories/TaskRepository.js';

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const task = new Task({ title: input.title, description: input.description });
    return this.taskRepository.create(task);
  }
}

import type { Task } from '../entities/Task.js';

/**
 * Contrato de persistencia definido por el DOMINIO.
 * La infraestructura lo implementa; la aplicación sólo conoce esta interfaz.
 * Así se invierte la dependencia (Dependency Inversion Principle).
 */
export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<boolean>;
}

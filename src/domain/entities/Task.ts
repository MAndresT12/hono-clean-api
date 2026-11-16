import { ValidationError } from '../errors/DomainError.js';

export interface TaskProps {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidad de negocio pura (entidad de ejemplo).
 * - No conoce la existencia de Hono, Drizzle ni SQLite.
 * - Las reglas de negocio (validación, transiciones de estado) viven aquí.
 */
export class Task {
  readonly id?: number;
  readonly createdAt: Date;

  private _title: string;
  private _description: string;
  private _completed: boolean;
  private _updatedAt: Date;

  constructor(props: TaskProps) {
    this.id = props.id;
    this._title = Task.validateTitle(props.title);
    this._description = props.description ?? '';
    this._completed = props.completed ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get completed(): boolean {
    return this._completed;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  rename(title: string): void {
    this._title = Task.validateTitle(title);
    this.touch();
  }

  changeDescription(description: string): void {
    this._description = description.trim();
    this.touch();
  }

  markAsCompleted(): void {
    if (!this._completed) {
      this._completed = true;
      this.touch();
    }
  }

  markAsPending(): void {
    if (this._completed) {
      this._completed = false;
      this.touch();
    }
  }

  private static validateTitle(title: string): string {
    const trimmed = title?.trim() ?? '';
    if (trimmed.length === 0) {
      throw new ValidationError('Task title must not be empty');
    }
    if (trimmed.length > 200) {
      throw new ValidationError('Task title must be 200 characters or less');
    }
    return trimmed;
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}

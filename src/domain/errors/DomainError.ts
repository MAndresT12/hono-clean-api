/**
 * Errores puros del dominio.
 * No dependen de ningún framework (ni Hono ni Drizzle).
 * La capa de presentación se encarga de traducirlos a códigos HTTP.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Regla de negocio o dato de entrada inválido. */
export class ValidationError extends DomainError {}

/** La operación choca con el estado actual (p. ej. un email ya registrado). */
export class ConflictError extends DomainError {}

/** Entidad solicitada no encontrada. */
export class NotFoundError extends DomainError {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id "${id}" was not found`);
  }
}

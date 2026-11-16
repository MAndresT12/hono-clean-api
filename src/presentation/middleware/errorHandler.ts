import type { Context } from 'hono';
import { ZodError } from 'zod';
import {
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/DomainError.js';

/**
 * Traduce errores del dominio / validación a respuestas HTTP.
 * Es el único punto donde los errores de negocio "tocan" el protocolo HTTP.
 */
export function handleError(err: Error, c: Context) {
  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404);
  }
  if (err instanceof ValidationError) {
    return c.json({ error: err.message }, 400);
  }
  if (err instanceof ZodError) {
    return c.json({ error: 'Invalid request', details: err.flatten() }, 400);
  }
  if (err instanceof DomainError) {
    return c.json({ error: err.message }, 400);
  }

  console.error('[Unhandled error]', err);
  return c.json({ error: 'Internal server error' }, 500);
}

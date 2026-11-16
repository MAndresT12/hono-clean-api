import { z } from 'zod';

/** Validación de la capa HTTP (antes de llamar a los casos de uso). */
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const taskIdSchema = z.coerce.number().int().positive();

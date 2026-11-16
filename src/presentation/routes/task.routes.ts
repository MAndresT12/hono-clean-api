import { Hono } from 'hono';
import type { TaskController } from '../controllers/TaskController.js';

/** Rutas HTTP de la entidad de ejemplo (inyección del controlador). */
export function taskRoutes(controller: TaskController) {
  const router = new Hono();

  router.get('/', (c) => controller.list(c));
  router.post('/', (c) => controller.create(c));
  router.get('/:id', (c) => controller.getById(c));
  router.put('/:id', (c) => controller.update(c));
  router.delete('/:id', (c) => controller.remove(c));

  return router;
}

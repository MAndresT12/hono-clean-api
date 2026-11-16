import { Hono } from 'hono';
import { container, type Container } from './di/container.js';
import { handleError } from './presentation/middleware/errorHandler.js';
import { healthRoutes } from './presentation/routes/health.routes.js';
import { taskRoutes } from './presentation/routes/task.routes.js';

/** Ensambla la aplicación HTTP a partir de las capas ya cableadas. */
export function createApp(deps: Container = container) {
  const app = new Hono();

  app.get('/', (c) =>
    c.json({
      name: 'hono-clean-api',
      version: '1.0.0',
      endpoints: ['/health', '/tasks'],
    }),
  );

  app.route('/health', healthRoutes);
  app.route('/tasks', taskRoutes(deps.controllers.task));

  app.notFound((c) => c.json({ error: 'Not found' }, 404));
  app.onError(handleError);

  return app;
}

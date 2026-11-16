import { Hono } from 'hono';

/** Endpoint de prueba para validar que el servidor está vivo. */
export const healthRoutes = new Hono();

healthRoutes.get('/', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }),
);

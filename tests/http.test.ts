import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { buildContainer } from '../src/di/container.js';
import { InMemoryTaskRepository } from './fakes/InMemoryTaskRepository.js';

const app = createApp(buildContainer(new InMemoryTaskRepository()));

const jsonHeaders = { 'content-type': 'application/json' };

describe('Presentation: HTTP API', () => {
  it('healthcheck responde ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe('ok');
  });

  it('flujo completo CRUD', async () => {
    const created = await app.request('/tasks', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ title: 'Integrar capas', description: 'Validar arquitectura' }),
    });
    expect(created.status).toBe(201);

    const { data } = (await created.json()) as {
      data: { id: number; title: string; completed: boolean };
    };
    expect(data.title).toBe('Integrar capas');
    const id = data.id;

    const listed = await app.request('/tasks');
    expect((await listed.json()).data).toHaveLength(1);

    const updated = await app.request(`/tasks/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ completed: true }),
    });
    expect((await updated.json()).data.completed).toBe(true);

    const removed = await app.request(`/tasks/${id}`, { method: 'DELETE' });
    expect(removed.status).toBe(204);

    const missing = await app.request(`/tasks/${id}`);
    expect(missing.status).toBe(404);
  });

  it('devuelve 400 ante datos inválidos', async () => {
    const res = await app.request('/tasks', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ title: '' }),
    });
    expect(res.status).toBe(400);
  });
});

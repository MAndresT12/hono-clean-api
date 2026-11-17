import { describe, expect, it } from 'vitest';
import { createApp } from '../../app.js';
import { buildContainer } from '../../di/container.js';
import { InMemoryTaskRepository } from '../../../tests/fakes/InMemoryTaskRepository.js';
import { InMemoryUserRepository } from '../../../tests/fakes/InMemoryUserRepository.js';

const app = createApp(
  buildContainer(new InMemoryTaskRepository(), new InMemoryUserRepository(), {
    hash: async (plain) => `hashed:${plain}`,
  }),
);

const jsonHeaders = { 'content-type': 'application/json' };

describe('Presentation: POST /auth/register', () => {
  it('con datos válidos responde 201, sin contraseña ni sesión', async () => {
    const res = await app.request('/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ email: 'Ana@Example.com', password: 'secreto123' }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('set-cookie')).toBeNull();
    const body = (await res.json()) as { data: Record<string, unknown> };
    expect(body.data.email).toBe('ana@example.com');
    expect(body.data.id).toBeTypeOf('number');
    expect(JSON.stringify(body)).not.toMatch(/secreto123|hashed|password|token/i);
  });
});

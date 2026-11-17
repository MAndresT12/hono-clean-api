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

describe('Presentation: GET /health', () => {
  it('healthcheck responde ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe('ok');
  });
});

import { describe, expect, it } from 'vitest';
import { ScryptPasswordHasher } from './ScryptPasswordHasher.js';

describe('Infrastructure: ScryptPasswordHasher', () => {
  it('devuelve un hash que no contiene la contraseña y es distinto en cada llamada (sal)', async () => {
    const hasher = new ScryptPasswordHasher();

    const a = await hasher.hash('secreto123');
    const b = await hasher.hash('secreto123');

    expect(a).not.toContain('secreto123');
    expect(a.length).toBeGreaterThan(32);
    expect(a).not.toBe(b);
  });
});

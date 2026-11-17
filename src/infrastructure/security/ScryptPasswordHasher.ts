import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import type { PasswordHasher } from '../../domain/services/PasswordHasher.js';

const scryptAsync = promisify(scrypt);

/** Formato guardado: `<sal en hex>:<hash en hex>`. Parámetros de scrypt por defecto de Node. */
export class ScryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = (await scryptAsync(plain, salt, 64)) as Buffer;
    return `${salt.toString('hex')}:${derived.toString('hex')}`;
  }
}

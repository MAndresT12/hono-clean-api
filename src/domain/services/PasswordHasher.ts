/** Puerto: la infraestructura decide el algoritmo (scrypt, ...). */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
}

import { ValidationError } from '../errors/DomainError.js';

export interface UserProps {
  id?: number;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

/** Entidad de negocio pura: el email se guarda normalizado. */
export class User {
  readonly id?: number;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    const email = props.email.trim().toLowerCase();
    // shortcut: formato básico (algo@algo.algo), no RFC completo; endurecer si hace falta
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('El email no tiene un formato válido');
    }
    this.email = email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? new Date();
  }

  /** Se valida sobre la contraseña en claro, antes de hacer el hash. */
  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }
  }
}

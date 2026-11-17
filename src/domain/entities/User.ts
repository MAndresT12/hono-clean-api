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
    this.email = props.email.trim().toLowerCase();
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? new Date();
  }
}

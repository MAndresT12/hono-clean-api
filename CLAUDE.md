# hono-clean-api

Backend Hono + TypeScript + Drizzle (SQLite/libsql) con Clean Architecture. Runtime: Node (no Deno).

## Comandos
- `npm test` (Vitest), `npm run typecheck`, `npm run dev`.
- Migraciones: `npm run db:generate`; revisar el SQL generado antes de aplicarlo con `npm run db:migrate`.

## Arquitectura
- `domain` no importa nada de otras capas. `application` solo conoce interfaces del dominio (repositorios, `PasswordHasher`). La infraestructura las implementa; `src/di/container.ts` cablea todo.
- Errores de negocio: `ValidationError` → 400, `NotFoundError` → 404, `ConflictError` → 409 (traducidos en `handleError`).

## Tests
- Cada test vive junto al módulo que prueba, con el mismo nombre: `User.ts` → `User.test.ts`, `auth.routes.ts` → `auth.routes.test.ts`. No hay carpeta `tests/` para tests.
- Excepción: los dobles compartidos (repositorios en memoria) están en `tests/fakes/`, para que no acaben en `dist`.
- Prefiere probar por la interfaz pública y al nivel más alto práctico (HTTP > caso de uso > dominio).

## Convenciones
- Mensajes de error nuevos en español. Los que ya existen en el CRUD de tareas siguen en inglés hasta que se traduzcan en una tarea aparte.
- Las contraseñas se guardan solo con hash (scrypt de `node:crypto`); nunca se devuelven en una respuesta.

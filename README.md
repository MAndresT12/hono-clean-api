# hono-clean-api

Backend base construido con **Hono + TypeScript**, **Drizzle ORM** y **SQLite**, organizado con **Clean Architecture** en 4 capas estrictas. Incluye inyección de dependencias, healthcheck y un flujo CRUD completo de una entidad de ejemplo (`Task`) para validar el cableado.

## Stack

- **Hono 4** + `@hono/node-server` (capa HTTP)
- **TypeScript 5** (ESM, `NodeNext`)
- **Drizzle ORM** + **libSQL** (`@libsql/client`) como driver SQLite
- **drizzle-kit** para migraciones
- **zod** para validación de entorno y de peticiones HTTP
- **vitest** para tests

> **Nota sobre el driver:** se usa `@libsql/client` (SQLite-compatible, sucesor oficial de libSQL) en lugar de `better-sqlite3`. Este último no publica binarios precompilados para Node 26 y requiere compilación nativa; libSQL funciona con un archivo local `file:./data/app.db` sin ese problema.

## Estructura (4 capas)

```
src/
├── domain/                       # 1. DOMINIO — cero dependencias externas
│   ├── entities/Task.ts          #    Entidad pura + reglas de negocio
│   ├── errors/DomainError.ts     #    Errores de negocio (ValidationError, NotFoundError)
│   └── repositories/
│       └── TaskRepository.ts     #    Interfaz de repositorio (inversión de dependencias)
│
├── application/                  # 2. APLICACIÓN — sólo depende de domain
│   └── use-cases/
│       ├── CreateTask.ts
│       ├── ListTasks.ts
│       ├── GetTaskById.ts
│       ├── UpdateTask.ts
│       └── DeleteTask.ts
│
├── infrastructure/               # 3. INFRAESTRUCTURA — depende de domain
│   ├── config/env.ts             #    Variables de entorno validadas con zod
│   ├── database/
│   │   ├── connection.ts         #    Cliente libSQL + instancia Drizzle
│   │   └── schema.ts             #    Esquema SQLite (tabla `tasks`)
│   └── repositories/
│       └── DrizzleTaskRepository.ts  # Implementación de TaskRepository
│
├── presentation/                 # 4. PRESENTACIÓN — depende de application + domain
│   ├── controllers/TaskController.ts
│   ├── routes/{task,health}.routes.ts
│   ├── validators/task.validators.ts
│   └── middleware/errorHandler.ts   # Traduce errores de dominio → HTTP
│
├── di/container.ts               # Composition Root: cablea las 4 capas
├── app.ts                        # Ensamblado de rutas Hono
└── index.ts                      # Entrypoint del servidor

drizzle/                          # Migraciones SQL generadas
tests/                            # Tests unitarios + HTTP (con repositorio en memoria)
```

### Regla de dependencias

```
presentation  →  application  →  domain
      └───────────────┬────────────┘
                      ↓ (implementa la interfaz)
              infrastructure  →  domain
```

- `domain` **no importa nada** de Hono, Drizzle ni de las otras capas.
- `application` importa **sólo** `domain`.
- `infrastructure` implementa las interfaces de `domain` (Drizzle es un detalle).
- `presentation` llama a casos de uso; el `errorHandler` es el único sitio donde los errores de dominio se convierten en respuestas HTTP.
- `src/di/container.ts` es el **único** lugar donde se eligen las implementaciones concretas (DI por constructor).

## Requisitos

- Node.js 20+ (probado con Node 26)
- npm

## Instalación

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run db:generate       # ya generado; sólo si cambias el schema
npm run db:migrate        # aplica las migraciones a SQLite
npm run dev               # servidor en http://localhost:3000
```

## Variables de entorno

| Variable        | Default                  | Descripción                                  |
| --------------- | ------------------------ | -------------------------------------------- |
| `NODE_ENV`      | `development`            | `development` / `production` / `test`        |
| `PORT`          | `3000`                   | Puerto HTTP                                  |
| `DATABASE_URL`  | `file:./data/app.db`     | Archivo SQLite local, URL `libsql://` o `:memory:` |

Se validan al arrancar con zod (`src/infrastructure/config/env.ts`). Si falta o es inválida, el proceso se detiene con un mensaje claro.

## Scripts

| Script               | Descripción                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Servidor con recarga automática (tsx watch)   |
| `npm run build`      | Compila a `dist/`                             |
| `npm start`          | Ejecuta el build (`node dist/index.js`)       |
| `npm run typecheck`  | Verificación de tipos sin emitir              |
| `npm test`           | Ejecuta la suite de tests (vitest)            |
| `npm run db:generate`| Genera una migración desde el schema          |
| `npm run db:migrate` | Aplica migraciones pendientes                 |
| `npm run db:push`    | Sincroniza el schema directamente (dev)       |
| `npm run db:studio`  | Abre Drizzle Studio                           |

## Endpoints

### Healthcheck

```http
GET /health
```

```json
{ "status": "ok", "timestamp": "2026-11-16T...", "uptime": 12.34 }
```

### CRUD de `Task`

| Método   | Ruta          | Descripción        | Código |
| -------- | ------------- | ------------------ | ------ |
| `GET`    | `/tasks`      | Listar tareas      | 200    |
| `GET`    | `/tasks/:id`  | Obtener una tarea  | 200    |
| `POST`   | `/tasks`      | Crear tarea        | 201    |
| `PUT`    | `/tasks/:id`  | Actualizar tarea   | 200    |
| `DELETE` | `/tasks/:id`  | Eliminar tarea     | 204    |

Ejemplos:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Aprender Clean Architecture","description":"Validar el backend"}'

curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Respuesta (envuelta en `{ "data": ... }`):

```json
{
  "data": {
    "id": 1,
    "title": "Aprender Clean Architecture",
    "description": "Validar el backend",
    "completed": false,
    "createdAt": "2026-11-16T00:00:00.000Z",
    "updatedAt": "2026-11-16T00:00:00.000Z"
  }
}
```

Errores:

```json
{ "error": "Task with id \"99\" was not found" }          // 404
{ "error": "Invalid request", "details": { ... } }        // 400 (validación HTTP)
{ "error": "Task title must not be empty" }               // 400 (regla de dominio)
```

## Tests

La suite demuestra que las capas son intercambiables: los casos de uso y la API HTTP se prueban con un `InMemoryTaskRepository` que implementa la interfaz del dominio, sin levantar Hono real ni SQLite.

```bash
npm test
# 3 archivos, 7 tests
```

- `tests/domain.test.ts` — reglas de la entidad.
- `tests/application.test.ts` — casos de uso con repositorio falso.
- `tests/http.test.ts` — healthcheck + flujo CRUD completo vía `app.request()`, incluyendo manejo de errores 400/404.

## Autor

Milton Heras ([@MAndresT12](https://github.com/MAndresT12)) · Licencia MIT.

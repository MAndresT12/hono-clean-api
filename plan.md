## Story
Como usuario nuevo, quiero registrarme con email y contraseña, para tener mi propia cuenta y empezar a usar la app.

## Acceptance criteria
- [ ] Dado un email que no está registrado, cuando me registro con ese email y una contraseña de al menos 8 caracteres, entonces se crea mi cuenta y recibo una confirmación que no incluye la contraseña ni abre una sesión.
- [ ] Dado un email que ya está registrado (sin importar mayúsculas o minúsculas), cuando intento registrarme con él, entonces se rechaza con un mensaje en español que dice que ese email ya está en uso, y no se crea otra cuenta.
- [ ] Dado un email con formato inválido o una contraseña de menos de 8 caracteres, cuando intento registrarme, entonces se rechaza con un mensaje en español que dice qué corregir.
- [ ] Dado que no tengo una sesión válida, cuando llamo a cualquier endpoint de tareas, entonces se rechaza como no autorizado con un mensaje en español.

## Plan
- Dominio: un usuario cuyo email se guarda normalizado (sin espacios y en minúsculas) y una contraseña de 8 caracteres como mínimo.
- Aplicación: un caso de uso de registro que valida los datos, revisa que el email no exista, guarda la contraseña con hash y crea el usuario.
- Infraestructura: una migración que crea las tablas de usuarios y de sesiones y borra las tareas existentes, que no tienen dueño. El hash se hace con scrypt de `node:crypto`, sin añadir dependencias.
- Presentación: un endpoint público de registro y un middleware que exige un token de sesión válido en todas las rutas `/tasks`. Mientras no exista el login, todas estas rutas responden "no autorizado".
- Tests: pruebas de dominio, del caso de uso con un repositorio en memoria y HTTP (registro y rechazo en `/tasks`). Los tests actuales de `/tasks` se adaptan para usar una sesión válida.

## Out of scope
- Iniciar sesión y crear sesiones (#2), y cerrar sesión (#3).
- Asignar un dueño a las tareas y filtrar las tareas por usuario (#1b y #4).
- Verificar el email, recuperar la contraseña y limitar los intentos.
- Traducir al español los mensajes que ya existen en el CRUD de tareas.

## Suggestions (your call)
- Sesiones con token opaco guardado en la base de datos, en lugar de JWT: la #3 (cerrar sesión) necesita poder anular una sesión, y con un token guardado eso es borrar una fila.
- Traducir al español los mensajes que hoy están en inglés (en la entidad Task y en los validadores), en una tarea aparte.

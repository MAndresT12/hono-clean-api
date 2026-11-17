# Backlog

## Contexto
API de tareas en línea, solo en español, para varios usuarios. Cada uno se registra con email y contraseña y gestiona solo sus propias tareas, sin compartirlas. Por ahora solo se accede como API.
Decisiones caras de cambiar después: cuentas propias con email y contraseña, las tareas siempre pertenecen a un solo usuario, y la app es solo en español.

## Historias
1. Como usuario nuevo, quiero registrarme con email y contraseña y crear mi primera tarea, para empezar a anotar mis pendientes.
2. Como usuario registrado, quiero iniciar sesión con mi email y contraseña, para volver a mis tareas cuando quiera. Requiere: #1
3. Como usuario, quiero cerrar sesión, para que nadie más use mi sesión. Requiere: #2
4. Como usuario, quiero ver la lista de mis tareas, para saber qué tengo pendiente. Requiere: #1
5. Como usuario, quiero modificar una de mis tareas, para corregirla o actualizarla. Requiere: #4
6. Como usuario, quiero marcar una tarea como completada y desmarcarla, para distinguir lo hecho de lo pendiente y corregirlo si me equivoco. Requiere: #4
7. Como usuario, quiero eliminar una de mis tareas, para quitar lo que ya no necesito. Requiere: #4

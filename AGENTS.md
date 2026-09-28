# Instrucciones para agentes

## Inicio de cada sesion

1. Lee `CONTEXT.md` como fuente de contexto de la empresa.
2. Lee `memory-bank/projectbrief.md`.
3. Lee `memory-bank/techContext.md`; si esta vacio, no supongas detalles tecnicos que no esten documentados.
4. Lee `memory-bank/progress.md` para distinguir lo completado de lo pendiente.
5. Lee el `README.md` de la raiz y el `README.md` de cada carpeta en la que vayas a trabajar. El README raiz indica que cada carpeta tiene una responsabilidad y que cada nueva aplicacion, servicio, agente o pipeline debe tener su subcarpeta y README.
6. Lee las reglas aplicables de `.agents/rules/` si esa carpeta existe. Si no existe, no supongas reglas adicionales.
7. Antes de editar, revisa `git status` y la rama actual. Preserva los cambios locales preexistentes y no los atribuyas a este trabajo sin evidencia.

## Flujo obligatorio antes de cada commit

1. Revisa `git status`, la rama, el diff staged y unstaged completos, y los archivos sin seguimiento relevantes.
2. Confirma que cada cambio pertenece al alcance solicitado.
3. Identifica en los README y archivos del proyecto los comandos reales de validacion y ejecuta los aplicables. El README raiz indica que no hay un ejecutor de workspaces configurado en la raiz; no inventes comandos de test o build. Si no hay una validacion disponible, indicalo.
4. Verifica manualmente el comportamiento afectado cuando el cambio altere funcionalidad; si no es posible, documenta esa limitacion.
5. Actualiza `memory-bank/progress.md` cuando cambie el estado del proyecto y registra solo acciones completadas.
6. Presenta los cambios y resultados de validacion y solicita confirmacion explicita antes de realizar el commit. No hagas commit sin esa confirmacion.

## Archivos que requieren confirmacion explicita

No modifiques sin confirmacion explicita:

- `CONTEXT.md`.
- Archivos de configuracion del workspace o del gestor de paquetes.
- Lockfiles.
- Variables de entorno y secretos.
- Configuracion de despliegue o CI/CD.
- Migraciones o archivos cuya modificacion o eliminacion pueda borrar datos.
- Archivos o cambios fuera del alcance solicitado.

## Comportamiento obligatorio

- No inventes requisitos, datos ni resultados; usa `CONTEXT.md` como fuente de verdad para el contexto de empresa y respeta lo que los README asignan a cada carpeta.
- No expongas secretos.
- No realices cambios destructivos sin confirmacion explicita.
- Detente y consulta cuando las fuentes del proyecto se contradigan y la contradiccion afecte la decision o el cambio.

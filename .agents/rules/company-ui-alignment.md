# Alineacion de UI con la empresa

## Alcance

- `uis/website/**/*`
- `uis/backoffice/**/*`

Aplica al crear, revisar o modificar archivos existentes o nuevos bajo esas rutas, incluidos codigo, contenido, estilos, assets y documentacion. `uis/README.md` define `website` como la presencia publica de la empresa y `backoffice` como la aplicacion interna de administracion; el hecho de que una de esas carpetas aun no exista no cambia el alcance de la regla.

## Fuentes obligatorias

Antes de decidir o realizar cambios cubiertos por esta regla, lee:

1. `CONTEXT.md`, como fuente de verdad para hechos de la empresa.
2. `memory-bank/projectbrief.md`.
3. `memory-bank/techContext.md`; si esta vacio o no contiene una decision, no infieras una.
4. `memory-bank/progress.md`.
5. `uis/README.md` y el README de la aplicacion afectada, si existe.

Si una fuente contradice a otra sobre un hecho de la empresa, no elijas una version por tu cuenta: detente y solicita aclaracion.

## Reglas de alineacion

- Mantén separados los layouts y las responsabilidades del website publico y del backoffice interno. No traslades pantallas internas al website ni conviertas el backoffice en una segunda presencia publica.
- Conserva los patrones visuales y componentes que ya existan en cada aplicacion; no unifiques sus layouts por conveniencia.
- No inventes hechos, cifras, promesas de servicio, clientes, testimonios, capacidades operativas ni requisitos de la empresa. Usa solo afirmaciones respaldadas por `CONTEXT.md` y por datos efectivamente disponibles en el proyecto.
- `CONTEXT.md` no define una identidad visual (por ejemplo, logotipo, paleta o tipografias). No presentes elecciones nuevas de marca como si fueran oficiales; reutiliza unicamente assets y decisiones visuales ya documentados o existentes.
- Si la solicitud requiere una afirmacion empresarial, un asset de marca o una decision visual que las fuentes no respaldan, detente y pregunta antes de incorporarla.

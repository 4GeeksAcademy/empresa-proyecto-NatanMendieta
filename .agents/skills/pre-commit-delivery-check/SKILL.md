---
name: pre-commit-delivery-check
description: Verifica en modo de solo lectura si los cambios cumplen las instrucciones y validaciones del repositorio antes de un commit; no modifica archivos ni crea commits.
---

# Pre-Commit Delivery Check

## Objetivo unico

Auditar un conjunto de cambios antes de un commit y emitir un resultado verificable conforme a `AGENTS.md`. Esta skill solo inspecciona y valida. No implementa ni corrige funcionalidades, no edita archivos, no prepara cambios con `git add` y no crea commits.

## Inputs

- El alcance solicitado para el cambio y, si se indico, la rama esperada.
- El estado del repositorio: rama, cambios staged y unstaged, y archivos sin seguimiento relacionados.
- `AGENTS.md`, `CONTEXT.md` y los tres documentos de `memory-bank/`: `projectbrief.md`, `techContext.md` y `progress.md`.
- Los README aplicables a las carpetas modificadas y las reglas aplicables de `.agents/rules/`.
- Los archivos modificados y los contratos, llamadores, pruebas o configuraciones que definen las interfaces afectadas.
- Los scripts de validacion declarados por los README, manifiestos del proyecto y configuracion relevante.

## Pasos

1. Lee `AGENTS.md` y sigue sus instrucciones de inicio y validacion. Lee `CONTEXT.md`, los tres documentos de `memory-bank/`, los README de las carpetas afectadas y las reglas cuyo apartado `## Alcance` incluya los archivos revisados. Si un archivo de memoria esta vacio, no infieras su contenido.
2. Consulta la rama actual y `git status`. Si la solicitud especifica una rama, comprueba que coincida. Registra cambios staged, unstaged y archivos sin seguimiento pertinentes; no cambies el indice ni el arbol de trabajo.
3. Inspecciona el diff staged y unstaged completos, y el contenido de cada archivo nuevo relevante. Compara cada cambio con el alcance solicitado y separa cambios preexistentes de los que se auditan cuando haya evidencia para hacerlo. Senala todo archivo no explicado o fuera de alcance.
4. Identifica las interfaces afectadas por los cambios. Revisa, segun corresponda, sus contratos, rutas, esquemas, consumidores, llamadores, estados de UI y pruebas existentes. Informa compatibilidad, riesgos y cobertura observables; no cambies la implementacion ni agregues pruebas.
5. Busca comandos de validacion reales en los README, scripts/manifiestos del proyecto y configuracion aplicable. Ejecuta solo los comandos existentes y pertinentes. No inventes comandos; si no hay un runner o validacion aplicable, indicalo. No ejecutes validaciones que puedan borrar o alterar datos.
6. Cuando el cambio afecte comportamiento, verifica manualmente el flujo afectado si el entorno y los comandos existentes lo permiten. Si no es posible, registra exactamente la limitacion. No declares website, backoffice, pruebas o build como completados sin evidencia directa.
7. Compara el estado comprobado con `memory-bank/progress.md`. Senala registros desactualizados, tareas marcadas como completas sin evidencia o cambios de estado que deban registrarse; no edites el banco de memoria.
8. Emite el informe definido abajo. No apliques arreglos, no limpies ni descartes cambios, no alteres archivos y no crees un commit.

## Output

Devuelve un informe breve con estas secciones:

- **Resultado:** `LISTO`, `NO LISTO` o `BLOQUEADO`.
- **Rama y alcance:** rama observada, rama esperada si se especifico, y archivos staged, unstaged y nuevos revisados.
- **Interfaces afectadas:** interfaces/contratos revisados y riesgos o cobertura faltante.
- **Validaciones:** comando exacto y resultado para cada validacion ejecutada; identifica las que no existen, no aplican o no se pudieron correr.
- **Banco de memoria:** correspondencia de `progress.md` con el estado observado y cualquier actualizacion pendiente.
- **Hallazgos:** problemas concretos, evidencia y bloqueos; si no hay, dilo expresamente.
- **Accion:** confirma que no se modificaron archivos ni se creo un commit.

No afirmes que algo paso si no hay evidencia en la salida de comandos o en los archivos inspeccionados. `LISTO` significa que el alcance y los cambios fueron revisados, no hay hallazgos bloqueantes, las validaciones disponibles y pertinentes pasaron, y las validaciones no disponibles o las verificaciones manuales imposibles quedaron explicitadas. Usa `NO LISTO` si una validacion falla, hay cambios fuera de alcance o el progreso contradice la evidencia. Usa `BLOQUEADO` si faltan instrucciones, contexto o acceso necesarios para completar la auditoria.

## Criterios verificables

La auditoria solo puede concluir `LISTO` si:

- La rama observada y cualquier rama objetivo indicada estan identificadas.
- Se revisaron los diffs staged y unstaged y los archivos nuevos pertinentes; cada cambio tiene una relacion explicita con el alcance solicitado.
- Se identificaron las interfaces afectadas y se revisaron sus contratos o consumidores pertinentes.
- Se ejecutaron las validaciones reales aplicables, o se declaro claramente que no existen/no aplican; no se inventaron comandos ni resultados.
- Se verifico el comportamiento afectado o se documento por que no fue posible.
- El estado de progreso concuerda con la evidencia, o la discrepancia queda indicada como impedimento para `LISTO`.
- No se modificaron archivos, no se cambiaron datos staged/unstaged y no se creo un commit.

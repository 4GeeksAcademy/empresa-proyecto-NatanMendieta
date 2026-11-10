# TrackFlow Tech: candidaturas

Gestor interno de selección construido con Next.js App Router, React y TypeScript.
La interfaz está en español y comparte cabecera, contexto de campaña y estilos
entre el listado y el detalle.

La campaña prioritaria es Asistente de Dirección en Zaragoza. Es contexto visual:
no filtra automáticamente los registros de la API compartida ni añade campos
obligatorios al formulario.

## Estructura

- `src/app/`: layout compartido, estilos globales y rutas `/` y `/candidates/[id]`.
- `src/components/`: listado, detalle y formulario reutilizable de alta y edición.
- `src/lib/api.ts`: cliente fetch, errores HTTP/red/JSON, 204 y paginación completa.
- `src/types/tracker.ts`: tipos de candidaturas y notas, formularios y etiquetas.

## Estado y navegación

Los datos, borradores y estados de carga, error y éxito viven en estado local de
React. Los filtros y la búsqueda se conservan en los parámetros `status`, `stage`
y `search` de la URL, mediante `useSearchParams` y `window.history.replaceState`.
Los enlaces al detalle y de regreso conservan la consulta.

El formulario comunica el registro guardado a su componente padre con `onSaved`.
No hay prop drilling ni necesidad de estado global: no se utilizan Context API,
`useReducer`, Redux, Zustand ni otras librerías de gestión de estado.

## Ejecución

Desde esta carpeta, instala las dependencias con `npm install`. Configura
`NEXT_PUBLIC_API_URL` en `.env.local` con este valor público; no incluyas secretos
en variables `NEXT_PUBLIC_*`:

```dotenv
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

```sh
npm run dev
```

La aplicación se sirve en `http://localhost:3000`. Las variables públicas quedan
incorporadas al bundle: reinicia el servidor o recompila después de cambiarlas.

## Validación

```sh
npm run lint
npx tsc --noEmit --incremental false
npm run build
```

La inspección visual en escritorio y móvil está pendiente. Las comprobaciones
simuladas de operaciones no sustituyen una prueba de integración autorizada.

## Datos y acceso

Las notas solo se muestran en el detalle. El cliente omite las notas que la API
incluye en el listado, pero esto no constituye autorización de acceso. La API
mock no documenta autenticación; no se ha inventado un mecanismo de acceso.
No ejecutes escrituras sobre la API compartida sin autorización.
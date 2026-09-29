# TrackFlow Backoffice

Backoffice interno estático para consultar información empresarial basada en `CONTEXT.md`. No consulta sistemas operativos, no requiere autenticación ni incorpora APIs.

## Stack

- HTML semántico y CSS en `index.html`.
- Tailwind CSS mediante CDN, igual que `uis/website`.
- Sin framework JavaScript, gestor de paquetes, build ni backend.

## Ejecutar localmente

Desde `uis/backoffice`, ejecuta:

```bash
python3 -m http.server 8001 --bind 0.0.0.0
```

Abre `http://localhost:8001/`. Python se usa únicamente para servir archivos estáticos.

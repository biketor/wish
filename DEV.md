# Guía de desarrollo

## Instalación
1. Requiere Node.js LTS.
2. Desde la raíz: `npm install`.

## Flujo diario
- `npm run dev` — servidor Vite con HMR (http://localhost:5173).
- Ediciones en `src/` recargan al vuelo.
- Reinicia el dev server si cambias `vite.config.js`, `package.json` o variables de entorno.

## Estructura rápida
- `src/main.jsx` — entrada React, monta `App` y aplica estilos globales.
- `src/App.jsx` — rutas SPA (`/`, `/preregistro`, `/registro`, `/login`).
- `src/Styles.css` — hoja única de estilos con variables.
- `src/pages/` — páginas de la SPA.
- `public/` — manifest, assets e íconos consumidos en runtime.

## Estilos
- Mobile-first. Ajustes de desktop con `@media` en `Styles.css`.
- Usar rutas absolutas a assets públicos (`/assets/...`, `/icons/...`).
- Mantener colores vía variables en `:root`.

## PWA en desarrollo
- El Service Worker no se registra en `npm run dev` (comportamiento esperado del plugin).
- Para probar SW y caché, usar `npm run preview` o el build desplegado.

## Lint/test
- No hay tooling de lint configurado. Si se añade (ESLint/Prettier), documentar comandos aquí.

## Commits
- Conviene agrupar por funcionalidad y mantener mensajes en español.

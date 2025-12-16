# PWA y modo offline

## Registro del Service Worker
- Lo genera automáticamente `vite-plugin-pwa` en el build (`npm run build`).
- En desarrollo (`npm run dev`) el SW no se registra; usar `npm run preview` para probarlo localmente.
- Ruta generada típica: `dist/sw.js` y `dist/manifest.webmanifest`.

## Cómo probar offline
1. Ejecuta `npm run build` y luego `npm run preview`.
2. Abre http://localhost:4173.
3. DevTools → Application → Service Workers: confirma que el SW esté "activated".
4. DevTools → Network → marca "Offline" y recarga; la app debe seguir funcionando con assets en caché.

## Actualización de caché
- Cada build cambia el hash de los assets, lo que invalida la caché previa automáticamente.
- No es necesario versionar manualmente el cache name.

## Manifest
- Definido en `public/manifest.json` (nombre, colores, íconos, start_url).
- Íconos en `public/icons/`; usa rutas absolutas `/icons/...`.

## Notas
- Debe servirse por HTTPS o `localhost` para que el SW se registre.
- Si la app cambia y no ves la actualización, refresca con "Empty cache and hard reload" o cierra/abre la pestaña para forzar la nueva versión del SW.

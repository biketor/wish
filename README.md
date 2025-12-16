# WISH — Progressive Web App (PWA)

Aplicación PWA de ejemplo (en español). Incluye service worker para soporte offline.

## Ejecutar localmente

1. Asegúrate de tener Node.js instalado.
2. Inicia el servidor local (desde la carpeta del proyecto):

```powershell
cd C:\Users\Biketor\Documents\project\wizh
node server.js 8080
```

3. Abre `http://localhost:8080` en el navegador.

## Probar modo offline

- Abre DevTools → Application → Service Workers y comprueba que el SW está registrado.
- Para simular condiciones de baja conectividad usa DevTools → Network → "Slow 3G".
- Para probar offline en un servidor real, despliega en HTTPS y luego activa "Offline".

## Notas técnicas

- Service worker: `service-worker.js` — precache individual y fallback HTML.
- Manifest: `manifest.json` (ahora usa iconos PNG en `icons/`).
- Servidor simple: `server.js` sirve archivos estáticos en `localhost:8080`.

## Contribuir

1. Crea una rama nueva: `git checkout -b feature/nombre`
2. Haz cambios, `git add` y `git commit`.
3. Haz `git push origin feature/nombre` y abre un pull request.

---
Hecho por biketor.

## Despliegue (GitHub Pages)

Se publica bajo el subpath `https://biketor.github.io/wish/`.

Cambios aplicados para compatibilidad con Pages:
- En `index.html` se añadió `<base href="/wish/">` para que las rutas resuelvan bajo el subpath.
- En `manifest.json` se configuró `start_url` y `scope` a `/wish/` y se cambiaron los iconos a PNG.
- En `service-worker.js` se usa `BASE = "/wish"` para construir rutas cacheadas y se incrementó `CACHE` a `mi-pwa-cache-v2`.

## Archivos clave

- `service-worker.js` — Service Worker con precache individual y fallback.
- `manifest.json` — Metadata PWA (icons en `icons/`).
- `server.js` — Servidor local para pruebas en `localhost:8080`.

Si quieres que use otra rama o carpeta para publicar, dímelo y ajusto el workflow.
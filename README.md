# WIZH — PWA con React + Vite

Aplicación PWA moderna construida con **React 18**, **Vite 7** y **vite-plugin-pwa**. Navegación SPA (React Router), estilos globales en CSS y soporte offline con Service Worker generado automáticamente.

## Scripts
- `npm install` — instala dependencias
- `npm run dev` — dev server con HMR (http://localhost:5173)
- `npm run build` — build optimizado en `dist/`
- `npm run preview` — sirve el build en http://localhost:4173

## Rutas
- `/` — Splash
- `/preregistro` — Registro email/Google
- `/registro` — Formulario de registro
- `/login` — Inicio de sesión

## Estructura
```
index.html              # HTML raíz (monta src/main.jsx)
vite.config.js          # Config Vite + PWA
public/
	manifest.json         # Metadata PWA
	assets/               # Imágenes (logo, fondo)
	icons/                # Íconos SVG (email, google, arrow-left)
src/
	main.jsx              # Entrada React, registra SW (plugin)
	App.jsx               # Router
	Styles.css            # Estilos globales
	pages/
		Splash.jsx
		Preregistro.jsx
		Registro.jsx
		Login.jsx
```

## PWA (vite-plugin-pwa)
- SW y manifest se generan al hacer `npm run build`.
- En desarrollo (`npm run dev`) el SW no se registra; prueba offline en `npm run preview` o en producción.
- Para ver caché/offline: DevTools → Application → Service Workers / Cache Storage.

## Desarrollo
- La mayoría de cambios se reflejan sin reiniciar gracias a HMR.
- Reinicia `npm run dev` solo si cambias `vite.config.js`, `package.json` o `.env`.

## Despliegue
- Ejecuta `npm run build` y sube `dist/` a Vercel, Netlify o GitHub Pages.

## Notas
- Assets públicos: usar rutas absolutas (`/assets/...`, `/icons/...`).
- Estilos centralizados en `src/Styles.css` con variables de color.
- No hay Service Worker manual; lo genera el plugin.

## Checklist de despliegue
- `npm run build` sin errores.
- `npm run preview` y verificación de rutas SPA.
- DevTools → Application → Service Workers: SW "activated" y manifest sin warnings.
- Prueba offline en preview (Network → Offline) y recarga.
- Revisar que `/assets` e `/icons` carguen (sin 404) y que los íconos del manifest se vean en Application → Manifest.

## Troubleshooting rápido
- **SW no se registra**: asegurarse de servir por HTTPS o `localhost`; probar con `npm run preview` en vez de `npm run dev`.
- **Offline no funciona**: confirma que el SW esté "activated" y recarga con "Empty cache and hard reload" para tomar la versión nueva.
- **Assets 404**: usar rutas absolutas (`/assets/...`, `/icons/...`) en JSX/CSS.
- **Rutas rompen al refrescar**: desplegar con soporte a SPA (fallback a `index.html`); en static hosts, configurar redirect al index.
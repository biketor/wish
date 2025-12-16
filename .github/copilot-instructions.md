# Copilot Instructions - WIZH PWA Project

## Project Overview
This is a **Progressive Web App (PWA)** built with **React 18**, **Vite**, and **vite-plugin-pwa**. It features:
- Single Page Application (SPA) with React Router for client-side navigation
- Automatic Service Worker generation via Vite PWA plugin
- Offline-first caching strategy
- Mobile-first responsive design
- Spanish language conventions throughout

## Architecture & Core Components

### Tech Stack
- **Frontend**: React 18 + React Router v6 (SPA)
- **Build Tool**: Vite v7 with `vite-plugin-pwa`
- **Styling**: CSS with CSS variables (no framework)
- **PWA**: Manifest + auto-generated Service Worker
- **Package Manager**: npm

### Key Files & Responsibilities
- **`index.html`** - HTML root; loads React app from `src/main.jsx`
- **`src/main.jsx`** - React entry point; mounts `App` component
- **`src/App.jsx`** - Router setup; defines routes (`/`, `/preregistro`, `/registro`, `/login`)
- **`src/pages/*.jsx`** - Page components (Splash, Preregistro, Registro, Login)
- **`src/Styles.css`** - Global styles with CSS variables (imports in main.jsx)
- **`vite.config.js`** - Vite + PWA plugin config; generates Service Worker automatically
- **`public/manifest.json`** - PWA metadata (name, icons, theme colors, start URL)
- **`public/assets/`** - Static images (logo, background)
- **`public/icons/`** - SVG icons (email, google, arrow-left)

### Service Worker (Auto-generated)
The `vite-plugin-pwa` automatically generates the Service Worker during build:
1. No manual `service-worker.js` needed
2. Plugin handles precaching of all assets
3. Cache version bumps automatically on build changes
4. Offline-first strategy: serves from cache, falls back to network

## Development Conventions

### Naming & Language
- **Spanish**: Variable names, component names, UI text (e.g., "Regístrate", "Iniciar sesión")
- **File naming**: React components in PascalCase (`Login.jsx`), utilities in kebab-case
- **Console output**: Spanish for developer messages

### Component Structure
- Functional components only (hooks for state/side effects if needed)
- Use React Router `useNavigate()` and `<Link>` for navigation (no full page reloads)
- Each page component in `src/pages/` corresponds to a route in `src/App.jsx`

### Routing
```jsx
// src/App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/preregistro" element={<Preregistro />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</BrowserRouter>
```

### Asset Organization
- **Static assets**: Place in `public/assets/` (images, logos)
- **Icons**: Place SVG in `public/icons/` and reference as `/icons/filename.svg`
- **Styles**: Centralized in `src/Styles.css` with CSS variables for theme colors
- **Paths**: Use absolute paths (`/icons/`, `/assets/`) in JSX and HTML

### CSS Patterns
- **Global variables** in `:root` for colors, fonts, spacing (e.g., `--color-primary: #d4af37`)
- **No CSS-in-JS**: Keep styling declarative in `Styles.css`
- **Responsive**: Mobile-first design with `@media` queries
- **No component CSS files**: All styles in single global sheet

## Development & Deployment

### Local Development
```bash
npm run dev          # Start dev server @ localhost:5173 with HMR
npm run build        # Optimize build to `dist/`
npm run preview      # Preview build locally @ localhost:4173
```

### Debugging
- **React DevTools**: Install browser extension for component inspection
- **Vite HMR**: Edits reload instantly without losing state
- **DevTools → Application**:
  - Service Workers: Check SW registration (only in production/preview)
  - Cache Storage: Inspect cached assets
  - Manifest: Verify PWA metadata

### Testing Offline (in `npm run preview`)
1. Open DevTools → Application → Service Workers
2. Verify SW is registered and active
3. Go to Network tab → toggle "Offline"
4. Reload page; should serve from cache

### Production Deployment
```bash
npm run build        # Creates optimized `dist/` folder
# Deploy `dist/` to Vercel, Netlify, or GitHub Pages
```

The PWA plugin generates `dist/sw.js` (Service Worker) and `dist/manifest.webmanifest` automatically.

## Common Tasks

### Adding a New Route
1. Create component in `src/pages/NewPage.jsx`
2. Import in `src/App.jsx` and add `<Route>`
3. Use `useNavigate()` or `<Link>` to navigate

### Adding a New Asset
1. Place image/icon in `public/assets/` or `public/icons/`
2. Reference in JSX: `<img src="/assets/logo.png" />`
3. For offline availability, build and check Cache Storage

### Styling a Component
1. Add class names (e.g., `className="form-group"`)
2. Define styles in `src/Styles.css` using class selectors
3. Use CSS variables for colors: `color: var(--color-primary)`

### Debugging Service Worker in Production
- PWA plugin logs in console: "Service Worker registered" (if enabled)
- Check `dist/sw.js` after build for auto-generated code
- Clear site data in DevTools to reset cache and re-register SW

## Notes

- **No manual Service Worker**: The plugin handles all SW logic. Don't create `service-worker.js`.
- **Relative routes**: React Router handles relative paths; no need for full URLs.
- **SSR not supported**: This is a client-side SPA. For SSR, consider Next.js.
- **Styling strategy**: Single CSS file for simplicity; consider CSS Modules or Tailwind if scaling.

---
Proyecto dirigido por biketor. Última actualización: Diciembre 2025.
- Service Worker registration fails silently if not served over HTTPS or `localhost`
- Check browser console for SW registration messages

## Integration Points & Dependencies

### PWA Registration Flow
```
index.html → checks 'serviceWorker' in navigator
          → registers 'service-worker.js'
          → logs success/error to console
```

### External References
- Theme color (`#2196f3`) used in manifest and HTML `<meta>` tag; keep in sync
- Background image path `assets/background.png` referenced in both `Styles.css` and `service-worker.js` `ARCHIVOS`

## Common Tasks

### Adding a New Feature
1. Create JS in `app.js` or reference new file in `index.html`
2. Add new stylesheet imports to `index.html` or extend `Styles.css`
3. Add resource paths to `ARCHIVOS` in `service-worker.js` for caching
4. Test offline by toggling DevTools Network "Offline" mode

### Updating Cached Assets
1. Update/add files
2. Add paths to `ARCHIVOS` array in `service-worker.js`
3. Increment `CACHE` version to invalidate old cache in deployed versions

### Mobile Testing
- Use `manifest.json` to customize install prompt and appearance
- Theme color and start URL are critical for native-like experience
- Icons must be placed at paths specified in manifest

# Copilot Instructions - WIZH PWA Project

## Project Overview
This is a **Progressive Web App (PWA)** built with vanilla HTML, CSS, and JavaScript. It demonstrates core PWA capabilities: offline functionality via service workers, installability through manifest, and responsive design. The app uses Spanish language conventions throughout.

## Architecture & Core Components

### Key Files & Responsibilities
- **`index.html`** - Entry point; registers service worker and imports CSS/JS
- **`app.js`** - Main application logic (currently minimal; extend here for features)
- **`service-worker.js`** - Cache-first strategy for offline support; defines `ARCHIVOS` array of cacheable resources
- **`manifest.json`** - PWA metadata (name, icons, theme colors, start URL)
- **`Styles.css`** - Global styles; currently sets full-viewport background image from `assets/background.png`

### Service Worker Caching Strategy
The app uses a **cache-first** pattern (defined in `service-worker.js`):
1. On `install` event: Pre-caches all files listed in `ARCHIVOS`
2. On `fetch` event: Serves from cache if available; falls back to network
3. Update `ARCHIVOS` array when adding new resources (images, CSS, JS)
4. Increment cache version (`CACHE = "mi-pwa-cache-v1"`) after changes to force updates

**Critical naming issue**: `service-worker.js` caches `"/styles.css"` but actual file is `Styles.css` (capital S). Ensure case consistency on case-sensitive servers.

## Development Conventions

### Naming & Language
- **Spanish naming**: File/variable names use Spanish (e.g., `ARCHIVOS`, `CACHE`)
- **File naming**: CSS uses PascalCase (`Styles.css`); JS uses kebab-case (`service-worker.js`)
- **Console output**: Use Spanish for developer messages (`"Service Worker registrado"`)

### Asset Organization
- **Static assets**: Place in `/assets/` directory (e.g., `assets/background.png`)
- **Icons**: Reference in `manifest.json` points to `/icons/icon-192.png` and `/icon-512.png` (create if missing)
- **Paths**: Use absolute paths in HTML/manifest (`/index.html`, `/assets/`, not relative paths)

### CSS Patterns
- Commented-out flexbox pattern in `Styles.css` shows intended layout (centered text); uncomment to use
- Background image uses `cover` + `center` positioning (responsive across devices)
- No component-specific CSS files; all styles in single `Styles.css`

## Testing & Deployment

### Debugging
- Chrome DevTools debug config available in `.vscode/launch.json`
- Service Worker debugging: DevTools → Application tab → Service Workers
- Cache inspection: DevTools → Application tab → Cache Storage
- Test offline mode: DevTools → Network tab → toggle "Offline"

### Local Development
- Use a local HTTP server (PWAs require HTTPS in production or `localhost`)
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

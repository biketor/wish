const CACHE = "mi-pwa-cache-v1";
const ARCHIVOS = [
  "/index.html",
  "/Styles.css",
  "/app.js",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/assets/background.png",
  "/imagenes%20wizh/optimizadas/logo.png"
];

// Simple offline fallback HTML (shown when resource is not cached and offline)
const OFFLINE_FALLBACK = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PWA - Sin Conexión</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #2196f3; color: #fff; text-align: center; }
    h1 { font-size: 2em; }
    p { font-size: 1.2em; }
  </style>
</head>
<body>
  <div>
    <h1>PWA Offline</h1>
    <p>Sin conexión de internet</p>
    <p>Intenta reconectar o recarga la página</p>
  </div>
</body>
</html>`;

// Install: precache files and activate immediately
self.addEventListener("install", (event) => {
  console.log('[SW] install event');
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Try to cache each file individually so one failure doesn't block all
      for (const url of ARCHIVOS) {
        try {
          const resp = await fetch(url, { cache: 'reload' });
          if (resp.ok) {
            await cache.put(url, resp);
            console.log('[SW] cached', url);
          } else {
            console.warn('[SW] fetch failed for', url, resp.status);
          }
        } catch (e) {
          console.error('[SW] error caching', url, e.message);
        }
      }
      console.log('[SW] precache complete');
    })()
  );
});

// Activate: delete old caches and take control of clients
self.addEventListener("activate", (event) => {
  console.log('[SW] activate event');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE) {
          console.log('[SW] deleting old cache', key);
          return caches.delete(key);
        }
      })
    ))
    .then(() => { console.log('[SW] claim clients'); return self.clients.claim(); })
  );
});

// Fetch: try cache first, then network, with navigation fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  
  try { console.log('[SW] fetch', request.method, request.url, '| navigation:', isNavigation); } catch (e) {}
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // If found in cache, return it
      if (cachedResponse) {
        console.log('[SW] returning from cache:', request.url);
        return cachedResponse;
      }
      
      // Not in cache, try network
      return fetch(request).then(networkResponse => {
        console.log('[SW] returning from network:', request.url);
        return networkResponse;
      }).catch((error) => {
        console.error('[SW] fetch failed for', request.url, error.message);
        
        // On failure (offline), provide fallback for navigation requests
        if (isNavigation) {
          console.log('[SW] offline navigation - returning index.html or fallback');
          // Return cached index.html or offline page
          return caches.match('/index.html').then(cachedIndex => {
            if (cachedIndex) {
              console.log('[SW] serving cached index.html');
              return cachedIndex;
            }
            console.log('[SW] serving offline fallback page');
            return new Response(OFFLINE_FALLBACK, { 
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
              status: 200
            });
          });
        }
        
        // For non-navigation requests offline, return error response
        console.log('[SW] offline non-navigation - returning 503');
        return new Response('Offline - resource not cached', { status: 503 });
      });
    })
  );
});
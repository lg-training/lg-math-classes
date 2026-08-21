const CACHE_NAME = 'pizza-fracciones-v7';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// La pagina puede pedir activar de inmediato la version nueva.
self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

function isVersionCheck(request) {
  return new URL(request.url).pathname.endsWith('/version.txt');
}

function isAppShell(request) {
  if (request.mode === 'navigate') return true;
  return /\.(html|css|js)$/.test(new URL(request.url).pathname);
}

// Network-first para el shell (HTML/CSS/JS) y para version.txt:
// asi una version nueva se ve en cuanto hay red, con fallback a cache offline.
// Cache-first para el resto (iconos, manifest): rapido y estable.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isVersionCheck(request)) {
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(() => new Response('', { status: 504 })));
    return;
  }

  if (isAppShell(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});

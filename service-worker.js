var version;// Change number to update the cache
version = "v1.0.0";//beta
version = "v1.0.1";//fix typing and focus conflict
version = "v1.0.2";//add input to sliders
version = "v1.0.3";//draggable modal + add buble to end of code
version = "v1.0.4";//homepage
const PRECACHE = 'precache-'+version;
const RUNTIME = 'runtime';

const PRECACHE_URLS = [
  './editor.html',
  './css/bootstrap/bootstrap.min.css',
  './css/editor.css',
  './js/ace/ace.js',
  './js/beautify.min.js',
  './js/pegParser.js',
  './js/pegReverser.js',
  './js/injection.js',
  './js/popper.min.js',
  './js/bootstrap/bootstrap.min.js',
  './js/editor.js',
  './images/icones2/add.png',
  './images/icones/add.png',
  './images/icones2/background.png',
  './images/icones/background.png',
  './images/icones2/txt.png',
  './images/icones/txt.png',
  './images/icones2/img.png',
  './images/icones/img.png',
  './images/icones2/draw.png',
  './images/icones/draw.png',
  './images/icones2/balao.png',
  './images/icones/balao.png',
  './images/icones2/help.png',
  './images/icones/help.png',
  './images/icones2/down.png',
  './images/icones/down.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
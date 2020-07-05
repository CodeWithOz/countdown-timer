var cacheName = 'offline-countdown-timer';
var filesToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/script.js',
  '/audio/analog-watch-alarm_daniel-simion.mp3',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  console.log('[service worker] installed, skipping wait step');
  console.log('[service worker] skipped wait step');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    }).catch(err => {
      console.log('err:', err);
      return Promise.resolve();
    })
  );
});

self.addEventListener('activate', e => {
  console.log('[service worker] activated, claiming control without reload');
  self.clients.claim();
  console.log('[service worker] control has been claimed without reload');
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if (/^2/.test(String(response.status))) {
            // the network response has status code 2xx
            // so we add to cache
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(function(errRes) {
          // the request failed, so we return the response without caching
          return errRes;
        });
      });
    })
  );
});

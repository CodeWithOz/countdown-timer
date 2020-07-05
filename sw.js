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

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
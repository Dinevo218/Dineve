const CACHE_NAME = 'dinevo-menu-cache-v1';
const urlsToCache = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  // Add images used in your menu
  'images/WhatsApp Image 2025-07-01 at 4.39.25 PM.jpg',
  'images/Khow suey.jpg',
  'images/Lotus Biscoff.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

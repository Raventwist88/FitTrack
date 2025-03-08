const CACHE_NAME = 'fittrack-v1';
const ASSETS_TO_CACHE = [
    '/FitTrack/',
    '/FitTrack/index.html',
    '/FitTrack/manifest.json',
    '/FitTrack/offline.html',
    '/FitTrack/icons/icon-72x72.png',
    '/FitTrack/icons/icon-96x96.png',
    '/FitTrack/icons/icon-128x128.png',
    '/FitTrack/icons/icon-144x144.png',
    '/FitTrack/icons/icon-152x152.png',
    '/FitTrack/icons/icon-192x192.png',
    '/FitTrack/icons/icon-384x384.png',
    '/FitTrack/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((response) => {
                        // Cache new responses for future offline use
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    });
            })
            .catch(() => {
                // Return offline fallback if both cache and network fail
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            })
    );
}); 
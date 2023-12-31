const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    'about.html',
    'css/style.css',
    'js/main.js'
]

// Call Install Event

self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log(`Service Worker Caching: Error: ${err}`))
    );
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // clients loaded in the same scope do not need to be reloaded before their fetches will go through this service worker.
    // e.waitUntil(clients.claim());
    //Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName ){
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => clients.claim())
        .catch(err => console.log(`Service Worker Clearing Old Cach + client.claim: Error: ${err}`))
    );
});

// Call Fetch Event to load from local cache when browser is offline
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request).catch(() => {
            caches.match(e.request);
            console.log("Browser is Offline: Loading content from SW-Cache");
        }

        )
    )
});

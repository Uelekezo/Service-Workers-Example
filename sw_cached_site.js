const cacheName = 'v2';



// Call Install Event

self.addEventListener('install', e => {
    console.log(`Service Worker: Installed ${e}`);

});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
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
    );
});

// Call Fetch Event to load from local cache when browser is offline
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
       fetch(e.request)
           .then(res => {
               // Make clone of reponse(site)
               const resClone = res.clone();
               // Open cache
               caches
                   .open(cacheName)
                   .then(cache => {
                       // Add Response to cache
                       cache.put(e.request, resClone);
                   });
               return res;
           }).catch(err => {
               console.log(`Service Worker Offline Cache : ${err}`);
           caches.match(e.request).then(res => res);
       }

       )
    );
});
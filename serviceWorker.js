// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache
const precacheResources = ['/', '/index.html', '/sheets.js'];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log("Installed");
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => { });

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            console.log("Network ok");
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        console.log("Network failed, cache response: " + cachedResponse);
        return cachedResponse || Response.error();
    }
}

// When there's an incoming fetch request, try the network first and respond with the cache if that fails
self.addEventListener('fetch', (event) => {
    console.log("Fetching " + event.request.url);
    event.respondWith(networkFirst(event.request));
});


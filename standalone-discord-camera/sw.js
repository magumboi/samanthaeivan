/**
 * Service Worker for Standalone Discord Camera
 * Enables offline capabilities and PWA features
 */

const CACHE_NAME = 'discord-camera-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './assets/style.css',
    './assets/app.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip Discord webhook requests
    if (event.request.url.includes('discord.com/api/webhooks')) {
        return;
    }
    
    // Skip external font requests in offline mode
    if (event.request.url.includes('fonts.googleapis.com') || 
        event.request.url.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
                .catch(() => {
                    // Return empty response if font fails
                    return new Response('', { status: 200 });
                })
        );
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response for caching
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});

// Background sync for failed uploads (if supported)
self.addEventListener('sync', (event) => {
    if (event.tag === 'discord-upload') {
        console.log('Service Worker: Background sync for Discord upload');
        // Handle background upload retry logic here
        event.waitUntil(handleBackgroundUpload());
    }
});

// Handle background upload retry
async function handleBackgroundUpload() {
    // This would handle retrying failed Discord uploads
    // Implementation would depend on storing failed uploads in IndexedDB
    console.log('Service Worker: Handling background upload retry');
}

// Push notification support (future feature)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push message received');
    
    const options = {
        body: 'Nueva actualización disponible',
        icon: './assets/icon-192.png',
        badge: './assets/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Abrir cámara',
                icon: './assets/checkmark.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: './assets/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Cámara Discord', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
/**
 * GenTech ISP Service Worker
 * Provides offline capabilities, caching strategies, and background sync
 */

const CACHE_NAME = 'gentech-isp-v1.0.0';
const STATIC_CACHE_NAME = 'gentech-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'gentech-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/js/performance.js',
    '/manifest.json',
    // Add fonts and critical assets
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Assets to cache on demand
const DYNAMIC_ASSETS = [
    '/assets/images/',
    'https://cdn.tailwindcss.com'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
    '/api/',
    '/contact',
    '/pricing'
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('Service Worker: Installation failed', err);
            })
    );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event Handler - Caching Strategies
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different caching strategies based on request type
    if (isStaticAsset(request.url)) {
        // Static assets: Cache First
        event.respondWith(cacheFirst(request));
    } else if (isNetworkFirst(request.url)) {
        // API calls: Network First
        event.respondWith(networkFirst(request));
    } else if (isDynamicAsset(request.url)) {
        // Images and dynamic content: Stale While Revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Default: Network First with fallback
        event.respondWith(networkFirstWithFallback(request));
    }
});

/**
 * Caching Strategy: Cache First
 * Good for static assets that rarely change
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        console.error('Cache First strategy failed:', error);
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Caching Strategy: Network First
 * Good for API calls and real-time data
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html') || createOfflineResponse();
        }
        
        return createOfflineResponse();
    }
}

/**
 * Caching Strategy: Stale While Revalidate
 * Good for images and content that can be slightly outdated
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Fetch fresh version in background
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Silently fail background update
    });
    
    // Return cached version immediately if available
    return cachedResponse || fetchPromise;
}

/**
 * Caching Strategy: Network First with Fallback
 * Default strategy with offline fallback
 */
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return appropriate fallback based on request type
        if (request.destination === 'image') {
            return createImageFallback();
        }
        
        if (request.mode === 'navigate') {
            return createOfflinePageFallback();
        }
        
        return createOfflineResponse();
    }
}

/**
 * Background Sync for form submissions
 */
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForms());
    }
    
    if (event.tag === 'speed-test-sync') {
        event.waitUntil(syncSpeedTests());
    }
});

/**
 * Push Notifications
 */
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from GenTech ISP',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('GenTech ISP', options)
    );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification click received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Utility Functions
 */
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('fonts.googleapis.com') ||
           url.includes('font-awesome');
}

function isNetworkFirst(url) {
    return NETWORK_FIRST.some(path => url.includes(path));
}

function isDynamicAsset(url) {
    return url.includes('/assets/images/') ||
           url.includes('.jpg') ||
           url.includes('.png') ||
           url.includes('.gif') ||
           url.includes('.webp') ||
           url.includes('.svg');
}

function createOfflineResponse() {
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'You are currently offline. Please check your connection.'
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

function createImageFallback() {
    // Return a simple SVG placeholder
    const svg = `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1f2937"/>
            <text x="50%" y="50%" fill="#9ca3af" text-anchor="middle" dy=".3em">
                Image Unavailable
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}

function createOfflinePageFallback() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - GenTech ISP</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #1f2937, #111827);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    text-align: center;
                }
                .container { max-width: 400px; padding: 2rem; }
                h1 { color: #22c55e; margin-bottom: 1rem; }
                p { color: #9ca3af; margin-bottom: 2rem; }
                button {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>You're Offline</h1>
                <p>It looks like you've lost your internet connection. Don't worry, some content is still available offline.</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

/**
 * Background sync functions
 */
async function syncContactForms() {
    try {
        // Get stored form submissions from IndexedDB
        const db = await openDB();
        const tx = db.transaction(['contact-forms'], 'readonly');
        const store = tx.objectStore('contact-forms');
        const forms = await store.getAll();
        
        // Submit each form
        for (const form of forms) {
            try {
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form.data)
                });
                
                // Remove from storage after successful submission
                const deleteTx = db.transaction(['contact-forms'], 'readwrite');
                const deleteStore = deleteTx.objectStore('contact-forms');
                await deleteStore.delete(form.id);
            } catch (error) {
                console.error('Failed to sync form:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

async function syncSpeedTests() {
    // Similar implementation for speed test results
    console.log('Syncing speed test results...');
}

/**
 * IndexedDB helper
 */
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('gentech-offline', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = () => {
            const db = request.result;
            
            if (!db.objectStoreNames.contains('contact-forms')) {
                db.createObjectStore('contact-forms', { keyPath: 'id', autoIncrement: true });
            }
            
            if (!db.objectStoreNames.contains('speed-tests')) {
                db.createObjectStore('speed-tests', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

console.log('Service Worker: Script loaded');

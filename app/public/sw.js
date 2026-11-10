// Service worker mínimo: necesario para que Android ofrezca instalar la PWA.
// No cachea datos del chat; todo va a red.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})

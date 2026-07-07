import { precacheAndRoute } from 'workbox-precaching'

// Vite injects the entire bundled asset list here at build time
precacheAndRoute(self.__WB_MANIFEST)

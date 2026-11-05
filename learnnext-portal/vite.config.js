import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Installable app (PWA): manifest + a service worker that caches the app shell so it opens instantly and works
    // offline (the OfflineGate screen covers anything that needs the network). registerType 'prompt': a new version
    // waits until the user taps Reload in the update toast (PwaPrompts.jsx) — never swapped in under someone mid-task.
    // Icons come from `npx pwa-assets-generator` (pwa-assets.config.js).
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'LearnNext',
        short_name: 'LearnNext',
        description: 'Manage clients, programs, facilitators and support for LearnNext.',
        id: '/',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#2a69b2',
        background_color: '#f4f6fb',
        categories: ['business', 'education', 'productivity'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        // Long-press the home-screen icon (Android) to jump straight to these
        shortcuts: [
          { name: 'All Clients', short_name: 'Clients', url: '/clients', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Facilitators', url: '/facilitators', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Support desk', short_name: 'Support', url: '/support', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // App shell + every built chunk; any in-app address falls back to index.html (SPA routing)
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // Google Fonts: stylesheet refreshes in the background, font files cached for a year
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-css' } },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
          // Remote photos (demo avatars, people) — shown from cache, refreshed when online
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'remote-images', expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});

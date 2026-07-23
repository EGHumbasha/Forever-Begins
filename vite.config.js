import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base './' + HashRouter = the same build runs on ANY host:
// GitHub Pages subpath, Vercel, Netlify, or a local folder.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Cache only stable assets. JS is NetworkFirst below so a new
        // deploy can never be broken by a stale cached bundle.
        globPatterns: ['**/*.{css,html,svg,ico,webmanifest}'],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Any host, any JS chunk: fresh from network, cache as offline fallback
            urlPattern: /\/assets\/.*\.js$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 60, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
      manifest: {
        name: 'Forever Begins',
        short_name: 'Forever Begins',
        description: 'Lobola & Wedding Planner',
        theme_color: '#0b3d2e',
        background_color: '#f6efe2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  base: './',
  build: { outDir: 'dist' },
})

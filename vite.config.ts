import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  registerType: 'autoUpdate',

  manifest: {
    id: '/',
    name: 'Templify',
    short_name: 'Templify',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icons/templify-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/templify-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },

  workbox: {

    // 🔥 THIS FIXES YOUR ERROR
    globPatterns: [],

    runtimeCaching: [

      {
        urlPattern: ({ url }) =>
          url.pathname.startsWith('/api/'),
        handler: 'NetworkOnly'
      },

      {
        urlPattern: ({ request }) =>
          request.mode === 'navigate',
        handler: 'NetworkFirst'
      },

      {
        urlPattern: ({ request }) =>
          request.destination === 'style',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'style-cache'
        }
      },

      {
        urlPattern: ({ request }) =>
          request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30
          }
        }
      }

    ]
  }
}),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

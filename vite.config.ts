import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "Templify",
        short_name: "Templify",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
          {
            src: "/icons/templify_icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/templify_icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/mobile.jpg",
            sizes: "390x844",
            type: "image/jpg",
            form_factor: "narrow",
          },
          {
            src: "/screenshots/desktop.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          // API calls should always be fresh
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkOnly",
          },

          // Always fresh HTML
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
          },

          // Cache CSS safely
          {
            urlPattern: ({ request }) => request.destination === "style",
            handler: "StaleWhileRevalidate",
          },

          // Cache images safely
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

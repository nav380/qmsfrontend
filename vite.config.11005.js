import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically update service worker
      devOptions: {
        enabled: true, // Enable PWA in development
      },
      manifest: {
        name: "My React PWA",
        short_name: "ReactPWA",
        description: "An awesome React PWA built with Vite",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon-192x192.png", // Path to 192x192 icon in the public folder
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png", // Path to 512x512 icon in the public folder
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 11005,
    host: "0.0.0.0",
  },
});

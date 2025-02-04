import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'To-Do App',
        short_name: 'ToDo',
        description: 'A simple To-Do PWA',
        theme_color: '#ffffff',
        background_color: "#ffffff",
        display: "standalone",

        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}']
      }
    })
  ]
});

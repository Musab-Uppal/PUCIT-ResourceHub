import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 — no config file needed, reads CSS directly
  ],
  server: {
    proxy: {
      // Proxy /api calls to the backend during dev so we avoid CORS issues
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Any request to /api/* gets proxied to the real backend.
      // This runs server-side so there are NO browser CORS restrictions.
      '/api': {
        target: 'https://backend.jotish.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/backend_dev'),
      },
    },
  },
})

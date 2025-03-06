import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  proxy: {
    // Using the proxy instance
    '/auth': {
      target: 'https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/auth/, ''),
    },
  },
  server: {
    port: 8080,
  },
  plugins: [react()],
})

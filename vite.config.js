import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  plugins: [react()],
})

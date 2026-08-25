import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5176,
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '10.139.216.115',
      'circle-oxidizing-joyride.ngrok-free.dev',
      '.ngrok-free.dev'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { envEditorPlugin } from './vite-env-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), envEditorPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

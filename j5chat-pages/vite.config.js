import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/custom/', // 👈 this is required so routing works in /custom/ path
})

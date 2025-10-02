import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5181
  },
  define: {
    'import.meta.env': 'import.meta.env'
  }
})

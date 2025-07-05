import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/      
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./index.html", // Corrected to use a relative path
      }
    }
  }
})
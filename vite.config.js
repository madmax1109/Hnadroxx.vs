import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'handroxx',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'handroxx/index.html')
      }
    }
  }
})
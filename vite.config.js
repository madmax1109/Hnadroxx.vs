import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'handroxx',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: resolve(__dirname, 'handroxx/index.html'),
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  publicDir: 'public'
})
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['monaco-editor', 'yjs', 'y-websocket', 'y-monaco'],
  },
});
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'examples',
  server: {
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: '../dist/demo',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'examples/index.html'),
        vanilla: resolve(process.cwd(), 'examples/vanilla-index.html'),
        workflow: resolve(process.cwd(), 'examples/workflow-index.html')
      }
    }
  }
});

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(process.cwd(), 'src/index.ts'),
      name: 'map',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'topo-map.umd.js')
    }
  }
});

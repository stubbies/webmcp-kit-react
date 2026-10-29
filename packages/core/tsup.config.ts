import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react/jsx-runtime', 'use-webmcp-tool', 'zod'],
  banner: {
    js: "'use client';",
  },
});

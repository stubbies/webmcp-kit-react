import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-hook-form', '@react-webmcp-kit/core', 'zod'],
  banner: { js: "'use client';" },
});

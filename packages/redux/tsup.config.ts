import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-redux',
    '@reduxjs/toolkit',
    '@webmcp-kit/react',
    'zod',
  ],
  banner: { js: "'use client';" },
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['../core/vitest.setup.ts'],
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
});

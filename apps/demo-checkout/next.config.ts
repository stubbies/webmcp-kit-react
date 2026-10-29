import type { NextConfig } from 'next';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: [
    '@webmcp-kit/react',
    '@webmcp-kit/react-hook-form',
    '@webmcp-kit/zustand',
    'use-webmcp-tool',
  ],
};

export default nextConfig;

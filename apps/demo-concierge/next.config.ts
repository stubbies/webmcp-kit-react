import type { NextConfig } from 'next';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: [
    '@react-webmcp-kit/core',
    '@react-webmcp-kit/react-hook-form',
    '@react-webmcp-kit/redux',
    'use-webmcp-tool',
  ],
};

export default nextConfig;

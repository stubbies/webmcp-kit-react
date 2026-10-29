'use client';

import { McpDevTools, McpProvider, installWebMcpPolyfill } from '@webmcp-kit/react';
import { useEffect, type ReactNode } from 'react';

let polyfillInstalled = false;

export function McpShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!polyfillInstalled) {
      installWebMcpPolyfill();
      polyfillInstalled = true;
    }
  }, []);

  return (
    <McpProvider>
      {children}
      {process.env.NODE_ENV === 'development' && <McpDevTools />}
    </McpProvider>
  );
}

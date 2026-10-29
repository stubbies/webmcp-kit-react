'use client';

import { McpDevTools, McpProvider, installWebMcpPolyfill } from '@react-webmcp-kit/core';
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
      <McpDevTools />
    </McpProvider>
  );
}

'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { McpShell } from '@/components/McpShell';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <McpShell>{children}</McpShell>
    </Provider>
  );
}

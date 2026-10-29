'use client';

import type { ReactNode } from 'react';
import { DataMeshLayout } from './DataMeshLayout';
import { LedgerWindowProvider } from './LedgerWindowContext';
import { McpShell } from './McpShell';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <McpShell>
      <LedgerWindowProvider>
        <DataMeshLayout>{children}</DataMeshLayout>
      </LedgerWindowProvider>
    </McpShell>
  );
}

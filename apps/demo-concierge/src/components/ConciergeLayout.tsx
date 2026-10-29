'use client';

import { AppNav } from '@/components/AppNav';
import { TripSummaryStrip } from '@/components/TripSummaryStrip';
import { TripMcpTools } from '@/mcp/tripMcpTools';
import type { ReactNode } from 'react';

export function ConciergeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TripMcpTools />
      <main>
        <AppNav />
        <TripSummaryStrip />
        {children}
      </main>
    </>
  );
}

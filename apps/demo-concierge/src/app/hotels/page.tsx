'use client';

import { Suspense } from 'react';
import { HotelsPageContent } from '@/app/hotels/HotelsPageContent';

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="card">Loading hotels…</div>}>
      <HotelsPageContent />
    </Suspense>
  );
}

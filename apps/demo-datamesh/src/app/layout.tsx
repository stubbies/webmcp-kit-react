import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebMCP Demo — B2B Financial Data-Mesh',
  description:
    'High-capacity client filtering hooks and Next.js Server Action ledger windows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

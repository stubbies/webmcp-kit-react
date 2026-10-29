import type { Metadata } from 'next';
import { ConciergeLayout } from '@/components/ConciergeLayout';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebMCP Demo — Hotel & Flight Concierge',
  description: 'Dynamic contextual WebMCP tools across Next.js App Router routes',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConciergeLayout>{children}</ConciergeLayout>
          {modal}
        </Providers>
      </body>
    </html>
  );
}

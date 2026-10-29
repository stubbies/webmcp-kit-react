import type { Metadata } from 'next';
import { McpShell } from '@/components/McpShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebMCP Demo — Agentic Checkout',
  description: 'Multi-step checkout with WebMCP tools for AI agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <McpShell>{children}</McpShell>
      </body>
    </html>
  );
}

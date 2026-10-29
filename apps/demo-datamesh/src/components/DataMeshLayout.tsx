'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { WindowStrip } from './WindowStrip';

const links = [
  { href: '/', label: 'Hub' },
  { href: '/ledger', label: 'Ledger' },
  { href: '/accounts', label: 'Accounts' },
];

export function DataMeshLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div>
            <p className="eyebrow">Demo 3 · Financial Data-Mesh</p>
            <h1>Enterprise ledger mesh</h1>
          </div>
          <nav className="steps">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <WindowStrip />
        {children}
      </main>
    </>
  );
}

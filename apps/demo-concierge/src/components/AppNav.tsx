'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Hub' },
  { href: '/search', label: 'Search' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/flights', label: 'Flights' },
  { href: '/trip', label: 'Trip' },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="steps" aria-label="Concierge navigation">
      {LINKS.map((link) => {
        const active =
          link.href === '/'
            ? pathname === '/'
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link key={link.href} href={link.href} className={active ? 'active' : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

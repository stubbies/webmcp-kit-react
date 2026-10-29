'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STEPS = [
  { href: '/', label: 'Catalog' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/confirmation', label: 'Confirmation' },
];

export function StepNav() {
  const pathname = usePathname();
  return (
    <nav className="steps" aria-label="Checkout steps">
      {STEPS.map((step) => (
        <Link
          key={step.href}
          href={step.href}
          className={pathname === step.href ? 'active' : undefined}
        >
          {step.label}
        </Link>
      ))}
    </nav>
  );
}

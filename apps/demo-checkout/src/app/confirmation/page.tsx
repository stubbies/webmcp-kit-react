'use client';

import { useMcpTool } from '@react-webmcp-kit/core';
import Link from 'next/link';
import { z } from 'zod';
import { StepNav } from '@/components/StepNav';
import { useCartStore } from '@/store/cartStore';

export default function ConfirmationPage() {
  const orderId = useCartStore((s) => s.orderId);
  const setCheckoutStatus = useCartStore((s) => s.setCheckoutStatus);
  const setOrderId = useCartStore((s) => s.setOrderId);

  useMcpTool({
    name: 'get_order_status',
    description: 'Returns the current order confirmation status (read-only)',
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    execute: () => ({
      orderId,
      status: orderId ? 'confirmed' : 'none',
    }),
  });

  return (
    <>
      <StepNav />
      <h1>Confirmation</h1>
      <div className="card">
        {orderId ? (
          <>
            <p>Thank you! Your order is confirmed.</p>
            <p>
              Order ID: <strong>{orderId}</strong>
            </p>
          </>
        ) : (
          <p>No order yet. Complete checkout first.</p>
        )}
        <Link
          href="/"
          onClick={() => {
            setCheckoutStatus('idle');
            setOrderId(null);
          }}
        >
          Start new order
        </Link>
      </div>
    </>
  );
}

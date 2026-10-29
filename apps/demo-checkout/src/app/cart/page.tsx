'use client';

import Link from 'next/link';
import { StepNav } from '@/components/StepNav';
import { CartMcpTools } from '@/components/CartMcpTools';
import { PRODUCTS, useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setLineQty = useCartStore((s) => s.setLineQty);
  const cartTotal = useCartStore((s) => s.cartTotal);

  return (
    <>
      <CartMcpTools />
      <StepNav />
      <h1>Cart</h1>
      {lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {lines.map((line) => {
            const product = PRODUCTS.find((p) => p.id === line.productId);
            if (!product) return null;
            return (
              <div key={line.productId} className="card">
                <strong>{product.name}</strong>
                <div className="field" style={{ marginTop: 12 }}>
                  <label htmlFor={`qty-${line.productId}`}>Quantity</label>
                  <input
                    id={`qty-${line.productId}`}
                    type="number"
                    min={0}
                    value={line.qty}
                    onChange={(e) => setLineQty(line.productId, Number(e.target.value))}
                  />
                </div>
                <div style={{ fontSize: 14 }}>${(product.price * line.qty).toFixed(2)}</div>
              </div>
            );
          })}
          <p>
            <strong>Total: ${cartTotal().toFixed(2)}</strong>
          </p>
          <Link href="/checkout" className="primary" style={{ display: 'inline-block' }}>
            Continue to checkout →
          </Link>
        </>
      )}
    </>
  );
}

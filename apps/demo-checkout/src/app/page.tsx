'use client';

import { StepNav } from '@/components/StepNav';
import { CartMcpTools } from '@/components/CartMcpTools';
import { PRODUCTS, useCartStore } from '@/store/cartStore';

export default function CatalogPage() {
  const addToCart = useCartStore((s) => s.addToCart);
  const lines = useCartStore((s) => s.lines);

  return (
    <>
      <CartMcpTools />
      <StepNav />
      <h1>Catalog</h1>
      <p style={{ color: '#71717a', marginTop: 0 }}>
        Use WebMCP tools <code>add_to_cart</code> or add items manually. Open MCP DevTools (bottom
        right) to mock-invoke tools.
      </p>
      {PRODUCTS.map((p) => (
        <div key={p.id} className="card">
          <strong>{p.name}</strong>
          <div style={{ color: '#71717a', fontSize: 14 }}>
            {p.id} · ${p.price.toFixed(2)}
          </div>
          <button
            type="button"
            className="primary"
            style={{ marginTop: 12 }}
            onClick={() => addToCart(p.id)}
          >
            Add to cart
          </button>
        </div>
      ))}
      <p style={{ fontSize: 14 }}>
        Cart items: {lines.reduce((n, l) => n + l.qty, 0)}
      </p>
    </>
  );
}

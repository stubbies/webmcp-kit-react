'use client';

import { McpStoreTools } from '@webmcp-kit/zustand';
import { z } from 'zod';
import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';

export function CartMcpTools() {
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setLineQty = useCartStore((s) => s.setLineQty);

  const tools = useMemo(
    () => [
      {
        name: 'add_to_cart',
        description: 'Add a product to the shopping cart by product id (sku-1, sku-2, sku-3)',
        schema: z.object({
          productId: z.enum(['sku-1', 'sku-2', 'sku-3']),
          qty: z.number().int().min(1).default(1),
        }),
        execute: ({ productId, qty }: { productId: string; qty: number }) => {
          addToCart(productId, qty);
          return { success: true, productId, qty };
        },
      },
      {
        name: 'remove_from_cart',
        description: 'Remove a product line from the cart',
        schema: z.object({ productId: z.enum(['sku-1', 'sku-2', 'sku-3']) }),
        execute: ({ productId }: { productId: string }) => {
          removeFromCart(productId);
          return { success: true, productId };
        },
      },
      {
        name: 'set_cart_qty',
        description: 'Set quantity for a cart line; qty 0 removes the line',
        schema: z.object({
          productId: z.enum(['sku-1', 'sku-2', 'sku-3']),
          qty: z.number().int().min(0),
        }),
        execute: ({ productId, qty }: { productId: string; qty: number }) => {
          setLineQty(productId, qty);
          return { success: true, productId, qty };
        },
      },
    ],
    [addToCart, removeFromCart, setLineQty],
  );

  return <McpStoreTools tools={tools} />;
}

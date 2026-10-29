import { create } from 'zustand';

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartLine = {
  productId: string;
  qty: number;
};

export const PRODUCTS: Product[] = [
  { id: 'sku-1', name: 'Wireless Mouse', price: 29.99 },
  { id: 'sku-2', name: 'Mechanical Keyboard', price: 89.99 },
  { id: 'sku-3', name: 'USB-C Hub', price: 49.99 },
];

export type CheckoutStatus = 'idle' | 'submitting' | 'confirmed';

export type CheckoutState = {
  lines: CartLine[];
  checkoutStatus: CheckoutStatus;
  orderId: string | null;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setLineQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCheckoutStatus: (status: CheckoutStatus) => void;
  setOrderId: (id: string | null) => void;
  cartTotal: () => number;
};

export const useCartStore = create<CheckoutState>((set, get) => ({
  lines: [],
  checkoutStatus: 'idle',
  orderId: null,
  addToCart: (productId, qty = 1) => {
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { productId, qty }] };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) }));
  },
  setLineQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      lines: state.lines.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    }));
  },
  clearCart: () => set({ lines: [] }),
  setCheckoutStatus: (checkoutStatus) => set({ checkoutStatus }),
  setOrderId: (orderId) => set({ orderId }),
  cartTotal: () => {
    const { lines } = get();
    return lines.reduce((sum, line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      return sum + (product?.price ?? 0) * line.qty;
    }, 0);
  },
}));

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { McpFormTools, useMcpSubmitTool } from '@react-webmcp-kit/react-hook-form';
import { useMcpTool } from '@react-webmcp-kit/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { StepNav } from '@/components/StepNav';
import { useCartStore } from '@/store/cartStore';

const checkoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  cardLast4: z.string().regex(/^\d{4}$/, 'Must be 4 digits'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const setCheckoutStatus = useCartStore((s) => s.setCheckoutStatus);
  const setOrderId = useCartStore((s) => s.setOrderId);
  const clearCart = useCartStore((s) => s.clearCart);
  const checkoutStatus = useCartStore((s) => s.checkoutStatus);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      fullName: '',
      address: '',
      city: '',
      cardLast4: '',
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setCheckoutStatus('submitting');
    await new Promise((r) => setTimeout(r, 800));
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(orderId);
    clearCart();
    setCheckoutStatus('confirmed');
    router.push('/confirmation');
    return { success: true, orderId, ...data };
  };

  useMcpSubmitTool({
    form,
    name: 'submit_checkout',
    description:
      'Validate and submit the checkout form. Returns validation errors or success with order id.',
    enabled: lines.length > 0,
    onValidSubmit: onSubmit,
  });

  useMcpTool({
    name: 'get_checkout_state',
    description: 'Read current checkout form values and validation errors (read-only)',
    schema: z.object({}),
    annotations: { readOnlyHint: true },
    execute: () => ({
      values: form.getValues(),
      errors: form.formState.errors,
      cartItemCount: lines.length,
    }),
  });

  const fieldDefs = [
    {
      name: 'email' as const,
      description: 'Populates email in checkout section',
      schema: z.object({ value: z.string().email() }),
    },
    {
      name: 'fullName' as const,
      description: 'Populates full name on checkout form',
      schema: z.object({ value: z.string().min(2) }),
    },
    {
      name: 'address' as const,
      description: 'Populates shipping street address',
      schema: z.object({ value: z.string().min(5) }),
    },
    {
      name: 'city' as const,
      description: 'Populates shipping city',
      schema: z.object({ value: z.string().min(2) }),
    },
    {
      name: 'cardLast4' as const,
      description: 'Populates last 4 digits of payment card',
      schema: z.object({ value: z.string().regex(/^\d{4}$/) }),
    },
  ];

  if (lines.length === 0 && checkoutStatus !== 'confirmed') {
    return (
      <>
        <StepNav />
        <h1>Checkout</h1>
        <p>Add items to your cart first.</p>
        <Link href="/">Back to catalog</Link>
      </>
    );
  }

  return (
    <>
      <McpFormTools form={form} fields={fieldDefs} />
      <StepNav />
      <h1>Checkout</h1>
      <form
        className="card"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" {...form.register('email')} />
          {form.formState.errors.email && (
            <span style={{ color: '#dc2626', fontSize: 12 }}>{form.formState.errors.email.message}</span>
          )}
        </div>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" {...form.register('fullName')} />
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" {...form.register('address')} />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" {...form.register('city')} />
        </div>
        <div className="field">
          <label htmlFor="cardLast4">Card last 4</label>
          <input id="cardLast4" {...form.register('cardLast4')} maxLength={4} />
        </div>
        <button
          type="submit"
          className="primary"
          disabled={checkoutStatus === 'submitting'}
        >
          {checkoutStatus === 'submitting' ? 'Submitting…' : 'Place order'}
        </button>
      </form>
    </>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { McpFormTools, useMcpSubmitTool } from '@react-webmcp-kit/react-hook-form';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store/hooks';
import { z } from 'zod';
import { tripActions } from '@/store/tripSlice';

const searchSchema = z.object({
  destination: z.string().min(2),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

type SearchForm = z.infer<typeof searchSchema>;

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      destination: 'San Francisco',
      checkIn: '2026-11-10',
      checkOut: '2026-11-15',
    },
  });

  const onSubmit = async (data: SearchForm) => {
    dispatch(tripActions.setSearch(data));
    router.push(`/hotels?destination=${encodeURIComponent(data.destination)}`);
    return { success: true, ...data };
  };

  useMcpSubmitTool({
    form,
    name: 'submit_search',
    description: 'Validate and save search criteria, then navigate to hotel results',
    onValidSubmit: onSubmit,
  });

  const fieldDefs = [
    {
      name: 'destination' as const,
      description: 'Trip destination city',
      schema: z.object({ value: z.string().min(2) }),
    },
    {
      name: 'checkIn' as const,
      description: 'Check-in date (YYYY-MM-DD)',
      schema: z.object({ value: z.string().min(1) }),
    },
    {
      name: 'checkOut' as const,
      description: 'Check-out date (YYYY-MM-DD)',
      schema: z.object({ value: z.string().min(1) }),
    },
  ];

  return (
    <div className="card">
      <h1>Search</h1>
      <p>Route-scoped tools: <code>fill_destination</code>, <code>fill_checkIn</code>, etc.</p>
      <McpFormTools form={form} fields={fieldDefs} />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ marginTop: 16 }}
      >
        <div className="field">
          <label htmlFor="destination">Destination</label>
          <input id="destination" {...form.register('destination')} />
        </div>
        <div className="field">
          <label htmlFor="checkIn">Check-in</label>
          <input id="checkIn" type="date" {...form.register('checkIn')} />
        </div>
        <div className="field">
          <label htmlFor="checkOut">Check-out</label>
          <input id="checkOut" type="date" {...form.register('checkOut')} />
        </div>
        <button type="submit" className="primary">
          Search hotels
        </button>
      </form>
    </div>
  );
}

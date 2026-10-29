import { z } from 'zod';

export const ledgerWindowSchema = z.object({
  from: z.string().describe('ISO date start (YYYY-MM-DD)'),
  to: z.string().describe('ISO date end (YYYY-MM-DD)'),
  accountIds: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(2000).optional(),
});

export const exportLedgerSchema = z.object({
  window: ledgerWindowSchema,
  filterState: z.object({
    columnFilters: z.record(z.string()),
    globalSearch: z.string(),
    sort: z
      .object({
        id: z.string(),
        desc: z.boolean(),
      })
      .nullable(),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(500),
  }),
});

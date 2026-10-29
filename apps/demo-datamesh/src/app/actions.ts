'use server';

import { z } from 'zod';
import {
  getAccountById,
  getAccounts,
  getCounterparties,
  getMeshSummaryStats,
  queryLedgerWindow,
} from '@/lib/mockDb';
import { applyLedgerFilters } from '@/lib/serverFilters';
import type { LedgerRow } from '@/lib/types';

const tableFilterStateSchema = z.object({
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
});

const windowSchema = z.object({
  from: z.string(),
  to: z.string(),
  accountIds: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(2000).optional(),
});

async function simulateLatency() {
  const ms = 150 + Math.floor(Math.random() * 250);
  await new Promise((r) => setTimeout(r, ms));
}

export async function loadAccounts() {
  await simulateLatency();
  return getAccounts();
}

export async function getAccount(id: string) {
  await simulateLatency();
  const account = getAccountById(id);
  if (!account) throw new Error(`Account not found: ${id}`);
  return account;
}

export async function loadCounterparties() {
  await simulateLatency();
  return getCounterparties();
}

export async function getMeshSummary() {
  await simulateLatency();
  return getMeshSummaryStats();
}

export async function loadLedgerWindow(args: z.infer<typeof windowSchema>) {
  const parsed = windowSchema.parse(args);
  await simulateLatency();
  const rows = queryLedgerWindow(parsed);
  return {
    window: parsed,
    rows,
    loadedAt: new Date().toISOString(),
  };
}

export async function exportFilteredLedger(args: {
  window: z.infer<typeof windowSchema>;
  filterState: z.infer<typeof tableFilterStateSchema>;
}) {
  const window = windowSchema.parse(args.window);
  const filterState = tableFilterStateSchema.parse(args.filterState);
  await simulateLatency();

  const allRows = queryLedgerWindow(window);
  const filtered = applyLedgerFilters(allRows, {
    ...filterState,
    page: 1,
    pageSize: 10000,
  });

  const csvHeader = 'id,account,counterparty,bookedAt,amount,currency,status,memo';
  const csvLines = filtered.rows.map((r: LedgerRow) =>
    [
      r.id,
      r.accountName,
      r.counterpartyName,
      r.bookedAt,
      r.amount,
      r.currency,
      r.status,
      `"${r.memo.replace(/"/g, '""')}"`,
    ].join(','),
  );

  return {
    format: 'csv' as const,
    rowCount: filtered.total,
    window,
    filterState,
    csv: [csvHeader, ...csvLines].join('\n'),
  };
}

import type { Account, Counterparty, LedgerRow, LedgerTransaction } from './types';

const ACCOUNTS: Account[] = [
  { id: 'A1', name: 'North America Operating', region: 'US', currency: 'USD' },
  { id: 'A2', name: 'EMEA Treasury', region: 'EU', currency: 'EUR' },
  { id: 'A3', name: 'APAC Settlement', region: 'APAC', currency: 'USD' },
  { id: 'A4', name: 'LATAM Escrow', region: 'LATAM', currency: 'USD' },
  { id: 'A5', name: 'Global FX Hub', region: 'US', currency: 'USD' },
];

const COUNTERPARTIES: Counterparty[] = [
  { id: 'C1', name: 'Acme Capital', sector: 'Asset Mgmt' },
  { id: 'C2', name: 'Blue Harbor Bank', sector: 'Banking' },
  { id: 'C3', name: 'Cedar Payments', sector: 'Payments' },
  { id: 'C4', name: 'Delta Logistics', sector: 'Corporate' },
  { id: 'C5', name: 'Echo Securities', sector: 'Broker' },
  { id: 'C6', name: 'Falcon Insurance', sector: 'Insurance' },
];

const STATUSES: LedgerTransaction['status'][] = ['posted', 'pending', 'failed'];
const MEMO_PREFIX = ['Wire', 'ACH', 'FX', 'Fee', 'Refund', 'Settlement', 'Sweep', 'Interest'];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTransactions(): LedgerTransaction[] {
  const rand = mulberry32(42);
  const rows: LedgerTransaction[] = [];
  const start = new Date('2025-01-01T12:00:00Z').getTime();
  const dayMs = 86400000;

  for (let i = 0; i < 3500; i += 1) {
    const account = ACCOUNTS[Math.floor(rand() * ACCOUNTS.length)]!;
    const counterparty = COUNTERPARTIES[Math.floor(rand() * COUNTERPARTIES.length)]!;
    const dayOffset = Math.floor(rand() * 365);
    const bookedAt = new Date(start + dayOffset * dayMs).toISOString();
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]!;
    const prefix = MEMO_PREFIX[Math.floor(rand() * MEMO_PREFIX.length)]!;
    const amount = Math.round((rand() * 50000 + 10) * 100) / 100;

    rows.push({
      id: `TX-${String(i + 1).padStart(5, '0')}`,
      accountId: account.id,
      counterpartyId: counterparty.id,
      bookedAt,
      amount,
      currency: account.currency,
      status,
      memo: `${prefix} ${counterparty.name.split(' ')[0]} #${i + 1}`,
    });
  }

  return rows.sort((a, b) => b.bookedAt.localeCompare(a.bookedAt));
}

const TRANSACTIONS = buildTransactions();

const accountById = new Map(ACCOUNTS.map((a) => [a.id, a]));
const counterpartyById = new Map(COUNTERPARTIES.map((c) => [c.id, c]));

export function getAccounts(): Account[] {
  return ACCOUNTS;
}

export function getAccountById(id: string): Account | undefined {
  return accountById.get(id);
}

export function getCounterparties(): Counterparty[] {
  return COUNTERPARTIES;
}

export function enrichRow(tx: LedgerTransaction): LedgerRow {
  const account = accountById.get(tx.accountId);
  const counterparty = counterpartyById.get(tx.counterpartyId);
  return {
    ...tx,
    accountName: account?.name ?? tx.accountId,
    counterpartyName: counterparty?.name ?? tx.counterpartyId,
  };
}

export function queryLedgerWindow(args: {
  from: string;
  to: string;
  accountIds?: string[];
  limit?: number;
}): LedgerRow[] {
  const fromMs = new Date(args.from).getTime();
  const toMs = new Date(args.to).getTime();
  const limit = args.limit ?? 2000;
  const accountSet =
    args.accountIds && args.accountIds.length > 0 ? new Set(args.accountIds) : null;

  const filtered = TRANSACTIONS.filter((tx) => {
    const t = new Date(tx.bookedAt).getTime();
    if (t < fromMs || t > toMs) return false;
    if (accountSet && !accountSet.has(tx.accountId)) return false;
    return true;
  });

  return filtered.slice(0, limit).map(enrichRow);
}

export function getMeshSummaryStats() {
  return {
    accountCount: ACCOUNTS.length,
    counterpartyCount: COUNTERPARTIES.length,
    transactionCount: TRANSACTIONS.length,
    dateRange: {
      earliest: TRANSACTIONS[TRANSACTIONS.length - 1]!.bookedAt.slice(0, 10),
      latest: TRANSACTIONS[0]!.bookedAt.slice(0, 10),
    },
  };
}

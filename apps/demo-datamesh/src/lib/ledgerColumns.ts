import type { TableColumnDef } from '@react-webmcp-kit/next';
import type { LedgerRow } from './types';

export const LEDGER_COLUMNS: TableColumnDef<LedgerRow>[] = [
  { id: 'id', label: 'Transaction ID', sortable: true },
  { id: 'accountName', label: 'Account', sortable: true },
  { id: 'counterpartyName', label: 'Counterparty', sortable: true },
  { id: 'bookedAt', label: 'Booked', sortable: true },
  {
    id: 'amount',
    label: 'Amount',
    sortable: true,
    filterFn: (row, value) => String(row.amount).includes(value),
  },
  { id: 'currency', label: 'Currency' },
  { id: 'status', label: 'Status' },
  { id: 'memo', label: 'Memo' },
];

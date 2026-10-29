import { applyTableFilters } from '../../../../packages/next/src/applyTableFilters';
import type { TableFilterState } from '@webmcp-kit/next';
import { LEDGER_COLUMNS } from './ledgerColumns';
import type { LedgerRow } from './types';

export function applyLedgerFilters(rows: LedgerRow[], state: TableFilterState) {
  return applyTableFilters(rows, state, LEDGER_COLUMNS);
}

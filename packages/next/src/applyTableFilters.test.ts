import { describe, expect, it } from 'vitest';
import { applyTableFilters } from './applyTableFilters';
import type { TableColumnDef, TableFilterState } from './types';

type Row = { id: string; status: string; amount: number; memo: string };

const columns: TableColumnDef<Row>[] = [
  { id: 'id', label: 'ID', sortable: true },
  { id: 'status', label: 'Status' },
  { id: 'amount', label: 'Amount', sortable: true },
  { id: 'memo', label: 'Memo' },
];

const rows: Row[] = [
  { id: 'T1', status: 'posted', amount: 100, memo: 'Wire fee' },
  { id: 'T2', status: 'pending', amount: 50, memo: 'Refund' },
  { id: 'T3', status: 'posted', amount: 200, memo: 'Settlement' },
  { id: 'T4', status: 'posted', amount: 75, memo: 'Wire inbound' },
];

const baseState: TableFilterState = {
  columnFilters: {},
  globalSearch: '',
  sort: null,
  page: 1,
  pageSize: 2,
};

describe('applyTableFilters', () => {
  it('paginates', () => {
    const r = applyTableFilters(rows, baseState, columns);
    expect(r.total).toBe(4);
    expect(r.rows).toHaveLength(2);
    expect(r.page).toBe(1);
  });

  it('filters by column and global search', () => {
    const state: TableFilterState = {
      ...baseState,
      columnFilters: { status: 'posted' },
      globalSearch: 'wire',
    };
    const r = applyTableFilters(rows, state, columns);
    expect(r.total).toBe(2);
    expect(r.rows.map((x) => x.id)).toEqual(['T1', 'T4']);
  });

  it('sorts descending', () => {
    const state: TableFilterState = {
      ...baseState,
      sort: { id: 'amount', desc: true },
      pageSize: 10,
    };
    const r = applyTableFilters(rows, state, columns);
    expect(r.rows.map((x) => x.amount)).toEqual([200, 100, 75, 50]);
  });

  it('clamps page when filters shrink result set', () => {
    const state: TableFilterState = {
      ...baseState,
      columnFilters: { status: 'posted' },
      page: 99,
      pageSize: 2,
    };
    const r = applyTableFilters(rows, state, columns);
    expect(r.page).toBe(2);
    expect(r.rows).toHaveLength(1);
  });
});

'use client';

import {
  applyTableFilters,
  McpTableFilterTools,
  useTableFilterState,
} from '@react-webmcp-kit/next';
import { useMemo } from 'react';
import { LEDGER_COLUMNS } from '@/lib/ledgerColumns';
import type { LedgerRow } from '@/lib/types';
import { useLedgerWindow } from './LedgerWindowContext';

type LedgerTablePanelProps = {
  toolPrefix?: string;
  title?: string;
};

export function LedgerTablePanel({
  toolPrefix = 'ledger_',
  title = 'Transactions',
}: LedgerTablePanelProps) {
  const { rows, hasWindow } = useLedgerWindow();
  const filterApi = useTableFilterState({ initialPageSize: 25 });

  const result = useMemo(
    () => applyTableFilters(rows, filterApi.state, LEDGER_COLUMNS),
    [rows, filterApi.state],
  );

  const chips = [
    ...Object.entries(filterApi.state.columnFilters).map(([k, v]) => `${k}: ${v}`),
    filterApi.state.globalSearch ? `search: ${filterApi.state.globalSearch}` : null,
    filterApi.state.sort
      ? `sort: ${filterApi.state.sort.id}${filterApi.state.sort.desc ? ' desc' : ''}`
      : null,
  ].filter(Boolean);

  return (
    <div className="card">
      <McpTableFilterTools
        columns={LEDGER_COLUMNS}
        filterApi={filterApi}
        toolPrefix={toolPrefix}
        enabled={hasWindow}
      />

      <div className="table-head">
        <h2>{title}</h2>
        {hasWindow && (
          <p className="muted">
            Showing {result.rows.length} of {result.total} filtered ({rows.length} loaded)
          </p>
        )}
      </div>

      {!hasWindow && (
        <p className="muted">Load a ledger window to enable client-side filter tools.</p>
      )}

      {hasWindow && chips.length > 0 && (
        <div className="chips">
          {chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      )}

      {hasWindow && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {LEDGER_COLUMNS.map((col) => (
                    <th key={col.id}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <LedgerRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <button
              type="button"
              className="secondary"
              disabled={result.page <= 1}
              onClick={() => filterApi.setPage(result.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {result.page} / {Math.max(1, Math.ceil(result.total / result.pageSize))}
            </span>
            <button
              type="button"
              className="secondary"
              disabled={result.page * result.pageSize >= result.total}
              onClick={() => filterApi.setPage(result.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function LedgerRow({ row }: { row: LedgerRow }) {
  return (
    <tr>
      <td>{row.id}</td>
      <td>{row.accountName}</td>
      <td>{row.counterpartyName}</td>
      <td>{row.bookedAt.slice(0, 10)}</td>
      <td>{row.amount.toLocaleString()}</td>
      <td>{row.currency}</td>
      <td>{row.status}</td>
      <td>{row.memo}</td>
    </tr>
  );
}

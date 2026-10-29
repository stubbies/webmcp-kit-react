'use client';

import { useLedgerWindow } from './LedgerWindowContext';

export function WindowStrip() {
  const { windowArgs, rows, loading, error, loadedAt, hasWindow } = useLedgerWindow();

  return (
    <div className="window-strip card" aria-live="polite">
      <strong>Active window</strong>
      {loading && <span className="muted"> — Loading…</span>}
      {error && <span className="error"> — {error}</span>}
      {!loading && !error && !hasWindow && (
        <span className="muted"> — No ledger window loaded</span>
      )}
      {hasWindow && windowArgs && (
        <div className="window-meta">
          <span>
            {windowArgs.from} → {windowArgs.to}
          </span>
          {windowArgs.accountIds?.length ? (
            <span> · Accounts: {windowArgs.accountIds.join(', ')}</span>
          ) : (
            <span> · All accounts</span>
          )}
          <span> · {rows.length} rows in memory</span>
          {loadedAt && <span className="muted"> · loaded {new Date(loadedAt).toLocaleTimeString()}</span>}
        </div>
      )}
    </div>
  );
}

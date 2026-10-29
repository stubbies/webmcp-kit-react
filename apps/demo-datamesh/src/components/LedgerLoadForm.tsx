'use client';

import { useState } from 'react';
import type { Account } from '@/lib/types';
import { useLedgerWindow } from './LedgerWindowContext';

const DEFAULT_FROM = '2025-01-01';
const DEFAULT_TO = '2025-12-31';

export function LedgerLoadForm({
  accounts,
  scopedAccountId,
}: {
  accounts: Account[];
  /** When set, window loads always include this account. */
  scopedAccountId?: string;
}) {
  const { loadWindow, loading } = useLedgerWindow();
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAccount = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountIds = scopedAccountId
      ? [scopedAccountId, ...selected.filter((id) => id !== scopedAccountId)]
      : selected.length
        ? selected
        : undefined;

    await loadWindow({
      from,
      to,
      accountIds,
    });
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Load ledger window</h2>
      <p className="muted">
        Server Action loads up to 2000 rows; client filter tools refine in memory.
      </p>
      <div className="field-row">
        <div className="field">
          <label htmlFor="from">From</label>
          <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="to">To</label>
          <input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      <fieldset className="field">
        <legend>Accounts (optional)</legend>
        <div className="account-picks">
          {accounts.map((a) => (
            <label key={a.id} className="check">
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={() => toggleAccount(a.id)}
              />
              {a.id} — {a.name}
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="primary" disabled={loading}>
        {loading ? 'Loading…' : 'Load window'}
      </button>
    </form>
  );
}

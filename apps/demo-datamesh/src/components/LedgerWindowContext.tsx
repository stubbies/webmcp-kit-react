'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadLedgerWindow } from '@/app/actions';
import type { LedgerRow } from '@/lib/types';
import type { z } from 'zod';
import type { ledgerWindowSchema } from '@/lib/schemas';

export type LedgerWindowArgs = z.infer<typeof ledgerWindowSchema>;

type LedgerWindowContextValue = {
  windowArgs: LedgerWindowArgs | null;
  rows: LedgerRow[];
  loading: boolean;
  error: string | null;
  loadedAt: string | null;
  loadWindow: (args: LedgerWindowArgs) => Promise<{ rowCount: number }>;
  clearWindow: () => void;
  hasWindow: boolean;
};

const LedgerWindowContext = createContext<LedgerWindowContextValue | null>(null);

export function LedgerWindowProvider({ children }: { children: ReactNode }) {
  const [windowArgs, setWindowArgs] = useState<LedgerWindowArgs | null>(null);
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  const loadWindow = useCallback(async (args: LedgerWindowArgs) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadLedgerWindow(args);
      setWindowArgs(result.window);
      setRows(result.rows);
      setLoadedAt(result.loadedAt);
      return { rowCount: result.rows.length };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load window');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWindow = useCallback(() => {
    setWindowArgs(null);
    setRows([]);
    setLoadedAt(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      windowArgs,
      rows,
      loading,
      error,
      loadedAt,
      loadWindow,
      clearWindow,
      hasWindow: windowArgs != null,
    }),
    [windowArgs, rows, loading, error, loadedAt, loadWindow, clearWindow],
  );

  return (
    <LedgerWindowContext.Provider value={value}>{children}</LedgerWindowContext.Provider>
  );
}

export function useLedgerWindow() {
  const ctx = useContext(LedgerWindowContext);
  if (!ctx) throw new Error('useLedgerWindow must be used within LedgerWindowProvider');
  return ctx;
}

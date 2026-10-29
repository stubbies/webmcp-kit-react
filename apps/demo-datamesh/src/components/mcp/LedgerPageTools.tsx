'use client';

import { McpServerActionTools } from '@webmcp-kit/next';
import { exportFilteredLedger } from '@/app/actions';
import { exportLedgerSchema, ledgerWindowSchema } from '@/lib/schemas';
import { useLedgerWindow } from '../LedgerWindowContext';

export function LedgerPageTools() {
  const { hasWindow, windowArgs, loadWindow } = useLedgerWindow();

  return (
    <McpServerActionTools
      tools={[
        {
          name: 'load_ledger_window',
          description:
            'Load ledger transactions for a date range (optional accountIds). Server-side window cap 2000 rows.',
          schema: ledgerWindowSchema,
          action: async (args) => {
            const { rowCount } = await loadWindow(args);
            return { success: true, rowCount, window: args };
          },
          annotations: { readOnlyHint: true },
        },
        {
          name: 'export_ledger',
          description:
            'Export CSV for the current window with client filter state re-validated on the server',
          schema: exportLedgerSchema,
          enabled: hasWindow && windowArgs != null,
          action: exportFilteredLedger,
          annotations: { consequentialHint: true },
        },
      ]}
    />
  );
}

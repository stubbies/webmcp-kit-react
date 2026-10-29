'use client';

import { McpServerActionTools } from '@webmcp-kit/next';
import { z } from 'zod';
import { getAccount } from '@/app/actions';
import { ledgerWindowSchema } from '@/lib/schemas';
import { useLedgerWindow } from '../LedgerWindowContext';

export function AccountDetailTools({ accountId }: { accountId: string }) {
  const { loadWindow } = useLedgerWindow();

  return (
    <McpServerActionTools
      tools={[
        {
          name: 'get_account',
          description: `Get account ${accountId} details`,
          schema: z.object({}),
          action: async () => getAccount(accountId),
          annotations: { readOnlyHint: true },
        },
        {
          name: 'load_ledger_window',
          description: `Load ledger window scoped to account ${accountId}`,
          schema: ledgerWindowSchema,
          action: async (args) => {
            const window = { ...args, accountIds: [accountId] };
            const { rowCount } = await loadWindow(window);
            return { success: true, rowCount, window, accountId };
          },
          annotations: { readOnlyHint: true },
        },
      ]}
    />
  );
}

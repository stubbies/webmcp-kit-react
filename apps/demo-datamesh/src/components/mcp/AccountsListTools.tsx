'use client';

import { McpServerActionTools } from '@react-webmcp-kit/next';
import { z } from 'zod';
import { loadAccounts } from '@/app/actions';

export function AccountsListTools() {
  return (
    <McpServerActionTools
      tools={[
        {
          name: 'load_accounts',
          description: 'Load all mesh accounts',
          schema: z.object({}),
          action: async () => loadAccounts(),
          annotations: { readOnlyHint: true },
        },
      ]}
    />
  );
}

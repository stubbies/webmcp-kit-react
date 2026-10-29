'use client';

import { McpServerActionTools } from '@react-webmcp-kit/next';
import { z } from 'zod';
import { getMeshSummary, loadAccounts } from '@/app/actions';

export function HubMeshTools() {
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
        {
          name: 'get_mesh_summary',
          description: 'Summary stats for the financial data mesh',
          schema: z.object({}),
          action: async () => getMeshSummary(),
          annotations: { readOnlyHint: true },
        },
      ]}
    />
  );
}

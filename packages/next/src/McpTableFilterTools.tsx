'use client';

import { useMcpTool } from '@react-webmcp-kit/core';
import { z } from 'zod';
import type { TableColumnDef, TableFilterStateApi } from './types';

function toolName(prefix: string | undefined, base: string): string {
  return prefix ? `${prefix}${base}` : base;
}

export type McpTableFilterToolsProps<TRow> = {
  columns: TableColumnDef<TRow>[];
  filterApi: TableFilterStateApi;
  /** e.g. `ledger_` → `ledger_set_column_filter` */
  toolPrefix?: string;
  enabled?: boolean;
};

/** Register WebMCP tools for high-capacity client-side table filtering. */
export function McpTableFilterTools<TRow>({
  columns,
  filterApi,
  toolPrefix,
  enabled = true,
}: McpTableFilterToolsProps<TRow>) {
  const columnIds = columns.map((c) => c.id);
  const sortableIds = columns.filter((c) => c.sortable !== false).map((c) => c.id);

  useMcpTool({
    name: toolName(toolPrefix, 'set_column_filter'),
    description: `Set a column filter. Columns: ${columnIds.join(', ')}`,
    schema: z.object({
      column: z.string(),
      value: z.string(),
    }),
    enabled,
    execute: async (args: { column: string; value: string }) => {
      filterApi.setColumnFilter(args.column, args.value);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'clear_column_filter'),
    description: 'Clear filter for one column',
    schema: z.object({ column: z.string() }),
    enabled,
    execute: async (args: { column: string }) => {
      filterApi.clearColumnFilter(args.column);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'clear_all_filters'),
    description: 'Clear all column filters, global search, and sort',
    schema: z.object({}),
    enabled,
    execute: async () => {
      filterApi.clearAllFilters();
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'set_global_search'),
    description: 'Set global search across visible columns',
    schema: z.object({ query: z.string() }),
    enabled,
    execute: async (args: { query: string }) => {
      filterApi.setGlobalSearch(args.query);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'set_sort'),
    description: `Sort by column. Sortable: ${sortableIds.join(', ')}`,
    schema: z.object({
      column: z.string(),
      desc: z.boolean().optional(),
    }),
    enabled: enabled && sortableIds.length > 0,
    execute: async (args: { column: string; desc?: boolean }) => {
      filterApi.setSort(args.column, args.desc ?? false);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'clear_sort'),
    description: 'Clear table sort',
    schema: z.object({}),
    enabled,
    execute: async () => {
      filterApi.clearSort();
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'set_page'),
    description: 'Set current page (1-based)',
    schema: z.object({ page: z.number().int().min(1) }),
    enabled,
    execute: async (args: { page: number }) => {
      filterApi.setPage(args.page);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'set_page_size'),
    description: 'Set rows per page',
    schema: z.object({ pageSize: z.number().int().min(1).max(500) }),
    enabled,
    execute: async (args: { pageSize: number }) => {
      filterApi.setPageSize(args.pageSize);
      return { success: true, state: filterApi.state };
    },
  });

  useMcpTool({
    name: toolName(toolPrefix, 'get_filter_state'),
    description: 'Read current filter, sort, and pagination state',
    schema: z.object({}),
    enabled,
    annotations: { readOnlyHint: true },
    execute: async () => ({ state: filterApi.state }),
  });

  return null;
}

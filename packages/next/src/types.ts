import type { z } from 'zod';

export type TableSortState = {
  id: string;
  desc: boolean;
};

export type TableFilterState = {
  columnFilters: Record<string, string>;
  globalSearch: string;
  sort: TableSortState | null;
  page: number;
  pageSize: number;
};

export type TableColumnDef<TRow> = {
  id: string;
  label: string;
  sortable?: boolean;
  /** Used for global search when filterFn is not set. */
  getSearchText?: (row: TRow) => string;
  filterFn?: (row: TRow, filterValue: string) => boolean;
};

export type ApplyTableFiltersResult<TRow> = {
  rows: TRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type McpServerActionToolDef<TArgs = unknown, TResult = unknown> = {
  name: string;
  description: string;
  schema: z.ZodType<TArgs>;
  action: (args: TArgs) => Promise<TResult>;
  enabled?: boolean;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
    consequentialHint?: boolean;
  };
};

export type TableFilterStateApi = {
  state: TableFilterState;
  setColumnFilter: (columnId: string, value: string) => void;
  clearColumnFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  setGlobalSearch: (value: string) => void;
  setSort: (id: string, desc?: boolean) => void;
  clearSort: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

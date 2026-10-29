'use client';

import { useCallback, useMemo, useState } from 'react';
import type { TableFilterState, TableFilterStateApi } from './types';

const DEFAULT_PAGE_SIZE = 50;

export type UseTableFilterStateOptions = {
  initialPageSize?: number;
};

export function useTableFilterState(
  options: UseTableFilterStateOptions = {},
): TableFilterStateApi {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [globalSearch, setGlobalSearchState] = useState('');
  const [sort, setSortState] = useState<TableFilterState['sort']>(null);
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(options.initialPageSize ?? DEFAULT_PAGE_SIZE);

  const setColumnFilter = useCallback((columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (!value.trim()) delete next[columnId];
      else next[columnId] = value;
      return next;
    });
    setPageState(1);
  }, []);

  const clearColumnFilter = useCallback((columnId: string) => {
    setColumnFilters((prev) => {
      if (!(columnId in prev)) return prev;
      const next = { ...prev };
      delete next[columnId];
      return next;
    });
    setPageState(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
    setGlobalSearchState('');
    setSortState(null);
    setPageState(1);
  }, []);

  const setGlobalSearch = useCallback((value: string) => {
    setGlobalSearchState(value);
    setPageState(1);
  }, []);

  const setSort = useCallback((id: string, desc = false) => {
    setSortState({ id, desc });
    setPageState(1);
  }, []);

  const clearSort = useCallback(() => {
    setSortState(null);
    setPageState(1);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextSize: number) => {
    setPageSizeState(Math.max(1, nextSize));
    setPageState(1);
  }, []);

  const state = useMemo<TableFilterState>(
    () => ({ columnFilters, globalSearch, sort, page, pageSize }),
    [columnFilters, globalSearch, sort, page, pageSize],
  );

  return {
    state,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    setGlobalSearch,
    setSort,
    clearSort,
    setPage,
    setPageSize,
  };
}

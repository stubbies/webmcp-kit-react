import type {
  ApplyTableFiltersResult,
  TableColumnDef,
  TableFilterState,
} from './types';

function defaultFilterFn<TRow>(row: TRow, columnId: string, filterValue: string): boolean {
  const raw = (row as Record<string, unknown>)[columnId];
  if (raw == null) return false;
  return String(raw).toLowerCase().includes(filterValue.toLowerCase());
}

function defaultSearchText<TRow>(row: TRow, columns: TableColumnDef<TRow>[]): string {
  const parts: string[] = [];
  for (const col of columns) {
    if (col.getSearchText) {
      parts.push(col.getSearchText(row));
    } else {
      const raw = (row as Record<string, unknown>)[col.id];
      if (raw != null) parts.push(String(raw));
    }
  }
  return parts.join(' ');
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/** Pure filter → global search → sort → paginate over in-memory rows. */
export function applyTableFilters<TRow>(
  allRows: TRow[],
  state: TableFilterState,
  columns: TableColumnDef<TRow>[],
): ApplyTableFiltersResult<TRow> {
  const columnById = new Map(columns.map((c) => [c.id, c]));
  let rows = [...allRows];

  for (const [columnId, filterValue] of Object.entries(state.columnFilters)) {
    const trimmed = filterValue.trim();
    if (!trimmed) continue;
    const col = columnById.get(columnId);
    rows = rows.filter((row) => {
      if (col?.filterFn) return col.filterFn(row, trimmed);
      return defaultFilterFn(row, columnId, trimmed);
    });
  }

  const search = state.globalSearch.trim().toLowerCase();
  if (search) {
    rows = rows.filter((row) =>
      defaultSearchText(row, columns).toLowerCase().includes(search),
    );
  }

  if (state.sort) {
    const { id, desc } = state.sort;
    rows.sort((a, b) => {
      const av = (a as Record<string, unknown>)[id];
      const bv = (b as Record<string, unknown>)[id];
      const cmp = compareValues(av, bv);
      return desc ? -cmp : cmp;
    });
  }

  const total = rows.length;
  const pageSize = Math.max(1, state.pageSize);
  const maxPage = Math.max(1, Math.ceil(total / pageSize) || 1);
  const page = Math.min(Math.max(1, state.page), maxPage);
  const start = (page - 1) * pageSize;
  const paged = rows.slice(start, start + pageSize);

  return { rows: paged, total, page, pageSize };
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { McpRegistrySnapshot, McpToolRegistryEntry } from './types';

type RegistryAction =
  | { type: 'upsert'; entry: McpToolRegistryEntry }
  | { type: 'remove'; name: string }
  | { type: 'setLastResult'; name: string; result: unknown };

function registryReducer(
  state: Map<string, McpToolRegistryEntry>,
  action: RegistryAction,
): Map<string, McpToolRegistryEntry> {
  const next = new Map(state);
  switch (action.type) {
    case 'upsert': {
      const prev = next.get(action.entry.name);
      next.set(action.entry.name, {
        ...action.entry,
        lastResult: action.entry.lastResult ?? prev?.lastResult,
        lastInvokedAt: action.entry.lastInvokedAt ?? prev?.lastInvokedAt ?? null,
      });
      break;
    }
    case 'remove':
      next.delete(action.name);
      break;
    case 'setLastResult': {
      const existing = next.get(action.name);
      if (existing) {
        next.set(action.name, {
          ...existing,
          lastResult: action.result,
          lastInvokedAt: Date.now(),
        });
      }
      break;
    }
  }
  return next;
}

type McpRegistryApi = {
  upsertEntry: (entry: McpToolRegistryEntry) => void;
  removeEntry: (name: string) => void;
  recordResult: (name: string, result: unknown) => void;
};

const McpRegistryApiContext = createContext<McpRegistryApi | null>(null);
const McpEntriesContext = createContext<Map<string, McpToolRegistryEntry>>(new Map());

export function McpProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer(registryReducer, new Map());

  const upsertEntry = useCallback((entry: McpToolRegistryEntry) => {
    dispatch({ type: 'upsert', entry });
  }, []);

  const removeEntry = useCallback((name: string) => {
    dispatch({ type: 'remove', name });
  }, []);

  const recordResult = useCallback((name: string, result: unknown) => {
    dispatch({ type: 'setLastResult', name, result });
  }, []);

  const api = useMemo(
    () => ({ upsertEntry, removeEntry, recordResult }),
    [upsertEntry, removeEntry, recordResult],
  );

  return (
    <McpRegistryApiContext.Provider value={api}>
      <McpEntriesContext.Provider value={entries}>{children}</McpEntriesContext.Provider>
    </McpRegistryApiContext.Provider>
  );
}

export function useMcpProviderContext(): McpRegistryApi | null {
  return useContext(McpRegistryApiContext);
}

export function useMcpRegistry(): McpRegistrySnapshot {
  const entries = useContext(McpEntriesContext);
  return useMemo(
    () => Array.from(entries.values()).sort((a, b) => a.name.localeCompare(b.name)),
    [entries],
  );
}

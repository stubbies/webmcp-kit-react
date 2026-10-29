import type { Dispatch } from '@reduxjs/toolkit';
import { useMcpTool } from '@webmcp-kit/react';
import { useDispatch, useStore } from 'react-redux';
import { formatRtkQueryResult } from './formatRtkQueryResult';
import type { McpReduxToolDef, McpRtkQueryToolDef, ReduxToolContext } from './types';

export { formatRtkQueryResult } from './formatRtkQueryResult';
export type {
  FormattedRtkQueryResult,
  FormattedRtkFailure,
  FormattedRtkSuccess,
  RtkQueryDispatchResult,
} from './formatRtkQueryResult';
export type {
  McpReduxToolDef,
  McpRtkQueryToolDef,
  ReduxToolContext,
  ToolAnnotations,
} from './types';

function McpReduxToolRegistrar<
  TArgs,
  TResult,
  RootState,
  AppDispatch extends Dispatch,
>({
  def,
  dispatch,
  getState,
}: {
  def: McpReduxToolDef<TArgs, TResult, RootState, AppDispatch>;
  dispatch: AppDispatch;
  getState: () => RootState;
}) {
  useMcpTool({
    name: def.name,
    description: def.description,
    schema: def.schema,
    enabled: def.enabled ?? true,
    annotations: def.annotations,
    execute: (args: TArgs, { signal }) => {
      const ctx: ReduxToolContext<RootState, AppDispatch> = { dispatch, getState, signal };
      return def.execute(args, ctx);
    },
  });
  return null;
}

export type McpReduxToolsProps<
  RootState = unknown,
  AppDispatch extends Dispatch = Dispatch,
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: McpReduxToolDef<any, any, RootState, AppDispatch>[];
};

/** Register WebMCP tools that dispatch Redux actions (render inside McpProvider + Provider). */
export function McpReduxTools<RootState = unknown, AppDispatch extends Dispatch = Dispatch>({
  tools,
}: McpReduxToolsProps<RootState, AppDispatch>) {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const getState = store.getState.bind(store);

  return (
    <>
      {tools.map((def) => (
        <McpReduxToolRegistrar
          key={def.name}
          def={def}
          dispatch={dispatch}
          getState={getState}
        />
      ))}
    </>
  );
}

function rtkAnnotations(kind: 'query' | 'mutation', extra?: McpRtkQueryToolDef['annotations']) {
  const base =
    kind === 'query'
      ? { readOnlyHint: true as const }
      : { consequentialHint: true as const };
  return { ...base, ...extra };
}

function McpRtkQueryToolRegistrar<TArgs>({
  def,
  dispatch,
}: {
  def: McpRtkQueryToolDef<TArgs>;
  dispatch: Dispatch;
}) {
  useMcpTool({
    name: def.name,
    description: def.description,
    schema: def.schema,
    enabled: def.enabled ?? true,
    annotations: rtkAnnotations(def.kind, def.annotations),
    execute: async (args: TArgs, { signal }) => {
      if (signal.aborted) throw new Error('Aborted');
      const action = def.initiate(args);
      const result = await dispatch(action as Parameters<typeof dispatch>[0]);
      return formatRtkQueryResult(result as { data?: unknown; error?: unknown; isError?: boolean });
    },
  });
  return null;
}

export type McpRtkQueryToolsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: McpRtkQueryToolDef<any>[];
};

/** Register WebMCP tools bound to RTK Query `endpoint.initiate()` (render inside McpProvider + Provider). */
export function McpRtkQueryTools({ tools }: McpRtkQueryToolsProps) {
  const dispatch = useDispatch();

  return (
    <>
      {tools.map((def) => (
        <McpRtkQueryToolRegistrar key={def.name} def={def} dispatch={dispatch} />
      ))}
    </>
  );
}

import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { z } from 'zod';

export type ToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
};

export type ReduxToolContext<RootState = unknown, AppDispatch extends Dispatch = Dispatch> = {
  dispatch: AppDispatch;
  getState: () => RootState;
  signal: AbortSignal;
};

export type McpReduxToolDef<
  TArgs = unknown,
  TResult = unknown,
  RootState = unknown,
  AppDispatch extends Dispatch = Dispatch,
> = {
  name: string;
  description: string;
  schema: z.ZodType<TArgs>;
  execute: (args: TArgs, ctx: ReduxToolContext<RootState, AppDispatch>) => TResult | Promise<TResult>;
  enabled?: boolean;
  annotations?: ToolAnnotations;
};

export type McpRtkQueryToolDef<TArgs = unknown> = {
  name: string;
  description: string;
  schema: z.ZodType<TArgs>;
  kind: 'query' | 'mutation';
  /** Returns the RTK Query initiate thunk/action for the given args. */
  initiate: (args: TArgs) => UnknownAction;
  enabled?: boolean;
  annotations?: ToolAnnotations;
};

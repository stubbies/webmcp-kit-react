/** Minimal shape returned from `dispatch(api.endpoints.x.initiate(...))`. */
export type RtkQueryDispatchResult = {
  data?: unknown;
  error?: unknown;
  isSuccess?: boolean;
  isError?: boolean;
};

export type FormattedRtkSuccess = { success: true; data: unknown };
export type FormattedRtkFailure = {
  success: false;
  error: { status?: number | string; message: string; data?: unknown };
};
export type FormattedRtkQueryResult = FormattedRtkSuccess | FormattedRtkFailure;

function serializeRtkError(error: unknown): FormattedRtkFailure['error'] {
  if (error == null) {
    return { message: 'Unknown RTK Query error' };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;
    const status = err.status as number | string | undefined;
    const data = err.data;
    const message =
      typeof err.error === 'string'
        ? err.error
        : typeof err.message === 'string'
          ? err.message
          : status !== undefined
            ? `Request failed (${String(status)})`
            : 'Request failed';
    return { status, message, data };
  }
  return { message: String(error) };
}

export function formatRtkQueryResult(result: RtkQueryDispatchResult): FormattedRtkQueryResult {
  if (result.error !== undefined && result.error !== null) {
    return { success: false, error: serializeRtkError(result.error) };
  }
  if (result.data !== undefined) {
    return { success: true, data: result.data };
  }
  if (result.isError) {
    return { success: false, error: serializeRtkError(result.error) };
  }
  return { success: true, data: null };
}

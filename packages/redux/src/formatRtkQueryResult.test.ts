import { describe, expect, it } from 'vitest';
import { formatRtkQueryResult } from './formatRtkQueryResult';

describe('formatRtkQueryResult', () => {
  it('returns success with data', () => {
    expect(formatRtkQueryResult({ data: { id: 1 } })).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it('returns failure with serialized fetch error', () => {
    expect(
      formatRtkQueryResult({
        error: { status: 404, data: { message: 'Not found' } },
      }),
    ).toEqual({
      success: false,
      error: {
        status: 404,
        message: 'Request failed (404)',
        data: { message: 'Not found' },
      },
    });
  });

  it('returns failure when isError without data', () => {
    expect(formatRtkQueryResult({ isError: true, error: 'network down' })).toEqual({
      success: false,
      error: { message: 'network down' },
    });
  });

  it('returns null data when empty success', () => {
    expect(formatRtkQueryResult({ isSuccess: true })).toEqual({
      success: true,
      data: null,
    });
  });
});

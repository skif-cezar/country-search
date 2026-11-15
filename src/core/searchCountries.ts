import { HttpError } from './httpError';
import { anySignal, timeoutSignal } from './signals';
import { RawCountry } from './types';

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

export const API_BASE = 'https://countries.dev';
export const REQUEST_TIMEOUT_MS = 8000;

/**
 *  - 404 → [] (no matches, not an error);
 *  - other !ok → HttpError(status);
 *  - cancellation by the caller → DOMException 'AbortError' (propagated as-is);
 *  - time-out → DOMException 'TimeoutError'.
 */
export const makeSearchCountries =
  (fetcher: Fetcher, timeoutMs: number = REQUEST_TIMEOUT_MS) =>
  async (query: string, signal: AbortSignal): Promise<readonly RawCountry[]> => {
    const combined = anySignal([signal, timeoutSignal(timeoutMs)]);

    const response = await fetcher(`${API_BASE}/name/${encodeURIComponent(query)}`, {
      signal: combined,
    });

    if (response.status === 404) return [];
    if (!response.ok) throw new HttpError(response.status);

    const data: unknown = await response.json();

    if (!Array.isArray(data)) throw new TypeError('Unexpected response shape');

    return data as RawCountry[];
  };

/** The global `fetch` is retrieved at the time of the call. */
export const searchCountries: (query: string, signal: AbortSignal) => Promise<readonly RawCountry[]> =
  makeSearchCountries((input, init) => fetch(input, init));

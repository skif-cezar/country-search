import { RawCountry } from "./types";

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

export const REQUEST_TIMEOUT_MS = 8000;

/**
 *  - 404 → [] (no matches, not an error);
 *  - other !ok → HttpError(status);
 *  - cancellation by the caller → DOMException 'AbortError' (propagated as-is);
 *  - time-out → DOMException 'TimeoutError'.
 */
export const makeSearchCountries =
  (_fetcher: Fetcher, _timeoutMs: number = REQUEST_TIMEOUT_MS) =>
  async (_query: string, _signal: AbortSignal): Promise<readonly RawCountry[]> => {
    throw new Error('Not implemented');
      };

/** The global `fetch` is retrieved at the time of the call. */
export const searchCountries = makeSearchCountries((input, init) => fetch(input, init));

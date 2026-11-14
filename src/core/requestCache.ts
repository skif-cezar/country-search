import { Search } from './types';

type InflightRequest<T> = {
  readonly promise: Promise<T>;
  readonly controller: AbortController;
  subscribers: number;
};

export const DEFAULT_MAX_ENTRIES = 100;

/**
 * Wraps search with a cache (FIFO) and deduplication of in-flight requests.
 */
export const createCachedSearch = <T>(
  search: Search<T>,
  keyOf: (query: string) => string,
  maxEntries: number = DEFAULT_MAX_ENTRIES,
) => {
  const cache = new Map<string, T>();
  const inflight = new Map<string, InflightRequest<T>>();

  // Caching with size limitation (FIFO)
  const remember = (key: string, value: T): void => {
    if (cache.size >= maxEntries) {
      const oldestKey = cache.keys().next().value;

      if (oldestKey !== undefined) cache.delete(oldestKey);
    }
    cache.set(key, value);
  };

  const startRequest = (key: string, query: string): InflightRequest<T> => {
    const controller = new AbortController();

    // Perform a search and, upon success, immediately save the result to the cache.
    const promise = search(query, controller.signal).then((value) => {
      remember(key, value);
      return value;
    });

    const entry: InflightRequest<T> = { promise, controller, subscribers: 0 };
    inflight.set(key, entry);

    // Remove the entry from "in-flight" regardless of the outcome (success or error)
    const release = () => {
      if (inflight.get(key) === entry) inflight.delete(key);
    };

    promise.then(release, release);

    return entry;
  };

  const cachedSearch: Search<T> = (query, signal) => {
    const key = keyOf(query);

    if (cache.has(key)) {
      if (signal.aborted) return Promise.reject(signal.reason);

      return Promise.resolve(cache.get(key) as T);
    }

    const entry = inflight.get(key) ?? startRequest(key, query);

    return new Promise<T>((resolve, reject) => {
      if (signal.aborted) return reject(signal.reason);

      entry.subscribers += 1;
      let isUnsubscribed = false;

      const cleanup = () => {
        if (isUnsubscribed) return;
        isUnsubscribed = true;
        signal.removeEventListener('abort', onAbort);

        entry.subscribers -= 1;
        if (entry.subscribers === 0) {
          inflight.delete(key);
          entry.controller.abort();
        }
      };

      const onAbort = () => {
        cleanup();
        reject(signal.reason);
      };

      signal.addEventListener('abort', onAbort, { once: true });

      entry.promise.then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
        },
      );
    });
  };

  return Object.freeze({ search: cachedSearch });
};

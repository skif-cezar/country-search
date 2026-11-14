export const HISTORY_KEY = 'country-search:history';
export const HISTORY_LIMIT = 8;

/** Add new request to the beginning, remove duplicates, limit the length. */
export const addToHistory = (
  history: readonly string[],
  query: string,
  limit: number = HISTORY_LIMIT,
): readonly string[] => [query, ...history.filter((q) => q !== query)].slice(0, limit);

export type HistoryStore = Readonly<{
  load: () => readonly string[];
  save: (history: readonly string[]) => void;
}>;

/** `localStorage` can throw errors (due to private browsing mode or quota limits)
 * and may contain junk data—we need to protect against this. */
export const createHistoryStore = (
  getStorage: () => Pick<Storage, 'getItem' | 'setItem'>,
  key: string = HISTORY_KEY,
): HistoryStore => ({
  load: () => {
    try {
      const parsed = JSON.parse(getStorage().getItem(key) ?? '[]');
      return (Array.isArray(parsed) ? parsed : [])
        .filter((x): x is string => typeof x === 'string')
        .slice(0, HISTORY_LIMIT);
    } catch {
      return [];
    }
  },
  save: (history) => {
    try {
      getStorage().setItem(key, JSON.stringify(history));
    } catch {
      /* ignore localStorage errors */
    }
  },
});

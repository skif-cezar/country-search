import { debounce } from './debounce';
import { isCancellation, isTimeout } from './errors';
import { addToHistory, HistoryStore } from './history';
import { HttpError } from './httpError';
import { mapCountriesResponse } from './mapCountryResponse';
import { normalizeQuery } from './normalizeQuery';
import { CountryView, Search, RawCountry } from './types';

export type SearchView =
  | Readonly<{ status: 'idle' }>
  | Readonly<{ status: 'loading'; query: string }>
  | Readonly<{ status: 'success'; query: string; countries: readonly CountryView[] }>
  | Readonly<{ status: 'empty'; query: string }>
  | Readonly<{ status: 'error'; query: string; message: string }>;

export type AppState = Readonly<{
  text: string;
  view: SearchView;
  history: readonly string[];
  selected: CountryView | null;
}>;

export type Listener = (state: AppState, prev: AppState) => void;

export type ControllerDeps = Readonly<{
  search: Search<readonly RawCountry[]>;
  history: HistoryStore;
  debounceMs?: number;
}>;

export const DEFAULT_DEBOUNCE_MS = 300;

const IDLE: SearchView = { status: 'idle' };

const toErrorMessage = (error: unknown): string =>
  isTimeout(error)
    ? 'The server is taking too long to respond.'
    : error instanceof HttpError
      ? `The server returned an error ${error.status}.`
      : 'The request could not be completed. Please check your connection.';

export const createSearchController = ({ search, history, debounceMs = DEFAULT_DEBOUNCE_MS }: ControllerDeps) => {
  let state: AppState = { text: '', view: IDLE, history: history.load(), selected: null };
  let activeController: AbortController | null = null;
  const listeners = new Set<Listener>();

  const setState = (patch: Partial<AppState>): void => {
    const prev = state;
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener(state, prev));
  };

  const cancelActive = (): void => {
    activeController?.abort();
    activeController = null;
  };

  const executeSearch = async (query: string): Promise<void> => {
    cancelActive();
    const controller = new AbortController();
    activeController = controller;

    setState({ view: { status: 'loading', query } });

    try {
      const raw = await search(query, controller.signal);
      if (controller.signal.aborted) return;

      const countries = mapCountriesResponse(raw);
      const nextHistory = addToHistory(state.history, query);
      history.save(nextHistory);

      setState({
        view: countries.length > 0 ? { status: 'success', query, countries } : { status: 'empty', query },
        history: nextHistory,
      });
    } catch (error) {
      if (controller.signal.aborted || isCancellation(error)) return;
      setState({ view: { status: 'error', query, message: toErrorMessage(error) } });
    }
  };

  const debouncedSearch = debounce(executeSearch, debounceMs);

  const input = (text: string): void => {
    cancelActive();
    const query = normalizeQuery(text);

    if (query === '') {
      debouncedSearch.cancel();
      setState({ text, view: IDLE });
      return;
    }

    setState({ text });
    debouncedSearch(query);
  };

  const searchFromHistory = (query: string): void => {
    debouncedSearch.cancel();
    setState({ text: query });
    void executeSearch(query);
  };

  const retry = (): void => {
    if (state.view.status !== 'error') return;
    debouncedSearch.cancel();
    void executeSearch(state.view.query);
  };

  return Object.freeze({
    input,
    searchFromHistory,
    retry,
    select: (selected: CountryView): void => setState({ selected }),
    closeDetails: (): void => {
      if (state.selected !== null) setState({ selected: null });
    },
    getState: (): AppState => state,
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: (): void => {
      cancelActive();
      debouncedSearch.cancel();
      listeners.clear();
    },
  });
};

export type SearchController = ReturnType<typeof createSearchController>;

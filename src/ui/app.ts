import { SearchController, SearchView } from '../core/searchController';
import { createCountryCard } from './components/countryCard';
import { createHeader } from './components/header';
import { createSearchSection } from './components/searchSection';
import { loadingState, emptyState, errorState } from './components/states';

/** A screen reader phrase for a persistent live region (created once). */
const announce = (view: SearchView): string => {
  switch (view.status) {
    case 'loading':
      return 'Loading';
    case 'success':
      return `Countries found: ${view.countries.length}`;
    case 'empty':
      return 'Nothing found';
    default:
      return '';
  }
};

const viewNodes = (view: SearchView, c: SearchController): Node[] => {
  switch (view.status) {
    case 'loading':
      return [loadingState()];
    case 'empty':
      return [emptyState(view.query)];
    case 'error':
      return [errorState(view.message, c.retry)];
    case 'success': {
      const ul = document.createElement('ul');
      ul.classList.add('cards');

      const cards = view.countries.map((country) => createCountryCard(country, c.select));
      ul.append(...cards);

      return [ul];
    }
    default:
      return [];
  }
};

export const mountApp = (host: HTMLElement, controller: SearchController): void => {
  const state = controller.getState();

  const header = createHeader({
    title: 'Country search',
    lead: 'Start typing the name of the country',
  });

  const main = document.createElement('main');
  main.classList.add('main');

  const { searchSection, searchInput, historySlot } = createSearchSection({
    label: 'Name of the country',
    inputPlaceholder: 'For example: spain',
    history: state.history,
    onPick: (q) => controller.searchFromHistory(q),
  });

  searchInput.addEventListener('input', (e: Event) => {
    controller.input((e.target as HTMLInputElement).value);
  });

  const results = document.createElement('section');
  results.id = 'results';
  results.setAttribute('aria-labelledby', 'results-title');

  const resultsTitle = document.createElement('h2');
  resultsTitle.classList.add('sr-only');
  resultsTitle.textContent = 'Search results';

  const resultsStatus = document.createElement('p');
  resultsStatus.classList.add('sr-only');
  resultsStatus.textContent = announce(state.view);

  const resultsInner = document.createElement('div');
  resultsInner.classList.add('results');
  resultsInner.setAttribute('aria-busy', String(state.view.status === 'loading'));

  resultsInner.replaceChildren(...viewNodes(state.view, controller));

  results.append(resultsTitle, resultsStatus, resultsInner);
  main.append(searchSection, results);
  host.append(header, main);

  const renderHistory = (history: readonly string[]): void => {
    if (!historySlot) return;

    const { historySlot: newHistorySlot } = createSearchSection({
      label: 'Name of the country',
      inputPlaceholder: 'For example: spain',
      history,
      onPick: (q) => controller.searchFromHistory(q),
    });

    historySlot.replaceChildren(...newHistorySlot.childNodes);
  };

  // Subscribe to state changes from the controller
  controller.subscribe((next, prev) => {
    if (next.text !== searchInput.value) {
      searchInput.value = next.text;
    }

    if (next.history !== prev.history) {
      renderHistory(next.history);
    }

    if (next.view !== prev.view) {
      resultsInner.replaceChildren(...viewNodes(next.view, controller));
      resultsInner.setAttribute('aria-busy', String(next.view.status === 'loading'));
      resultsStatus.textContent = announce(next.view);
    }
  });
};

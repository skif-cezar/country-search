import { SearchController, SearchView } from '../core/searchController';
import { createHeader } from './components/header';
import { createSearchSection } from './components/searchSection';

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

export const mountApp = (host: HTMLElement, _controller: SearchController): void => {
  const header = createHeader({
    title: 'Country search',
    lead: 'Start typing the name of the country',
  });

  const main = document.createElement('main');
  main.classList.add('main');

  const searchSection = createSearchSection({
    label: 'Name of the country',
    inputPlaceholder: 'For example: spain',
    // TODO: заменить моковое значение
    history: ['spain', 'bel'],
    onPick: (q: string) => {
      // eslint-disable-next-line no-console
      console.log('Выбран элемент:', q);
    },
  });

  const results = document.createElement('section');
  results.id = 'results';
  results.setAttribute('aria-labelledby', 'results-title');

  const resultsTitle = document.createElement('h2');
  resultsTitle.classList.add('sr-only');
  resultsTitle.textContent = 'Search results';

  const resultsStatus = document.createElement('p');
  resultsStatus.classList.add('sr-only');
  // TODO: заменить моковое значение
  resultsStatus.textContent = announce({
    status: 'empty',
    query: 'Nothing found',
  });

  const resultsInner = document.createElement('div');
  resultsInner.classList.add('results');
  resultsInner.setAttribute('aria-busy', 'false');

  const cards = document.createElement('ul');
  cards.classList.add('cards');

  resultsInner.append(cards);
  results.append(resultsTitle, resultsStatus, resultsInner);
  main.append(searchSection, results);
  host.append(header, main);
};

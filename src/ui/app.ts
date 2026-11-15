import { SearchController } from '../core/searchController';
import { createHeader } from './components/header';
import { createSearchSection } from './components/searchSection';

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
    history: ['spain', 'bel'],
    onPick: (q: string) => {
      // eslint-disable-next-line no-console
      console.log('Выбран элемент:', q);
    },
  });

  main.append(searchSection);
  host.append(header, main);
};

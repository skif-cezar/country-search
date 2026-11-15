import { SearchController } from '../core/searchController';
import { createHeader } from './components/header';
import { createSearchSection } from './components/searchSection';

export const mountApp = (host: HTMLElement, _controller: SearchController): void => {
  const header = createHeader({
    title: 'Country search',
    lead: 'Start typing the name of the country',
  });

  const searchSection = createSearchSection({
    label: 'Name of the country',
    inputPlaceholder: 'For example: spain',
  });

  host.append(header, searchSection);
};

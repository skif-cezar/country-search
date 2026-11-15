import { SearchController } from '../core/searchController';
import { createHeader } from './components/header';

export const mountApp = (host: HTMLElement, _controller: SearchController): void => {
  const header = createHeader({ title: 'Country search', lead: 'Start typing the name of the country' });

  host.append(header);
};

import { SearchController } from '../core/searchController';

export const mountApp = (host: HTMLElement, _controller: SearchController): void => {
  const div = document.createElement('div');
  div.textContent = 'Init!';

  host.append(div);
};

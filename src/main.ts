import { createHistoryStore } from './core/history';
import { normalizeQuery } from './core/normalizeQuery';
import { createCachedSearch } from './core/requestCache';
import { createSearchController } from './core/searchController';
import { searchCountries } from './core/searchCountries';
import { RawCountry } from './core/types';
import { mountApp } from './ui/app';
import './ui/styles/main.scss';

// Composition root: единственное место, где зависимости связываются между собой.
const cached = createCachedSearch<readonly RawCountry[]>(searchCountries, normalizeQuery);

const controller = createSearchController({
  search: cached.search,
  history: createHistoryStore(() => window.localStorage),
});

const root = document.createElement('div');
root.id = 'app';
root.className = 'app';
document.body.append(root);
mountApp(root, controller);

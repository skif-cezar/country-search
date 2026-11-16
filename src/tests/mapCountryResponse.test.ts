import { describe, expect, it } from 'vitest';
import { mapCountryResponse } from '../core/mapCountryResponse';

const spain = {
  name: 'Spain',
  alpha3Code: 'ESP',
  capital: 'Madrid',
  region: 'Europe',
  subregion: 'Southern Europe',
  population: 47_000_000,
  area: 505_992,
  demonym: 'Spanish',
  borders: ['AND', 'FRA', 'PRT'],
  flag: '🇪🇸',
  flags: { svg: 'http://x.test/es.svg' },
  currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
  languages: [{ name: 'Spanish' }],
};

describe('mapCountryResponse', () => {
  it('преобразует полный ответ', () => {
    expect(mapCountryResponse(spain)).toMatchObject({
      id: 'ESP',
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47_000_000,
      flagUrl: 'https://x.test/es.svg',
      languages: ['Spanish'],
      currencies: ['Euro (€)'],
      borders: ['AND', 'FRA', 'PRT'],
      area: 505_992,
    });
  });

  it('переживает отсутствие необязательных полей', () => {
    expect(mapCountryResponse({ name: 'Nowhere' })).toMatchObject({
      id: 'Nowhere',
      capital: null,
      flagUrl: null,
      languages: [],
      borders: [],
      description: 'Description unavailable.',
    });
  });

  it('чистая: не мутирует вход и детерминирована', () => {
    const copy = structuredClone(spain);
    expect(mapCountryResponse(spain)).toEqual(mapCountryResponse(spain));
    expect(spain).toEqual(copy);
  });
});

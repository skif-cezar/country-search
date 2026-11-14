import { CountryView, RawCountry } from './types';

/** A pure function that transforms an API response into data for a card (name, flag, capital, region, population, languages). */
export const mapCountryResponse = (_raw: RawCountry): CountryView => {
  throw new Error('Not implemented');
};

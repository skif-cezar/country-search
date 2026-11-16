import { CountryView, RawCountry } from './types';

// Forcefully change http:// to https://
const toHttps = (url: string): string => url.replace(/^http:\/\//, 'https://');

// Safely select a flag link (SVG takes precedence over PNG)
const pickFlagUrl = (raw: RawCountry): string | null => {
  const url = raw.flags?.svg || raw.flags?.png;

  return url ? toHttps(url) : null;
};

// Compiling a text description of the country
const buildDescription = (raw: RawCountry): string => {
  const place = raw.subregion || raw.region;
  const parts: string[] = [];

  if (place) parts.push(`Located in the region: ${place}`);
  if (raw.demonym) parts.push(`Population: ${raw.demonym}`);

  if (parts.length === 0) return 'Description unavailable.';

  return `${parts.join('. ')}.`;
};

// Formatting currency into a readable format
const formatCurrency = (c: NonNullable<RawCountry['currencies']>[number]): string => {
  if (c.name && c.symbol) return `${c.name} (${c.symbol})`;

  return c.name || c.code || '';
};

/** Raw API response → card/details data. No network or DOM involved. */
export const mapCountryResponse = (raw: RawCountry): CountryView => ({
  id: raw.alpha3Code || raw.name,
  name: raw.name,
  flagUrl: pickFlagUrl(raw),
  flagEmoji: raw.flag || '',
  capital: raw.capital || null,
  region: raw.region || null,
  population: raw.population || null,
  languages: (raw.languages || []).map((l) => l.name).filter((name): name is string => Boolean(name)),
  description: buildDescription(raw),
  area: raw.area || null,
  borders: raw.borders || [],
  currencies: (raw.currencies || []).map(formatCurrency).filter(Boolean),
});

/** A pure function that transforms an API response into data for a card
 * (name, flag, capital, region, population, languages). */
export const mapCountriesResponse = (raws: readonly RawCountry[]): readonly CountryView[] =>
  raws.map(mapCountryResponse);

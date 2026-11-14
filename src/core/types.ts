/** Raw response from countries.dev (the fields we need; everything is optional: the API may not return a field). */
export type RawCountry = Readonly<{
  name: string;
  alpha3Code?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  demonym?: string;
  borders?: readonly string[];
  flag?: string;
  flags?: Readonly<{ svg?: string; png?: string }>;
  currencies?: readonly Readonly<{ code?: string; name?: string; symbol?: string }>[];
  languages?: readonly Readonly<{ name?: string }>[];
}>;

/** Data for the card and for the details window. */
export type CountryView = Readonly<{
  id: string;
  name: string;
  flagUrl: string | null;
  flagEmoji: string;
  capital: string | null;
  region: string | null;
  population: number | null;
  languages: readonly string[];
  description: string;
  area: number | null;
  borders: readonly string[];
  currencies: readonly string[];
}>;

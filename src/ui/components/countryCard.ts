import { CountryView } from '../../core/types';
import { formatList, formatNumber } from '../../utils/format';

export interface FactItem {
  readonly label: string;
  readonly value: unknown;
}

/**
 * Creates a flag DOM element (img or span) based on country data
 */
export const createCountryFlagElement = (country: CountryView): HTMLImageElement | HTMLSpanElement => {
  if (country.flagUrl) {
    const img = document.createElement('img');
    img.classList.add('flag');
    img.src = country.flagUrl;
    img.alt = `Flag: ${country.name}`;
    img.width = 64;
    img.height = 48;
    img.loading = 'lazy';
    img.decoding = 'async';

    return img;
  }

  const span = document.createElement('span');
  span.classList.add('flag', 'flag--emoji');
  span.setAttribute('aria-hidden', 'true');
  span.textContent = country.flagEmoji || '';

  return span;
};

/**
 * A helper function for generating the DOM structure of a list of facts.
 */
const renderFactsList = (items: FactItem[], additionalClasses: string[] = []): HTMLElement => {
  const factsList = document.createElement('dl');
  factsList.classList.add('facts', ...additionalClasses);

  items.forEach(({ label, value }) => {
    if (value === null || value === '' || value === undefined) return;

    const row = document.createElement('div');
    row.classList.add('facts__row');

    const dt = document.createElement('dt');
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.textContent = String(value);

    row.append(dt, dd);
    factsList.append(row);
  });

  return factsList;
};

/**
 * Creates a block of facts about a country (basic or detailed).
 * @param country - Object containing country data
 * @param isDetailed - Flag for displaying an extended set of facts
 */
export const createCountryFacts = (country: CountryView, isDetailed: boolean = false): HTMLElement => {
  const factsData: FactItem[] = isDetailed
    ? [
        { label: 'Area: ', value: formatNumber(country.area, ' km²') },
        { label: 'Borders: ', value: formatList(country.borders) },
        { label: 'Languages: ', value: formatList(country.languages) },
        { label: 'Currency: ', value: formatList(country.currencies) },
      ]
    : [
        { label: 'Capital: ', value: country.capital },
        { label: 'Region: ', value: country.region },
        { label: 'Population: ', value: formatNumber(country.population) },
      ];

  const classNames = isDetailed ? ['facts--details'] : [];

  return renderFactsList(factsData, classNames);
};

/**
 * Card. Making it clickable via an "extended" button in the header.
 */
export const createCountryCard = (country: CountryView, onOpen: (c: CountryView) => void): HTMLElement => {
  const cardItem = document.createElement('li');
  cardItem.classList.add('card');

  const cardInner = document.createElement('article');
  cardInner.classList.add('card__inner');

  const cardFlag = createCountryFlagElement(country);

  const cardText = document.createElement('div');
  cardText.classList.add('card__text');

  const cardTitle = document.createElement('h3');
  cardTitle.classList.add('card__title');
  cardTitle.textContent = country.name;

  const cardButton = document.createElement('button');
  cardButton.classList.add('card__button');
  cardButton.type = 'button';
  cardButton.setAttribute('aria-haspopup', 'dialog');
  cardButton.onclick = () => onOpen(country);

  const facts = createCountryFacts(country);

  cardTitle.append(cardButton);
  cardText.append(cardTitle, facts);
  cardInner.append(cardFlag, cardText);
  cardItem.append(cardInner);

  return cardItem;
};

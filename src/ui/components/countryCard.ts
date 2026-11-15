import { CountryView } from '../../core/types';

/**
 * Facts: capital, region, population.
 */
export const createCountryFacts = (country: CountryView): HTMLElement => {
  const factsList = document.createElement('dl');
  factsList.classList.add('facts');

  const factsData = [
    { label: 'Capital: ', value: country.capital },
    { label: 'Region: ', value: country.region },
    {
      label: 'Population: ',
      value: country.population !== null ? country.population.toLocaleString('ru-RU') : null,
    },
  ];

  factsData.forEach(({ label, value }) => {
    if (value === null || value === '') return;

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
 * Card. Making it clickable via an "extended" button in the header.
 */
export const createCountryCard = (country: CountryView, onOpen: (c: CountryView) => void): HTMLElement => {
  const cardItem = document.createElement('li');
  cardItem.classList.add('card');

  const cardInner = document.createElement('article');
  cardInner.classList.add('card__inner');

  let cardFlag: HTMLImageElement | HTMLSpanElement;

  if (country.flagUrl) {
    const img = document.createElement('img');
    img.classList.add('flag');
    img.src = country.flagUrl;
    img.alt = `Flag: ${country.name}`;
    img.width = 64;
    img.height = 48;
    img.loading = 'lazy';
    img.decoding = 'async';
    cardFlag = img;
  } else {
    const span = document.createElement('span');
    span.classList.add('flag', 'flag--emoji');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = country.flagEmoji || '';
    cardFlag = span;
  }

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

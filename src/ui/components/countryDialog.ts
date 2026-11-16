import { CountryView } from '../../core/types';
import { createCountryFacts, createCountryFlagElement } from './countryCard';

/** The content of a native <dialog>: element—focus trapping, handling the Esc key
 * and restoring focus—is managed by the browser. */
export const countryDetails = (country: CountryView, onClose: () => void): Node[] => {
  const detailsHead = document.createElement('header');
  detailsHead.classList.add('details__head');

  const cardFlag = createCountryFlagElement(country);

  const detailsTitle = document.createElement('h2');
  detailsTitle.classList.add('details__title');
  detailsTitle.id = 'details-title';
  detailsTitle.textContent = country.name;

  detailsHead.append(cardFlag, detailsTitle);

  const detailsDescription = document.createElement('p');
  detailsDescription.classList.add('details__description');
  detailsDescription.textContent = country.description;

  const detailsFacts = createCountryFacts(country, true);

  const button = document.createElement('button');
  button.classList.add('button');
  button.type = 'button';
  button.textContent = 'Close';
  button.addEventListener('click', () => onClose());

  return [detailsHead, detailsDescription, detailsFacts, button];
};

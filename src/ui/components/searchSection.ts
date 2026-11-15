export interface SearchSectionOptions {
  readonly label: string;
  readonly inputPlaceholder: string;
}

export const createSearchSection = ({ label, inputPlaceholder }: SearchSectionOptions): HTMLElement => {
  const search = document.createElement('section');
  search.classList.add('search');

  const searchLabel = document.createElement('label');
  searchLabel.classList.add('search__label');
  searchLabel.setAttribute('for', 'query');
  searchLabel.textContent = label;

  const searchInput = document.createElement('input');
  searchInput.classList.add('search__input');
  searchInput.setAttribute('id', 'query');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('name', 'query');
  searchInput.setAttribute('placeholder', `${inputPlaceholder}`);
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;

  search.append(searchLabel, searchInput);

  return search;
};

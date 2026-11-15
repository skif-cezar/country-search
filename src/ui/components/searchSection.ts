export interface SearchSectionOptions {
  readonly label: string;
  readonly inputPlaceholder: string;
  readonly history?: readonly string[];
  readonly onPick?: (q: string) => void;
}

export const createSearchSection = ({
  label,
  inputPlaceholder,
  history = [],
  onPick = () => {},
}: SearchSectionOptions): HTMLElement => {
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
  searchInput.setAttribute('placeholder', inputPlaceholder);
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;

  search.append(searchLabel, searchInput);

  if (history.length > 0) {
    const historySlot = document.createElement('div');
    historySlot.classList.add('history-slot');

    const nav = document.createElement('nav');
    nav.classList.add('history');
    nav.setAttribute('aria-label', 'Query history');

    const historyTitle = document.createElement('h2');
    historyTitle.classList.add('history__title');
    historyTitle.textContent = 'Recent queries';

    const ul = document.createElement('ul');
    ul.classList.add('history__list');

    const fragment = document.createDocumentFragment();

    history.forEach((q) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.classList.add('chip');
      button.type = 'button';
      button.textContent = q;
      button.addEventListener('click', () => onPick(q));

      li.append(button);
      fragment.append(li);
    });

    ul.append(fragment);
    nav.append(historyTitle, ul);
    historySlot.append(nav);

    search.append(historySlot);
  }

  return search;
};

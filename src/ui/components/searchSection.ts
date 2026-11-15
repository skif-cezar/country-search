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
}: SearchSectionOptions): { searchSection: HTMLElement; searchInput: HTMLInputElement; historySlot: HTMLElement } => {
  const searchSection = document.createElement('section');
  searchSection.classList.add('search');

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

  searchSection.append(searchLabel, searchInput);

  const historySlot = document.createElement('div');
  historySlot.classList.add('history-slot');

  if (history.length > 0) {
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
  }
  searchSection.append(historySlot);

  return { searchSection, searchInput, historySlot };
};

export interface HeaderOptions {
  readonly title: string;
  readonly lead: string;
}

export const createHeader = ({ title, lead }: HeaderOptions): HTMLElement => {
  const header = document.createElement('header');
  header.classList.add('header');

  const container = document.createElement('div');
  container.classList.add('header__container');

  const headerTitle = document.createElement('h1');
  headerTitle.classList.add('header__title');
  headerTitle.textContent = title;

  const headerLead = document.createElement('p');
  headerLead.classList.add('header__lead');
  headerLead.textContent = lead;

  container.append(headerTitle, headerLead);
  header.append(container);

  return header;
};

/** Loading. */
export const loadingState = (): HTMLElement => {
  const state = document.createElement('div');
  state.classList.add('state', 'state--loading');

  const spinner = document.createElement('span');
  spinner.classList.add('spinner');
  spinner.setAttribute('aria-hidden', 'true');

  const stateText = document.createElement('p');
  stateText.classList.add('state__text');
  stateText.textContent = 'Looking for countries...';

  state.append(spinner, stateText);

  return state;
};

/** A friendly "nothing found" message: visually, it does NOT look like an error. */
export const emptyState = (query: string): HTMLElement => {
  const state = document.createElement('div');
  state.classList.add('state', 'state--empty');

  const stateTitle = document.createElement('p');
  stateTitle.classList.add('state__title');
  stateTitle.textContent = 'Nothing found';

  const queryElement = document.createElement('strong');
  queryElement.classList.add('state__query');
  queryElement.textContent = `«${query}»`;

  const stateText = document.createElement('p');
  stateText.classList.add('state__text');
  stateText.append('There are no countries matching the query ', queryElement, '. Please try a different name.');

  state.append(stateTitle, stateText);

  return state;
};

/** role="alert": the error is announced immediately. The button repeats the LAST entered request. */
export const errorState = (message: string, onRetry: () => void): HTMLElement => {
  const state = document.createElement('div');
  state.classList.add('state', 'state--error');
  state.setAttribute('role', 'alert');

  const stateTitle = document.createElement('p');
  stateTitle.classList.add('state__title');
  stateTitle.textContent = 'Something went wrong';

  const stateMessage = document.createElement('p');
  stateMessage.classList.add('state__message');
  stateMessage.textContent = message;

  const button = document.createElement('button');
  button.classList.add('button');
  button.type = 'button';
  button.textContent = 'Repeat';
  button.addEventListener('click', onRetry);

  state.append(stateTitle, stateMessage, button);

  return state;
};

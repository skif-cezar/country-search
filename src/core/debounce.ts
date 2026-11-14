export type Debounced<A extends unknown[]> = ((...args: A) => void) & { cancel: () => void };

/**
 * Delays the invocation of `fn` by `delay` ms. Subsequent calls reset the timer.
 * The timer resides within a closure; its state is inaccessible from the outside.
 */
export const debounce = <A extends unknown[]>(fn: (...args: A) => void, delay: number): Debounced<A> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const cancel = (): void => {
    clearTimeout(timer);
    timer = undefined;
  };

  const debounced = (...args: A): void => {
    cancel();
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };

  return Object.assign(debounced, { cancel });
};

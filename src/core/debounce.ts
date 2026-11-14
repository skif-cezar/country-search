export type Debounced<A extends unknown[]> = ((...args: A) => void) & { cancel: () => void };

/**
 * Delays the invocation of `fn` by `delay` ms. Subsequent calls reset the timer.
 * The timer resides within a closure; its state is inaccessible from the outside.
 */
export const debounce = <A extends unknown[]>(_fn: (...args: A) => void, _delay: number): Debounced<A> => {
  throw new Error('Not implemented');
};

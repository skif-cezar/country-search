import { describe, expect, it, vi } from 'vitest';
import { createCachedSearch } from '../core/requestCache';

const deferred = <T>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const setup = () => {
  const d = deferred<string[]>();
  const signals: AbortSignal[] = [];
  const search = vi.fn((_q: string, signal: AbortSignal) => {
    signals.push(signal);
    return d.promise;
  });
  return { d, signals, search, cached: createCachedSearch(search, normalizeQuery) };
};
const sig = () => new AbortController();

describe('createCachedSearch', () => {
  it('повторный запрос берётся из кэша', async () => {
    const { d, search, cached } = setup();
    d.resolve(['Spain']);
    await cached.search('Spain', sig().signal);
    await cached.search(' spain ', sig().signal);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('одинаковые запросы в полёте разделяют один промис', async () => {
    const { d, search, cached } = setup();
    const a = cached.search('spain', sig().signal);
    const b = cached.search('spain', sig().signal);
    d.resolve(['Spain']);
    await expect(Promise.all([a, b])).resolves.toEqual([['Spain'], ['Spain']]);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('отмена одного вызывающего не рушит запрос для другого', async () => {
    const { d, signals, cached } = setup();
    const a = sig();
    const pa = cached.search('spain', a.signal);
    const pb = cached.search('spain', sig().signal);
    a.abort();
    await expect(pa).rejects.toMatchObject({ name: 'AbortError' });
    expect(signals[0]?.aborted).toBe(false);
    d.resolve(['Spain']);
    await expect(pb).resolves.toEqual(['Spain']);
  });

  it('сетевой запрос отменяется, когда отменились ВСЕ вызывающие', async () => {
    const { signals, cached } = setup();
    const a = sig();
    const b = sig();
    const pa = cached.search('spain', a.signal).catch(() => undefined);
    const pb = cached.search('spain', b.signal).catch(() => undefined);
    a.abort();
    b.abort();
    await Promise.all([pa, pb]);
    expect(signals[0]?.aborted).toBe(true);
  });

  it('ошибки не кэшируются', async () => {
    const d1 = deferred<string[]>();
    const d2 = deferred<string[]>();
    const search = vi.fn().mockReturnValueOnce(d1.promise).mockReturnValueOnce(d2.promise);
    const cached = createCachedSearch(search, normalizeQuery);
    const first = cached.search('x', sig().signal);
    d1.reject(new Error('fail'));
    await expect(first).rejects.toThrow('fail');
    d2.resolve(['ok']);
    await expect(cached.search('x', sig().signal)).resolves.toEqual(['ok']);
    expect(search).toHaveBeenCalledTimes(2);
  });
});

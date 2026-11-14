import { describe, expect, it } from 'vitest';
import { type Fetcher, makeSearchCountries } from "../core/searchCountries";
import { HttpError } from '../core/httpError';

const respond =
  (body: string, status: number): Fetcher =>
  async () =>
    new Response(body, { status });

  /** It hangs until the signal is interrupted; then it branches off based on the cause of the signal (much like an actual fetch). */
const hanging: Fetcher = (_url, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(init.signal?.reason));
  });

  const fresh = () => new AbortController().signal;

  describe('searchCountries', () => {
  it('200 → массив стран', async () => {
    const search = makeSearchCountries(respond(JSON.stringify([{ name: 'Spain' }]), 200));
    await expect(search('spain', fresh())).resolves.toEqual([{ name: 'Spain' }]);
  });

  it('404 → пустой массив, не ошибка', async () => {
    const search = makeSearchCountries(respond('Country not found', 404));
    await expect(search('zzz', fresh())).resolves.toEqual([]);
  });

  it('500 → HttpError со статусом', async () => {
    const search = makeSearchCountries(respond('boom', 500));
    await expect(search('x', fresh())).rejects.toMatchObject({ name: 'HttpError', status: 500 });
    await expect(search('x', fresh())).rejects.toBeInstanceOf(HttpError);
  });

  it('отмена вызывающим → AbortError', async () => {
    const controller = new AbortController();
    const promise = makeSearchCountries(hanging)('x', controller.signal);
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('таймаут → TimeoutError (а не AbortError)', async () => {
    const promise = makeSearchCountries(hanging, 10)('x', fresh());
    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSearchController } from '../core/searchController';
import { HttpError } from '../core/httpError';

const memoryHistory = { load: () => [] as string[], save: vi.fn() };

const setup = (impl: (q: string, s: AbortSignal) => Promise<{ name: string }[]>) => {
  const search = vi.fn(impl);
  const controller = createSearchController({ search, history: memoryHistory, debounceMs: 300 });
  return { search, controller };
};

const hang = (_q: string, s: AbortSignal) =>
  new Promise<never>((_r, reject) => s.addEventListener('abort', () => reject(s.reason)));

describe('searchController', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('отменяет активный запрос на КАЖДЫЙ ввод, до срабатывания debounce', async () => {
    const signals: AbortSignal[] = [];
    const { controller, search } = setup((q, s) => {
      signals.push(s);
      return hang(q, s);
    });
    controller.input('sp');
    await vi.advanceTimersByTimeAsync(300);
    expect(search).toHaveBeenCalledTimes(1);
    controller.input('spa'); // debounce hasn't triggered yet
    expect(signals[0]?.aborted).toBe(true);
    expect(controller.getState().view.status).toBe('loading'); // The cancellation was not a mistake
  });

  it('404 (пустой массив) → empty, не error', async () => {
    const { controller } = setup(async () => []);
    controller.input('zzz');
    await vi.advanceTimersByTimeAsync(300);
    expect(controller.getState().view).toEqual({ status: 'empty', query: 'zzz' });
  });

  it('настоящая ошибка → error; «Повторить» повторяет именно последний запрос', async () => {
    let fail = true;
    const { controller, search } = setup(async () => {
      if (fail) throw new HttpError(500);
      return [{ name: 'Spain' }];
    });
    controller.input('spain');
    await vi.advanceTimersByTimeAsync(300);
    expect(controller.getState().view).toMatchObject({
      status: 'error',
      message: 'Сервер вернул ошибку 500.',
    });
    fail = false;
    controller.retry();
    await vi.advanceTimersByTimeAsync(0);
    expect(search).toHaveBeenLastCalledWith('spain', expect.any(AbortSignal));
    expect(controller.getState().view.status).toBe('success');
  });

  it('пустой ввод: запрос не уходит, состояние сбрасывается', async () => {
    const { controller, search } = setup(async () => []);
    controller.input('   ');
    await vi.advanceTimersByTimeAsync(1000);
    expect(search).not.toHaveBeenCalled();
    expect(controller.getState().view.status).toBe('idle');
  });
});

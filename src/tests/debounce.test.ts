import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../core/debounce';

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('вызывает fn один раз с последними аргументами; повторный вызов сбрасывает таймер', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d('s');
    vi.advanceTimersByTime(200);
    d('sp');
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('sp');
  });

  it('cancel отменяет отложенный вызов', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    d.cancel();
    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();
  });
});

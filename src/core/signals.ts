/** Timeout signal. Native AbortSignal.timeout */
export const timeoutSignal = (ms: number): AbortSignal => {
  if (typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);

  const controller = new AbortController();

  setTimeout(() => controller.abort(new DOMException('Timed out', 'TimeoutError')), ms);

  return controller.signal;
};

/** Combines signals into one. Native AbortSignal.any */
export const anySignal = (signals: readonly AbortSignal[]): AbortSignal => {
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([...signals]);

  const controller = new AbortController();
  const already = signals.find((s) => s.aborted);

  if (already) {
    controller.abort(already.reason);
  } else {
    signals.forEach((s) =>
      s.addEventListener('abort', () => controller.abort(s.reason), {
        once: true,
        signal: controller.signal,
      }),
    );
  }

  return controller.signal;
};

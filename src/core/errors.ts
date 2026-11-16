const hasName = (error: unknown, name: string): boolean => error instanceof DOMException && error.name === name;

/** We cancelled the request ourselves (a new input). This is NOT an error for the user. */
export const isCancellation = (error: unknown): boolean => hasName(error, 'AbortError');

/** The server did not respond within the allotted time. This is a REAL error. */
export const isTimeout = (error: unknown): boolean => hasName(error, 'TimeoutError');

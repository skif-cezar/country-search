/** Unified normalization: cache key, value for history, and value for the query. */
export const normalizeQuery = (text: string): string => text.trim().replace(/\s+/g, ' ').toLowerCase();

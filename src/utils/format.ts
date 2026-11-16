const number = new Intl.NumberFormat('ru-RU');

export const formatNumber = (value: number | null, unit = ''): string =>
  value === null ? '—' : `${number.format(value)}${unit}`;

export const formatList = (items: readonly string[]): string => (items.length > 0 ? items.join(', ') : '—');

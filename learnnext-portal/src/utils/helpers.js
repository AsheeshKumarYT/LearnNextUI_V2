export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let idCounter = 0;
export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/** Generic comparator for DataTable sorting */
export function compareValues(a, b) {
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date || b instanceof Date) return new Date(a) - new Date(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Case-insensitive match of `query` against any of the given keys of `item` */
export function matchesQuery(item, query, keys) {
  if (!query) return true;
  const q = query.toLowerCase();
  return keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q));
}

export function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

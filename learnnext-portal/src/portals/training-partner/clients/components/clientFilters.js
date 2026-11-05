import { addDays, formatDate, startOfDay } from '@/utils/formatDate';

/** Filters shared by the toolbar (status, search) and the Filters drawer (everything else).
 *  rangeKey = which date preset produced `range` ('7d' | '30d' | '90d' | 'year' | 'custom'), for labels and the chip row. */
export const EMPTY_FILTERS = { name: '', code: '', mobile: '', status: 'all', createdBy: [], range: null, rangeKey: null };

/** Quick "Created" presets shown as chips in the drawer */
export const DATE_PRESETS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '90d', label: 'Last 90 days', days: 90 },
  { key: 'year', label: 'This year' },
];

export function presetRange(key) {
  const today = startOfDay(new Date());
  if (key === 'year') return { from: new Date(today.getFullYear(), 0, 1), to: today };
  const p = DATE_PRESETS.find((x) => x.key === key);
  return { from: addDays(today, -(p.days - 1)), to: today };
}

const digits = (v = '') => v.replace(/\D/g, '');
const has = (value, part) => value.toLowerCase().includes(part.trim().toLowerCase());

export function filterClients(list, filters, search = '') {
  const q = search.trim();
  const qDigits = digits(q);
  const from = filters.range?.from ? startOfDay(filters.range.from) : null;
  const toExclusive = filters.range?.to ? addDays(startOfDay(filters.range.to), 1) : null;

  return list.filter((c) => {
    // Quick search: name, code, or mobile (digits only, so "98200 41" matches "+91 98200 41120")
    if (q && !has(c.name, q) && !has(c.code, q) && !(qDigits.length >= 3 && digits(c.mobile).includes(qDigits))) return false;
    if (filters.status !== 'all' && c.status !== filters.status) return false;
    if (filters.name && !has(c.name, filters.name)) return false;
    if (filters.code && !has(c.code, filters.code)) return false;
    if (filters.mobile && !digits(c.mobile).includes(digits(filters.mobile))) return false;
    if (filters.createdBy.length && !filters.createdBy.includes(c.createdBy)) return false;
    const created = new Date(c.createdAt);
    if (from && created < from) return false;
    if (toExclusive && created >= toExclusive) return false;
    return true;
  });
}

/** Every filter that is set, as removable chips (status can also be set from the summary tiles). */
export function activeChips(filters) {
  const chips = [];
  if (filters.status !== 'all') chips.push({ key: 'status', label: `Status: ${filters.status === 'active' ? 'Active' : 'Inactive'}` });
  if (filters.name) chips.push({ key: 'name', label: `Name: ${filters.name}` });
  if (filters.code) chips.push({ key: 'code', label: `Code: ${filters.code}` });
  if (filters.mobile) chips.push({ key: 'mobile', label: `Mobile: ${filters.mobile}` });
  if (filters.createdBy.length) {
    const [first, ...rest] = filters.createdBy;
    chips.push({ key: 'createdBy', label: `Created by: ${first}${rest.length ? ` +${rest.length}` : ''}` });
  }
  if (filters.range?.from) {
    const preset = DATE_PRESETS.find((p) => p.key === filters.rangeKey);
    const { from, to } = filters.range;
    chips.push({ key: 'range', label: `Created: ${preset ? preset.label : `${formatDate(from, { year: undefined })} – ${to ? formatDate(to) : '…'}`}` });
  }
  return chips;
}

/** Filters with one chip's filter cleared (the date chip clears its preset too) */
export const clearFilter = (filters, key) => ({ ...filters, [key]: EMPTY_FILTERS[key], ...(key === 'range' && { rangeKey: null }) });

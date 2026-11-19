import { addDays, formatDate, startOfDay } from '@/utils/formatDate';
import { STAGE_LABEL } from './projectMeta';

/**
 * Projects list filtering: the summary pills (all / live / need action), the quick search and the Filters drawer.
 * Order: projects → pill → search → drawer filters.
 * Drawer filters: stages, runs (preset key + range), clients (ids), owners, program types, delivered by (sub-entities).
 */
export const EMPTY_FILTERS = { stages: [], runsKey: null, range: null, clients: [], owners: [], types: [], units: [] };

/** The summary pills' filters (in-setup / completed are defined too but not shown as pills) */
export const PILLS = {
  all: () => true,
  live: (p) => p.stage === 'live',
  attention: (p) => p.needsAction > 0,
  'in-setup': (p) => p.stage === 'in-setup',
  completed: (p) => p.stage === 'completed',
};

/** "Runs" presets in the drawer */
export const RUN_PRESETS = [
  { key: 'next30', label: 'Next 30 days' },
  { key: 'month', label: 'This month' },
  { key: 'last90', label: 'Last 90 days' },
];

export function presetRange(key) {
  const today = startOfDay(new Date());
  if (key === 'next30') return { from: today, to: addDays(today, 29) };
  if (key === 'month') return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
  return { from: addDays(today, -89), to: today };
}

const has = (value, q) => String(value ?? '').toLowerCase().includes(q);

/** Quick search: project name / code, client name / code, owner, and each program's name, OPP-…, sub-entity, facilitator */
export function searchProjects(list, search) {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (p) =>
      has(p.name, q) ||
      has(p.code, q) ||
      has(p.client.name, q) ||
      has(p.client.code, q) ||
      has(p.owner, q) ||
      p.programs.some((g) => has(g.program, q) || has(`OPP-${g.oppId}`, q) || has(g.subEntity, q) || has(g.facilitator?.name, q)),
  );
}

/** The drawer's filters */
export function filterProjects(list, f) {
  const from = f.range?.from ? startOfDay(f.range.from) : null;
  const toExclusive = f.range?.to ? addDays(startOfDay(f.range.to), 1) : null;
  return list.filter((p) => {
    if (f.stages.length && !f.stages.includes(p.stage)) return false;
    // Runs: the project's dates overlap the range
    if (toExclusive && !(new Date(p.start) < toExclusive)) return false;
    if (from && !(new Date(p.end) >= from)) return false;
    if (f.clients.length && !f.clients.includes(p.client.id)) return false;
    if (f.owners.length && !f.owners.includes(p.owner)) return false;
    if (f.types.length && !p.programs.some((g) => f.types.includes(g.type))) return false;
    if (f.units.length && !p.programs.some((g) => f.units.includes(g.subEntity))) return false;
    return true;
  });
}

/** Pill → search → drawer filters */
export const applyAll = (list, pill, search, filters) => filterProjects(searchProjects(list.filter(PILLS[pill] ?? PILLS.all), search), filters);

const many = (label, [first, ...rest]) => `${label}: ${first}${rest.length ? ` +${rest.length}` : ''}`;

/** Every drawer filter that is set, as removable chips. `clientName(id)` names a client. */
export function activeChips(f, clientName) {
  const chips = [];
  if (f.stages.length) chips.push({ key: 'stages', label: many('Status', f.stages.map((s) => STAGE_LABEL[s])) });
  if (f.range?.from) {
    const preset = RUN_PRESETS.find((p) => p.key === f.runsKey);
    chips.push({ key: 'range', label: `Runs: ${preset ? preset.label : `${formatDate(f.range.from, { year: undefined })} – ${f.range.to ? formatDate(f.range.to) : '…'}`}` });
  }
  if (f.clients.length) chips.push({ key: 'clients', label: many('Client', f.clients.map(clientName)) });
  if (f.owners.length) chips.push({ key: 'owners', label: many('Owner', f.owners) });
  if (f.types.length) chips.push({ key: 'types', label: many('Type', f.types) });
  if (f.units.length) chips.push({ key: 'units', label: many('Delivered by', f.units) });
  return chips;
}

/** Filters with one chip's filter cleared (the Runs chip clears its preset too) */
export const clearFilter = (f, key) => ({ ...f, [key]: EMPTY_FILTERS[key], ...(key === 'range' && { runsKey: null }) });

/** Manage Content (programs and their uploaded content) and the Program & Content masters (program categories, modules). (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { uid } from '@/utils/helpers';
import { mock } from './coreApi';
import { entityStore, subEntityStore } from './financeMastersApi';

/* --------------------------------------------------------------- Program Category master */
// Seeded from the categories programs already use; [created days ago, created by] per category, in list order
const CATEGORY_SEED = [[420, 'Atul Kumar'], [395, 'Priya Sharma'], [310, 'Atul Kumar'], [240, 'Rohan Kapoor'], [96, 'Priya Sharma'], [12, 'Atul Kumar']];
const programCategoryStore = demo.programCategories.map((name, i) => {
  const [days, createdBy] = CATEGORY_SEED[i % CATEGORY_SEED.length];
  return { id: `pcat-${i + 1}`, name, createdBy, createdAt: new Date(Date.now() - days * 864e5).toISOString() };
});
export const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export const programCategoriesApi = {
  /** Every category with how many programs use it and their names (A–Z), newest first */
  list: () =>
    mock(
      programCategoryStore
        .map((c) => {
          const names = programStore.filter((p) => p.category === c.name).map((p) => p.name).sort((a, b) => a.localeCompare(b));
          return { ...c, programs: names.length, programNames: names };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    ),

  /** True if another category already has this name (names are unique, any case) */
  nameTaken: (name, exceptId) => programCategoryStore.some((c) => c.id !== exceptId && sameName(c.name, name)),

  async create(form, createdBy) {
    if (programCategoriesApi.nameTaken(form.name)) throw new Error('A category with this name already exists.');
    const row = { id: uid('pcat'), name: form.name.trim(), createdBy, createdAt: new Date().toISOString() };
    programCategoryStore.unshift(row);
    return mock(row, 500);
  },

  /** Rename — programs in the category move with it */
  async update(id, form) {
    const c = programCategoryStore.find((x) => x.id === id);
    if (!c) throw new Error('This category no longer exists.');
    if (programCategoriesApi.nameTaken(form.name, id)) throw new Error('A category with this name already exists.');
    const name = form.name.trim();
    programStore.forEach((p) => {
      if (p.category === c.name) p.category = name;
    });
    c.name = name;
    return mock(c, 500);
  },

  /** Only when no program uses it */
  async remove(id) {
    const c = programCategoryStore.find((x) => x.id === id);
    const used = c ? programStore.filter((p) => p.category === c.name).length : 0;
    if (used) throw new Error(`${used} ${used === 1 ? 'program is' : 'programs are'} in this category — move ${used === 1 ? 'it' : 'them'} to another category first.`);
    const i = programCategoryStore.findIndex((x) => x.id === id);
    if (i >= 0) programCategoryStore.splice(i, 1);
    return mock(true, 400);
  },
};

/* --------------------------------------------------------------- Modules master */
// The program phases, as in the old list (all created 14 Jul 2022, all enabled)
const moduleStore = ['Pre', 'During', 'Post'].map((name, i) => ({ id: `mod-${i + 1}`, name, enabled: true, createdBy: 'Atul Kumar', createdAt: new Date(2022, 6, 14, 10, i).toISOString() }));

export const modulesApi = {
  /** Every module, oldest first (the phase order) */
  list: () => mock([...moduleStore].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))),

  /** True if another module already has this name (names are unique, any case) */
  nameTaken: (name, exceptId) => moduleStore.some((m) => m.id !== exceptId && sameName(m.name, name)),

  async create(form, createdBy) {
    if (modulesApi.nameTaken(form.name)) throw new Error('A module with this name already exists.');
    const row = { id: uid('mod'), name: form.name.trim(), enabled: form.enabled, createdBy, createdAt: new Date().toISOString() };
    moduleStore.push(row);
    return mock(row, 500);
  },

  async update(id, form) {
    const m = moduleStore.find((x) => x.id === id);
    if (!m) throw new Error('This module no longer exists.');
    if (modulesApi.nameTaken(form.name, id)) throw new Error('A module with this name already exists.');
    Object.assign(m, { name: form.name.trim(), enabled: form.enabled });
    return mock(m, 500);
  },

  async remove(id) {
    const i = moduleStore.findIndex((x) => x.id === id);
    if (i >= 0) moduleStore.splice(i, 1);
    return mock(true, 400);
  },
};

/* --------------------------------------------------------------- Manage Content (programs) */
export const programStore = structuredClone(demo.programs);
export const entityName = (id) => entityStore.find((e) => e.id === id)?.name ?? 'Removed entity';
const subName = (id) => subEntityStore.find((s) => s.id === id)?.name ?? 'Removed sub-entity';
const mappingLabel = (p) => `${subName(p.sub)} · ${entityName(p.entity)}`;
// A program with its entity / sub-entity names filled in (the store keeps ids, so renames in the masters show up)
const programView = (p) => ({ ...structuredClone(p), entityName: entityName(p.entity), subName: subName(p.sub) });

export const programsApi = {
  /** Every program, newest first, each with its history of changes (newest first) */
  list: () => mock(programStore.map(programView).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** One program for the edit form / details (null if not found) */
  get: (id) => {
    const p = programStore.find((x) => x.id === id);
    return p ? programView(p) : null;
  },

  /** Options for the program form: categories (from the Program Category master), active entities and their active sub-entities */
  lookups: () => ({
    categories: [...programCategoryStore].map((c) => c.name).sort((a, b) => a.localeCompare(b)),
    entities: entityStore.filter((e) => e.status === 'active').map((e) => ({ id: e.id, name: e.name, prefix: e.invoicePrefix })),
    subEntities: subEntityStore.filter((s) => s.status === 'active').map((s) => ({ id: s.id, name: s.name, entity: s.entity })),
  }),

  /** True if another program already has this name (names are unique) */
  nameTaken: (name, exceptId) => programStore.some((p) => p.id !== exceptId && p.name.trim().toLowerCase() === name.trim().toLowerCase()),

  async create(form, by) {
    if (programsApi.nameTaken(form.name)) throw new Error('Another program already has this name.');
    const at = new Date().toISOString();
    const program = { ...structuredClone(form), id: uid('prg'), name: form.name.trim(), fee: Number(form.fee), createdBy: by, createdAt: at };
    program.history = [{ id: uid('h'), kind: 'created', by, at }];
    programStore.unshift(program);
    return mock(programView(program), 700);
  },

  /** Saves changes and records one history entry per changed field (fee / mapping keep the before → after values) */
  async update(id, form, by) {
    const p = programStore.find((x) => x.id === id);
    if (!p) throw new Error('This program no longer exists.');
    if (programsApi.nameTaken(form.name, id)) throw new Error('Another program already has this name.');
    const next = { ...p, ...structuredClone(form), name: form.name.trim(), fee: Number(form.fee) };
    const at = new Date().toISOString();
    const entry = (kind, from, to) => ({ id: uid('h'), kind, from, to, by, at });
    const changes = [
      next.name !== p.name && entry('name', p.name, next.name),
      next.category !== p.category && entry('category', p.category, next.category),
      next.logo !== p.logo && entry('logo', null, null),
      (next.entity !== p.entity || next.sub !== p.sub) && entry('mapping', mappingLabel(p), mappingLabel(next)),
      next.fee !== p.fee && entry('fee', p.fee, next.fee),
      next.overview?.name !== p.overview?.name && entry('overview', p.overview?.name ?? null, next.overview?.name ?? null),
    ].filter(Boolean);
    Object.assign(p, next, { history: [...changes, ...p.history] });
    return mock(programView(p), 700);
  },

  /** A program's own modules (its content lanes), in order — [{ key, name, hint }]; Pre / During / Post unless it has more */
  stages: (id) => mock(modulesOf(id), 200),

  /** A program's content: { [module key]: elements } (pre, during, post, …) — each a list of elements { id, name, description, files[], createdBy, createdAt } */
  content: (id) => mock(contentFor(id)),

  /**
   * Adds an element to a bucket (stage = a module's key: pre | during | post | …). files = [{ kind: document | video | url, title (the name participants see), name (file name / link label), size?, type?, url? }].
   * Noted in the program's history.
   */
  async addElement(id, stage, form, by) {
    const p = programStore.find((x) => x.id === id);
    if (!p) throw new Error('This program no longer exists.');
    const at = new Date().toISOString();
    const el = {
      id: uid('el'),
      name: form.name.trim(),
      description: form.description.trim(),
      files: form.files.map(({ _k, ...f }) => ({ ...f, title: f.title?.trim() || f.name, id: uid('f') })),
      createdBy: by,
      createdAt: at,
    };
    const buckets = (contentStore[id] ??= {});
    (buckets[stage] ??= []).push(el);
    p.history.unshift({ id: uid('h'), kind: 'element', to: el.name, note: stageName(id, stage), by, at });
    return mock(structuredClone(el), 600);
  },

  /** Saves an element's new name, description and files (kept files keep their ids, new ones get one); noted in the history */
  async updateElement(id, stage, elementId, form, by) {
    const p = programStore.find((x) => x.id === id);
    const el = contentStore[id]?.[stage]?.find((e) => e.id === elementId);
    if (!el) throw new Error('This element no longer exists.');
    Object.assign(el, {
      name: form.name.trim(),
      description: form.description.trim(),
      files: form.files.map(({ _k, ...f }) => ({ ...f, title: f.title?.trim() || f.name, id: f.id ?? uid('f') })),
      updatedBy: by,
      updatedAt: new Date().toISOString(),
    });
    p?.history.unshift({ id: uid('h'), kind: 'element-edited', to: el.name, note: stageName(id, stage), by, at: el.updatedAt });
    return mock(structuredClone(el), 600);
  },

  /** Removes an element (and its files) from a bucket; noted in the program's history */
  async removeElement(id, stage, elementId, by) {
    const p = programStore.find((x) => x.id === id);
    const list = contentStore[id]?.[stage] ?? [];
    const i = list.findIndex((e) => e.id === elementId);
    if (i < 0) throw new Error('This element no longer exists.');
    const [el] = list.splice(i, 1);
    p?.history.unshift({ id: uid('h'), kind: 'element-removed', to: el.name, note: stageName(id, stage), by, at: new Date().toISOString() });
    return mock(true, 400);
  },

  /**
   * Moves an element to position `toIndex` of bucket `toStage` (the same bucket = reorder). Moving to another bucket
   * is noted in the history; reordering isn't. Returns the program's content.
   */
  async moveElement(id, fromStage, elementId, toStage, toIndex, by) {
    const p = programStore.find((x) => x.id === id);
    const buckets = (contentStore[id] ??= {});
    const from = buckets[fromStage] ?? [];
    const i = from.findIndex((e) => e.id === elementId);
    if (i < 0) throw new Error('This element no longer exists.');
    const [el] = from.splice(i, 1);
    const to = (buckets[toStage] ??= []);
    to.splice(Math.max(0, Math.min(toIndex, to.length)), 0, el);
    if (fromStage !== toStage) {
      p?.history.unshift({ id: uid('h'), kind: 'element-moved', to: el.name, note: `${stageName(id, fromStage)} → ${stageName(id, toStage)}`, by, at: new Date().toISOString() });
    }
    return mock(contentFor(id), 300);
  },

  /**
   * Saves content permissions: `changes` = { [elementId]: { trainer, participant } }, each 'read' | 'download' | 'both'
   * (Read only = view in the app, Download = save the files, Both). Noted in the history as one entry.
   */
  async savePermissions(id, changes, by) {
    const p = programStore.find((x) => x.id === id);
    const buckets = contentStore[id] ?? {};
    let n = 0;
    for (const list of Object.values(buckets)) {
      for (const el of list) {
        if (changes[el.id]) {
          el.permissions = { ...permissionsOf(el), ...changes[el.id] };
          n++;
        }
      }
    }
    if (n) p?.history.unshift({ id: uid('h'), kind: 'permissions', to: `${n} element${n === 1 ? '' : 's'}`, by, at: new Date().toISOString() });
    return mock(contentFor(id), 500);
  },
};

const contentStore = structuredClone(demo.programContent);
// Each program's modules (its content lanes). Most use the standard three; a few demo programs have more. Which modules
// a program has will be managed from the Projects page later — independent of the Modules master.
const STANDARD_MODULES = { pre: 'Pre-program', during: 'During', post: 'Post-program' };
const modulesOf = (id) =>
  (demo.programModules[id] ?? Object.keys(STANDARD_MODULES).map((k) => [k])).map(([key, name, hint]) => ({ key, name: name ?? STANDARD_MODULES[key] ?? key, hint }));
const stageName = (id, key) => modulesOf(id).find((m) => m.key === key)?.name ?? STANDARD_MODULES[key] ?? key;
// Who can do what with an element's files, until set: trainers both view and download, participants view only
const DEFAULT_PERMISSIONS = { trainer: 'both', participant: 'read' };
const permissionsOf = (el) => ({ ...DEFAULT_PERMISSIONS, ...el.permissions });
const contentFor = (id) => {
  // A bucket per module of the program (empty until it gets an element)
  const c = { ...Object.fromEntries(modulesOf(id).map((m) => [m.key, []])), ...structuredClone(contentStore[id] ?? {}) };
  for (const k of Object.keys(c)) c[k] = c[k].map((el) => ({ ...el, permissions: permissionsOf(el) }));
  return c;
};

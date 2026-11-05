/** Settings → Finance masters: entities, sub-entities and expense heads. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { uid } from '@/utils/helpers';
import { mock } from './coreApi';

/* --------------------------------------------------------------- Entity master */
export const entityStore = structuredClone(demo.entities);

export const entitiesApi = {
  /** Every entity, newest first (filtering / sorting happen on the page — small list) */
  list: () => mock([...entityStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** One entity for the edit form (null if not found) */
  get: (id) => structuredClone(entityStore.find((e) => e.id === id) ?? null),

  /** Countries / states / cities for the address (same list as the client form) */
  geo: () => demo.clientLookups.geo,

  /** True if another entity already uses this invoice prefix (they must be unique — invoice numbers start with it) */
  prefixTaken: (prefix, exceptId) => entityStore.some((e) => e.id !== exceptId && e.invoicePrefix.toLowerCase() === prefix.trim().toLowerCase()),

  async create(form, createdBy) {
    if (entitiesApi.prefixTaken(form.invoicePrefix)) throw new Error('Another entity already uses this invoice initial.');
    const entity = { ...structuredClone(form), id: uid('ent'), invoicePrefix: form.invoicePrefix.trim().toUpperCase(), status: 'active', createdBy, createdAt: new Date().toISOString() };
    entityStore.unshift(entity);
    return mock(entity, 700);
  },

  /** Saves changes. The invoice initial can't change once set (issued invoices carry it). */
  async update(id, form) {
    const i = entityStore.findIndex((e) => e.id === id);
    if (i < 0) throw new Error('This entity no longer exists.');
    entityStore[i] = { ...entityStore[i], ...structuredClone(form), invoicePrefix: entityStore[i].invoicePrefix };
    return mock(entityStore[i], 700);
  },

  /** Removes an entity (the page blocks this while other entities sit under it) */
  async remove(id) {
    if (entityStore.some((e) => e.parent === id && e.id !== id)) throw new Error('Other entities sit under this one.');
    if (subEntityStore.some((s) => s.entity === id)) throw new Error('Sub-entities sit under this one — move or delete them first.');
    const i = entityStore.findIndex((e) => e.id === id);
    if (i >= 0) entityStore.splice(i, 1);
    return mock(true, 400);
  },

  async setStatus(id, status) {
    const e = entityStore.find((x) => x.id === id);
    if (e) e.status = status;
    return mock(e, 300);
  },
};

/* --------------------------------------------------------------- Sub-entity master */
export const subEntityStore = structuredClone(demo.subEntities);

export const subEntitiesApi = {
  /** Every sub-entity, newest first (filtering / sorting happen on the page — small list) */
  list: () => mock([...subEntityStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** One sub-entity for the edit form (null if not found) */
  get: (id) => structuredClone(subEntityStore.find((s) => s.id === id) ?? null),

  /** True if the entity already has another sub-entity with this name (names are unique within an entity) */
  nameTaken: (entity, name, exceptId) => subEntityStore.some((s) => s.id !== exceptId && s.entity === entity && s.name.trim().toLowerCase() === name.trim().toLowerCase()),

  async create(form, createdBy) {
    if (subEntitiesApi.nameTaken(form.entity, form.name)) throw new Error('This entity already has a sub-entity with that name.');
    const sub = { ...structuredClone(form), id: uid('sub'), name: form.name.trim(), status: 'active', createdBy, createdAt: new Date().toISOString() };
    subEntityStore.unshift(sub);
    return mock(sub, 600);
  },

  async update(id, form) {
    const i = subEntityStore.findIndex((s) => s.id === id);
    if (i < 0) throw new Error('This sub-entity no longer exists.');
    if (subEntitiesApi.nameTaken(form.entity, form.name, id)) throw new Error('This entity already has a sub-entity with that name.');
    subEntityStore[i] = { ...subEntityStore[i], ...structuredClone(form), name: form.name.trim() };
    return mock(subEntityStore[i], 600);
  },

  async remove(id) {
    const used = expenseHeadStore.filter((x) => x.sub === id).length;
    if (used) throw new Error(`${used} expense ${used === 1 ? 'head uses' : 'heads use'} it — move or delete ${used === 1 ? 'it' : 'them'} first.`);
    const i = subEntityStore.findIndex((s) => s.id === id);
    if (i >= 0) subEntityStore.splice(i, 1);
    return mock(true, 400);
  },
};

/* --------------------------------------------------------------- Expense head master */
const expenseHeadStore = structuredClone(demo.expenseHeads);

export const expenseHeadsApi = {
  /** Every expense head row, newest first (filtering / sorting happen on the page — small list) */
  list: () => mock([...expenseHeadStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** The kinds of expense offered in the form */
  types: () => demo.expenseHeadTypes,

  /** One row for the edit form (null if not found) */
  get: (id) => structuredClone(expenseHeadStore.find((x) => x.id === id) ?? null),

  /** True if this sub-entity already has this expense head (a head + sub-entity pair is unique) */
  taken: (head, sub, exceptId) => expenseHeadStore.some((x) => x.id !== exceptId && x.head === head && x.sub === sub),

  async create(form, createdBy) {
    if (expenseHeadsApi.taken(form.head, form.sub)) throw new Error('This sub-entity already has that expense head.');
    const row = { ...structuredClone(form), id: uid('exp'), glCode: form.glCode.trim(), status: 'active', createdBy, createdAt: new Date().toISOString() };
    expenseHeadStore.unshift(row);
    return mock(row, 600);
  },

  async update(id, form) {
    const i = expenseHeadStore.findIndex((x) => x.id === id);
    if (i < 0) throw new Error('This expense head no longer exists.');
    if (expenseHeadsApi.taken(form.head, form.sub, id)) throw new Error('This sub-entity already has that expense head.');
    expenseHeadStore[i] = { ...expenseHeadStore[i], ...structuredClone(form), glCode: form.glCode.trim() };
    return mock(expenseHeadStore[i], 600);
  },

  async remove(id) {
    const i = expenseHeadStore.findIndex((x) => x.id === id);
    if (i >= 0) expenseHeadStore.splice(i, 1);
    return mock(true, 400);
  },
};

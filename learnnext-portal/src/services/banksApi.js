/** Settings → Banks: the Bank master and the House bank master (accounts each entity receives payments in). (Import from '@/services/api'.) */
import { uid } from '@/utils/helpers';
import { mock } from './coreApi';
import { entityStore } from './financeMastersApi';

const at = (iso) => new Date(iso).toISOString();
const same = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

/* --------------------------------------------------------------- Bank master */
// [name, enabled, added by, added on]
const BANK_SEED = [
  ['Axis Bank', true, 'Rohan Kapoor', '2026-01-23T10:00:00'],
  ['Bank of Baroda', true, 'Neha Verma', '2025-08-12T11:20:00'],
  ['Canara Bank', true, 'Rohan Kapoor', '2025-08-12T11:24:00'],
  ['Citibank', false, 'Atul Kumar', '2025-07-02T09:10:00'],
  ['Deutsche Bank', true, 'Atul Kumar', '2025-10-05T15:40:00'],
  ['Federal Bank', true, 'Neha Verma', '2025-09-01T12:00:00'],
  ['HDFC Bank', true, 'Neha Verma', '2025-11-04T10:30:00'],
  ['Hongkong & Shanghai Banking Corporation', true, 'Atul Kumar', '2025-09-25T14:15:00'],
  ['ICICI Bank', true, 'Atul Kumar', '2025-11-24T09:45:00'],
  ['IDFC First Bank', true, 'Rohan Kapoor', '2025-12-03T16:05:00'],
  ['Indian Overseas Bank', true, 'Neha Verma', '2025-10-15T11:00:00'],
  ['IndusInd Bank', true, 'Rohan Kapoor', '2025-12-18T10:10:00'],
  ['Kotak Mahindra Bank', true, 'Atul Kumar', '2025-08-30T13:30:00'],
  ['Punjab National Bank', true, 'Neha Verma', '2025-08-12T11:28:00'],
  ['Standard Chartered Bank', true, 'Atul Kumar', '2025-09-25T14:20:00'],
  ['State Bank of India', true, 'Rohan Kapoor', '2025-08-12T11:15:00'],
  ['Yes Bank', false, 'Neha Verma', '2025-07-20T17:00:00'],
];
export const bankStore = BANK_SEED.map(([name, enabled, addedBy, addedOn], i) => ({ id: `bank-${i + 1}`, name, enabled, addedBy, addedOn: at(addedOn) }));
const bankId = (name) => bankStore.find((b) => b.name === name)?.id;

/* --------------------------------------------------------------- House bank master */
// [bank, entity, account no., IFSC, holder (blank = the entity's name), branch code, branch name, primary, added on]
const HOUSE_SEED = [
  ['Deutsche Bank', 'ent-6', '400078230019', 'DEUT0279PBC', '', '279PBC', 'Connaught Place, New Delhi', false, '2025-10-06T10:00:00'],
  ['HDFC Bank', 'ent-1', '50200011345678', 'HDFC0000572', '', '0572', 'Sector 44, Gurugram', true, '2025-11-05T11:00:00'],
  ['Hongkong & Shanghai Banking Corporation', 'ent-2', '166801062001', 'HSBC0110005', '', '054', 'JMD Regent Square, DLF Phase 2, Gurugram', true, '2025-09-26T12:00:00'],
  ['Hongkong & Shanghai Banking Corporation', 'ent-5', '166801072001', 'HSBC0110005', 'Leadership Consulting Private Limited', 'HSBCINBBDDA', 'HSBC, Gurugram', true, '2025-09-26T12:10:00'],
  ['Hongkong & Shanghai Banking Corporation', 'ent-4', '166801064001', 'HSBC0110005', '', '054', 'HSBC, Gurugram', true, '2025-09-26T12:20:00'],
  ['Hongkong & Shanghai Banking Corporation', 'ent-6', '166801068001', 'HSBC0110002', '', '166', '25 Barakhamba Road, New Delhi', true, '2025-09-26T12:30:00'],
  ['ICICI Bank', 'ent-3', '012705004321', 'ICIC0000127', '', '0127', 'Nehru Place, New Delhi', true, '2025-11-25T10:00:00'],
  ['Indian Overseas Bank', 'ent-1', '170202000009876', 'IOBA0001702', '', '1702', 'Janpath, New Delhi', false, '2025-10-16T10:00:00'],
];
const entityName = (id) => entityStore.find((e) => e.id === id)?.name ?? '';
export const houseBankStore = HOUSE_SEED.map(([bank, entity, accountNo, ifsc, holder, branchCode, branchName, primary, addedOn], i) => ({
  id: `hb-${i + 1}`,
  bank: bankId(bank),
  entity,
  accountNo,
  ifsc,
  holder: holder || entityName(entity),
  branchCode,
  branchName,
  primary,
  cheque: { name: `Cancelled cheque – ${bank.split(' ')[0]} ${accountNo.slice(-4)}.pdf`, size: 184_000 + i * 9_000, type: 'application/pdf' },
  addedBy: 'Atul Kumar',
  addedOn: at(addedOn),
}));

const bankView = (b) => ({ ...structuredClone(b), accounts: houseBankStore.filter((h) => h.bank === b.id).length });
const houseView = (h) => ({ ...structuredClone(h), bankName: bankStore.find((b) => b.id === h.bank)?.name ?? '—', entityName: entityName(h.entity) });

/** Keep one primary account per entity: making `id` primary makes the entity's others secondary */
const settlePrimary = (h) => {
  if (h.primary) houseBankStore.forEach((x) => x.entity === h.entity && x.id !== h.id && (x.primary = false));
};

export const banksApi = {
  /** Every bank with how many house accounts use it (sorting / filtering happen on the page) */
  list: () => mock(bankStore.map(bankView)),
  nameTaken: (name, exceptId) => bankStore.some((b) => b.id !== exceptId && same(b.name, name)),

  async create({ name, enabled }, addedBy) {
    if (banksApi.nameTaken(name)) throw new Error('This bank is already in the list.');
    const bank = { id: uid('bank'), name: name.trim(), enabled, addedBy, addedOn: new Date().toISOString() };
    bankStore.push(bank);
    return mock(bankView(bank), 500);
  },

  async update(id, { name, enabled }) {
    const b = bankStore.find((x) => x.id === id);
    if (!b) throw new Error('This bank no longer exists.');
    if (banksApi.nameTaken(name, id)) throw new Error('This bank is already in the list.');
    Object.assign(b, { name: name.trim(), enabled });
    return mock(bankView(b), 500);
  },

  /** A bank that house accounts use can't be deleted (disable it instead) */
  async remove(id) {
    const n = houseBankStore.filter((h) => h.bank === id).length;
    if (n) throw new Error(`${n} house ${n === 1 ? 'account uses' : 'accounts use'} this bank — disable it instead.`);
    const i = bankStore.findIndex((b) => b.id === id);
    if (i >= 0) bankStore.splice(i, 1);
    return mock(true, 400);
  },
};

export const houseBanksApi = {
  /** Every house bank account with its bank and entity names */
  list: () => mock(houseBankStore.map(houseView)),
  get: (id) => structuredClone(houseBankStore.find((h) => h.id === id) ?? null),

  /** Dropdowns: entities, and the enabled banks (plus the account's current bank when editing, even if disabled) */
  lookups: (currentBank) => ({
    entities: entityStore.map((e) => ({ value: e.id, label: e.name })),
    banks: bankStore.filter((b) => b.enabled || b.id === currentBank).map((b) => ({ value: b.id, label: b.name })),
  }),

  /** The same account number can't be added twice at the same bank */
  accountTaken: (bank, accountNo, exceptId) => houseBankStore.some((h) => h.id !== exceptId && h.bank === bank && h.accountNo === accountNo),
  /** Does this entity already have a primary account (other than `exceptId`)? */
  primaryOf: (entity, exceptId) => houseBankStore.find((h) => h.entity === entity && h.primary && h.id !== exceptId) ?? null,

  async create(form, addedBy) {
    if (houseBanksApi.accountTaken(form.bank, form.accountNo)) throw new Error('This account is already added for that bank.');
    const h = { ...structuredClone(form), id: uid('hb'), addedBy, addedOn: new Date().toISOString() };
    houseBankStore.push(h);
    settlePrimary(h);
    return mock(houseView(h), 600);
  },

  async update(id, form) {
    const i = houseBankStore.findIndex((h) => h.id === id);
    if (i < 0) throw new Error('This account no longer exists.');
    if (houseBanksApi.accountTaken(form.bank, form.accountNo, id)) throw new Error('This account is already added for that bank.');
    houseBankStore[i] = { ...houseBankStore[i], ...structuredClone(form) };
    settlePrimary(houseBankStore[i]);
    return mock(houseView(houseBankStore[i]), 600);
  },

  async remove(id) {
    const i = houseBankStore.findIndex((h) => h.id === id);
    if (i >= 0) houseBankStore.splice(i, 1);
    return mock(true, 400);
  },
};

/** Initials for a bank's tile: "Deutsche Bank" → "D", "Indian Overseas Bank" → "IO", "Hongkong & Shanghai Banking Corporation" → "HS" */
export function bankInitials(name = '') {
  const words = name.split(/\s+/).filter((w) => w && !/^(bank|banking|of|the|&|and|corporation|ltd|limited)$/i.test(w));
  if (!words.length) return (name[0] ?? '?').toUpperCase();
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0][0]).toUpperCase();
}

/**
 * Super Admin's clients — the training-partner companies that use LearnNext. Each one's own clients (the Training
 * Partner portal's All Clients) are its **sub clients**. Kept apart from the Training Partner data (clientsApi isn't
 * changed): sub clients are read from clientsApi.list() and linked here by client id.
 * Added by hand (no CRM). In memory, like the rest of the mock API — resets on reload. Pages import it from\n * '@/services/api'.
 */
import { clientsApi } from './clientsApi';
import { INITIAL_CLIENT } from '@/shared/clients/components/clientForm';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString();

// [code, name, companyType, city, state, pin, mobile, contact person, email, website, createdBy, days ago, status, gst]
const SEED = [
  ['TPR001', 'Aarav Learning Solutions Pvt Ltd', 'Private Limited', 'Mumbai', 'Maharashtra', '400051', '9820145566', 'Rohit Malhotra', 'rohit@aaravlearning.in', 'aaravlearning.in', 'Atul Kumar', 410, 'active', '27AAICA4521K1Z8'],
  ['TPR002', 'BrightPath Training Academy LLP', 'Limited Liability Partnership (LLP)', 'Bengaluru', 'Karnataka', '560038', '9845012377', 'Ananya Rao', 'ananya@brightpath.co.in', 'brightpath.co.in', 'Atul Kumar', 322, 'active', '29AAKFB7730M1Z2'],
  ['TPR003', 'Catalyst Skills & Consulting Pvt Ltd', 'Private Limited', 'Pune', 'Maharashtra', '411014', '9890233418', 'Vikram Desai', 'vikram@catalystskills.com', 'catalystskills.com', 'Priya Sharma', 240, 'active', '27AAGCC9123H1Z5'],
  ['TPR004', 'Northstar Corporate Learning Pvt Ltd', 'Private Limited', 'Gurugram', 'Haryana', '122002', '9811067045', 'Sana Mirza', 'sana@northstarlearning.in', 'northstarlearning.in', 'Priya Sharma', 133, 'active', '06AAJCN3384Q1Z1'],
  ['TPR005', 'Elevate People Development LLP', 'Limited Liability Partnership (LLP)', 'Hyderabad', 'Telangana', '500081', '9849321190', 'Karthik Reddy', 'karthik@elevatepeople.in', 'elevatepeople.in', 'Atul Kumar', 48, 'inactive', '36AAKFE5562B1Z9'],
];

function formFor([code, name, companyType, city, state, pin, mobile, contactName, contactEmail, website, , , , gst]) {
  const comm = { line1: `${2 + (code.charCodeAt(5) % 9)}th Floor, ${name.split(' ')[0]} House`, line2: 'Business District', country: 'India', state, city, pin };
  return {
    ...structuredClone(INITIAL_CLIENT),
    trainingFor: 'company',
    code,
    companyName: name,
    companyType,
    industry: 'Education & Training',
    website,
    mobile,
    contactName,
    contactEmail,
    sez: 'no',
    comm,
    officeSame: true,
    billing: [{ id: `bill-${code}`, ...comm, gstNo: gst, gstDoc: { name: `GST-${code}.pdf`, type: 'application/pdf', size: 184_000 } }],
  };
}

// Each partner's own logo mark (public/logos/partner-*.svg) — different from every sub client's
const LOGOS = ['/logos/partner-sunrise.svg', '/logos/partner-path.svg', '/logos/partner-spark.svg', '/logos/partner-star.svg', '/logos/partner-steps.svg'];

/** What a new client starts with */
export const DEFAULT_SETTINGS = { crmFetch: false, portalAccess: true, contactEmails: true };

const store = SEED.map((row, i) => ({
  id: `tp-${i + 1}`,
  code: row[0],
  name: row[1],
  industry: 'Education & Training',
  city: row[3],
  mobile: row[6],
  contactName: row[7],
  createdBy: row[10],
  createdAt: daysAgo(row[11]),
  status: row[12],
  logo: LOGOS[i] ?? null,
  form: { ...formFor(row), logo: LOGOS[i] ?? '' },
  // Settings & Configuration — CRM fetching on for the first three (their CRM is connected), off for the rest
  settings: { ...DEFAULT_SETTINGS, crmFetch: i < 3, contactEmails: i !== 4 },
  history: [
    { type: 'created', by: row[10], at: daysAgo(row[11]) },
    ...(row[11] > 60 ? [{ type: 'updated', by: row[10], at: daysAgo(Math.round(row[11] / 2)) }] : []),
    ...(i < 3 ? [{ type: 'crm', on: true, by: row[10], at: daysAgo(Math.max(3, row[11] - 5)) }] : []),
    ...(row[12] === 'inactive' ? [{ type: 'status', status: 'inactive', by: 'Atul Kumar', at: daysAgo(6) }] : []),
  ],
}));

// Which training partner each existing client (sub client) belongs to — the 30 demo clients shared out in turn;
// clients added later in the Training Partner portal go to the first partner
const owner = new Map();
const ownerOf = (clientId, index) => {
  if (!owner.has(clientId)) owner.set(clientId, store[index % store.length]?.id ?? store[0].id);
  return owner.get(clientId);
};

const rowFrom = (form) => ({
  code: form.code,
  name: form.companyName.trim(),
  industry: form.industry,
  city: form.comm.city,
  mobile: form.mobile,
  contactName: form.contactName?.trim() ?? '',
  logo: form.logo || null,
});

export const partnersApi = {
  /** Every client with its sub-client count, newest first */
  async list() {
    const subs = await clientsApi.list();
    const counts = {};
    subs.forEach((c, i) => {
      const p = ownerOf(c.id, i);
      counts[p] = (counts[p] ?? 0) + 1;
    });
    await sleep(250);
    return structuredClone([...store].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((p) => ({ ...p, subClients: counts[p.id] ?? 0 })));
  },

  get: (id) => structuredClone(store.find((p) => p.id === id) ?? null),

  /** Every client right away (no delay) — for the ⌘K search */
  all: () => structuredClone(store),

  /** A client's sub clients (its own clients, as in the Training Partner portal's All Clients) */
  async subClients(id) {
    const subs = await clientsApi.list();
    return subs.filter((c, i) => ownerOf(c.id, i) === id);
  },

  /** Next free code: TPR + 3 digits */
  nextCode() {
    const max = store.reduce((m, p) => Math.max(m, Number(p.code.replace(/\D/g, '')) || 0), 0);
    return `TPR${String(max + 1).padStart(3, '0')}`;
  },

  /** Is this company name already a client? */
  nameTaken: (name, exceptId) => store.some((p) => p.id !== exceptId && p.name.toLowerCase() === name.trim().toLowerCase()),

  async create(form, createdBy) {
    const at = new Date().toISOString();
    const p = { id: `tp-${Date.now()}`, ...rowFrom(form), createdBy, createdAt: at, status: 'active', form: structuredClone(form), settings: { ...DEFAULT_SETTINGS }, history: [{ type: 'created', by: createdBy, at }] };
    store.unshift(p);
    await sleep(600);
    return structuredClone(p);
  },

  async update(id, form, status, by = 'You') {
    const i = store.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('This client no longer exists.');
    const at = new Date().toISOString();
    const prev = store[i];
    const events = [{ type: 'updated', by, at }, ...(status !== prev.status ? [{ type: 'status', status, by, at }] : [])];
    store[i] = { ...prev, ...rowFrom(form), status, form: structuredClone(form), history: [...prev.history, ...events] };
    await sleep(600);
    return structuredClone(store[i]);
  },
  /** Saves Settings & Configuration (status is one of them) and logs what changed in Activity History */
  async updateSettings(id, { status, ...settings }, by = 'You') {
    const i = store.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('This client no longer exists.');
    const prev = store[i];
    const at = new Date().toISOString();
    const events = [
      ...(status !== prev.status ? [{ type: 'status', status, by, at }] : []),
      ...(settings.crmFetch !== prev.settings.crmFetch ? [{ type: 'crm', on: settings.crmFetch, by, at }] : []),
      ...(settings.portalAccess !== prev.settings.portalAccess || settings.contactEmails !== prev.settings.contactEmails ? [{ type: 'settings', by, at }] : []),
    ];
    store[i] = { ...prev, status, settings: { ...prev.settings, ...settings }, history: [...prev.history, ...events] };
    await sleep(600);
    return structuredClone(store[i]);
  },

  /**
   * Activity History, in the shape ActivityTimeline reads ({ entries newest first, heat }): the client's own history
   * (added, updated, status, CRM fetching, settings) and each sub client joining.
   */
  async activity(id) {
    const p = store.find((x) => x.id === id);
    if (!p) return { entries: [], heat: [] };
    const subs = await partnersApi.subClients(id);
    const own = p.history.map((h, k) => {
      const base = { id: `${id}-h${k}`, module: 'client', at: h.at, detail: `by ${h.by}`, entity: p.name };
      if (h.type === 'created') return { ...base, kind: 'client', verb: 'Added client' };
      if (h.type === 'status') return { ...base, kind: 'status', verb: h.status === 'active' ? 'Marked active' : 'Marked inactive' };
      if (h.type === 'crm') return { ...base, module: 'settings', kind: 'settings', verb: h.on ? 'Turned on CRM fetching for' : 'Turned off CRM fetching for' };
      if (h.type === 'settings') return { ...base, module: 'settings', kind: 'settings', verb: 'Changed settings & configuration of' };
      return { ...base, kind: 'edit', verb: 'Updated details of' };
    });
    const joined = subs.map((c) => ({ id: `${id}-s-${c.id}`, module: 'subclients', kind: 'assign', verb: 'Added sub client', entity: c.name, detail: `by ${c.createdBy} · ${c.city}`, at: c.createdAt }));
    const entries = [...own, ...joined].sort((a, b) => new Date(b.at) - new Date(a.at));
    await sleep(200);
    return { entries, heat: [] };
  },
};
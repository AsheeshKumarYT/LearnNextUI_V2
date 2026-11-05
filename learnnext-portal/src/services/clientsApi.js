/** Clients (Training Partner portal): list, add/edit, CRM look-up, projects, participants, SPOCs, activity. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { uid } from '@/utils/helpers';
import { mock } from './coreApi';

/* --------------------------------------------------------------- Clients */
export const clientStore = [...demo.clients];

export const clientsApi = {
  /** Every client, newest first. Filtering/sorting happen on the page (small list). */
  list: () => mock([...clientStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** Dropdown options for the Add client form (+ names already on file, to flag duplicates) */
  lookups: () => ({ ...demo.clientLookups, existingClients: clientStore.map((c) => c.name) }),

  /** Next code for a new client, shown read-only on the form: CMP031 for a company, PRT031 for an individual */
  nextCode(trainingFor) {
    const seq = String(clientStore.length + 1).padStart(3, '0');
    return `${trainingFor === 'individual' ? 'PRT' : 'CMP'}${seq}`;
  },

  /** True if the CRM portal has a profile for this company name */
  inCrm: (name) => Object.hasOwn(demo.clientLookups.crmProfiles, name),

  /**
   * Pulls a company's full profile from the CRM portal (mock: dummy data built from the name) — the same shape as the
   * Add client form: details, contacts, logo, addresses, billing addresses with GST certificates and Lower TDS.
   */
  async crmFetch(name) {
    const profile = demo.clientLookups.crmProfiles[name];
    if (!profile) throw new Error('This company isn’t in the CRM portal.');
    return mock(companyProfile(name, profile, { fromCrm: true }), 600);
  },

  /**
   * One client with everything the detail and edit pages need (null if not found):
   * `form` (full form data), `settings` (Settings & Configuration) and `history` (Activity History, newest first).
   */
  get(id) {
    const client = clientStore.find((c) => c.id === id);
    if (!client) return null;
    return {
      ...client,
      form: structuredClone(client.details ?? formFromRow(client)),
      settings: { ...CLIENT_SETTINGS, ...client.settings },
      history: [...(client.history ?? [{ type: 'created', by: client.createdBy, at: client.createdAt }])].reverse(),
    };
  },

  /** A client's training projects, newest first (view only on the client page) — [] if the client isn't found */
  projects(id) {
    const client = clientStore.find((c) => c.id === id);
    return client ? projectsFor(client) : [];
  },

  /**
   * A client's activity in the same shape as profileApi.activity(): { entries: newest first, heat: last 84 days, or
   * since the client was added if that's shorter }.
   * The client's own history (added / edited / status / settings) plus mock project, participant, invoice and access events.
   */
  activity(id) {
    const client = clientStore.find((c) => c.id === id);
    return client ? clientActivityFor(client) : { entries: [], heat: [] };
  },

  /** A client's participants, each with their learning journey (projects they're in) — [] if the client isn't found */
  participants(id) {
    const client = clientStore.find((c) => c.id === id);
    return client ? participantsFor(client, projectsFor(client)) : [];
  },

  /** A client's SPOCs and the projects each can see — [] if the client isn't found */
  spocs(id) {
    const list = spocListOf(id);
    return list ? structuredClone(list) : [];
  },

  /** Choices for the SPOC form: departments and cities (both optional fields) */
  /** Prism's assessments, for the Settings & Configuration product access */
  prismAssessments: () => PRISM_ASSESSMENTS,

  spocLookups: () => ({
    departments: demo.clientLookups.participantDepartments,
    designations: demo.clientLookups.designations,
    // Country → state → cities, for the SPOC's address
    geo: demo.clientLookups.geo,
    cities: [...new Set(Object.values(demo.clientLookups.geo.India).flat())].sort(),
  }),

  /** Is this email already used by another SPOC of the client? */
  spocEmailTaken(clientId, email, exceptId) {
    const e = email.trim().toLowerCase();
    return Boolean(e) && (spocListOf(clientId) ?? []).some((s) => s.id !== exceptId && s.email.toLowerCase() === e);
  },

  /**
   * Adds a SPOC (no `id`) or saves changes to one: { name, email, mobile (10 digits), department?, location?, projects: [ids] }.
   * Returns the saved SPOC.
   */
  async saveSpoc(clientId, spoc) {
    const list = spocListOf(clientId);
    if (!list) throw new Error('This client no longer exists.');
    if (clientsApi.spocEmailTaken(clientId, spoc.email, spoc.id)) throw new Error('Another SPOC already uses this email.');
    const clean = {
      name: spoc.name.trim(),
      email: spoc.email.trim(),
      mobile: spoc.mobile,
      department: spoc.department || null,
      designation: spoc.designation || null,
      // The full address; `location` (its city) stays for the places that show a SPOC's city
      address: spoc.address ? { ...spoc.address, line1: spoc.address.line1.trim(), line2: spoc.address.line2.trim() } : null,
      location: spoc.address?.city || spoc.location || null,
      projects: [...spoc.projects],
    };
    let saved;
    if (spoc.id) {
      const i = list.findIndex((s) => s.id === spoc.id);
      if (i < 0) throw new Error('This SPOC no longer exists.');
      saved = list[i] = { ...list[i], ...clean };
    } else {
      saved = { id: uid('spoc'), ...clean, lastActive: null };
      list.push(saved);
    }
    return mock(saved, 600);
  },

  /** Saves a new client (company or individual) and returns the list row for it */
  async create(form, createdBy) {
    const at = new Date().toISOString();
    const client = { id: uid('cl'), ...rowFromForm(form), createdBy, createdAt: at, status: 'active', history: [{ type: 'created', by: createdBy, at }] };
    clientStore.unshift(client);
    return mock(client, 700);
  },

  /** Saves changes to a client (form data + status); keeps who created it and when */
  async update(id, form, status, by = 'You') {
    const i = clientStore.findIndex((c) => c.id === id);
    if (i < 0) throw new Error('This client no longer exists.');
    const prev = clientStore[i];
    const at = new Date().toISOString();
    const events = [{ type: 'updated', by, at }, ...(status !== prev.status ? [{ type: 'status', by, at, status }] : [])];
    clientStore[i] = { ...prev, ...rowFromForm(form), status, history: [...historyOf(prev), ...events] };
    return mock(clientStore[i], 700);
  },

  /** Saves Settings & Configuration (status is one of them) */
  async updateSettings(id, { status, ...settings }, by = 'You') {
    const i = clientStore.findIndex((c) => c.id === id);
    if (i < 0) throw new Error('This client no longer exists.');
    const prev = clientStore[i];
    const at = new Date().toISOString();
    const events = [...(status !== prev.status ? [{ type: 'status', by, at, status }] : []), { type: 'settings', by, at }];
    clientStore[i] = { ...prev, status, settings: { ...prev.settings, ...settings }, history: [...historyOf(prev), ...events] };
    return mock(clientStore[i], 600);
  },
};

/**
 * Mock projects for a client: a stable set built from its code — 0–8 projects, each with 1–3 programs, dated around
 * today so every status shows up, older ones reaching back a few years. Status always comes from the dates (upcoming → in progress → completed), for each
 * program and for the project as a whole (first start → last end).
 */
function projectsFor(client) {
  const { names, programs, entities, projectTypes } = demo.projectCatalog;
  let s = [...client.code].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 2147483647, 11);
  const rnd = (n) => {
    s = (s * 48271) % 2147483647;
    return s % n;
  };
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const at = (offset) => new Date(today.getTime() + offset * DAY);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`;
  const statusOf = (start, end) => (end < today ? 'completed' : start > today ? 'upcoming' : 'in-progress');
  const PEOPLE = ['Neha Verma', 'Rohan Kapoor', 'Priya Sharma', 'Atul Kumar', 'Vikram Rao'];
  // Project start, in days from today — one of each kind, then older ones going back a few years (one starting in
  // mid-December last year, so it runs into this one)
  const lastDecember = Math.round((new Date(today.getFullYear() - 1, 11, 12) - today) / DAY);
  const ANCHORS = [-9, -75, 14, -160, 40, lastDecember, -800, -1250];

  const count = [0, 3, 5, 6, 7, 8][rnd(6)];
  const first = rnd(names.length);
  return Array.from({ length: count }, (_, p) => {
    const anchor = ANCHORS[p];
    const list = Array.from({ length: 1 + rnd(3) }, (__, i) => {
      const [program, type] = programs[rnd(programs.length)];
      const [entity, subEntity] = entities[rnd(entities.length)];
      const start = at(anchor + i * (4 + rnd(10)));
      const end = new Date(start.getTime() + (3 + rnd(28)) * DAY);
      return { oppId: 1000 + rnd(9000), program, type, entity, subEntity, start: iso(start), end: iso(end), status: statusOf(start, end) };
    });
    const start = new Date(Math.min(...list.map((x) => new Date(x.start))));
    const end = new Date(Math.max(...list.map((x) => new Date(x.end))));
    const created = at(anchor - 12 - rnd(20));
    created.setHours(9 + rnd(8), rnd(60));
    return {
      id: `${client.id}-pr${p + 1}`,
      name: names[(first + p) % names.length],
      type: list[0].type,
      // From the name's position (not the random sequence), so adding it didn't reshuffle the rest of the data
      projectType: projectTypes[(first + p * 3) % projectTypes.length],
      createdAt: created.toISOString(),
      createdBy: PEOPLE[rnd(PEOPLE.length)],
      start: iso(start),
      end: iso(end),
      status: statusOf(start, end),
      programs: list,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// SPOCs per client id, seeded from spocsFor() the first time a client's SPOCs are read, then edited in place
const spocStore = new Map();
function spocListOf(clientId) {
  if (!spocStore.has(clientId)) {
    const client = clientStore.find((c) => c.id === clientId);
    if (!client) return null;
    spocStore.set(clientId, spocsFor(client, projectsFor(client)));
  }
  return spocStore.get(clientId);
}

/**
 * Mock SPOCs (single points of contact) for a client: a stable set of 2–5 built from its code, each seeing some or all of
 * the client's projects (at least one when there are projects). No primary contact — they're all equal.
 * Each: { id, name, email, mobile (10 digits), department (| null), location (| null), projects: [project ids], lastActive (ISO | null) }.
 */
function spocsFor(client, projects) {
  let s = [...client.code].reduce((n, ch) => (n * 37 + ch.charCodeAt(0)) % 2147483647, 7);
  const rnd = (n) => {
    s = (s * 48271) % 2147483647;
    return s % n;
  };
  const NAMES = ['Kavita Menon', 'Sameer Joshi', 'Ritu Malhotra', 'Arjun Nair', 'Meera Iyer', 'Karan Sethi', 'Pooja Bansal'];
  const DEPARTMENTS = ['Human Resources', 'Learning & Development', 'Finance', 'Talent Acquisition', 'Procurement', null];
  const CITIES = ['Mumbai', 'New Delhi', 'Bengaluru', 'Pune', 'Gurugram', 'Chennai', null];
  const domain = `${client.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ')[0] || 'client'}.com`;
  const count = 2 + rnd(4);
  const start = rnd(NAMES.length);
  return Array.from({ length: count }, (_, i) => {
    const name = NAMES[(start + i) % NAMES.length];
    const ids = projects.map((p) => p.id);
    // A random subset (now and then all of them), never empty when there are projects
    let mine = rnd(4) === 0 ? ids : ids.filter(() => rnd(3) > 0);
    if (!mine.length && ids.length) mine = [ids[rnd(ids.length)]];
    const active = rnd(5);
    return {
      id: `${client.id}-spoc${i + 1}`,
      name,
      department: DEPARTMENTS[rnd(DEPARTMENTS.length)],
      location: CITIES[rnd(CITIES.length)],
      email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@${domain}`,
      mobile: `98${String(10000000 + rnd(89999999)).slice(0, 3)}${String(10000 + rnd(89999))}`,
      projects: mine,
      lastActive: active === 0 ? null : new Date(Date.now() - (active * active * 7 + rnd(24)) * 3600000).toISOString(),
    };
  });
}

/**
 * Mock participants for a client: a stable set built from its code — none when it has no projects, else 6–40 people,
 * every field filled in.
 * Each is enrolled in 1–3 of the client's projects; a journey step is completed once its project has ended (most of
 * them), pending before it starts, in progress while it runs. Overall status: in progress if anything is running,
 * else pending if anything is left, else completed.
 */
function participantsFor(client, projects) {
  if (!projects.length) return [];
  const { firstNames, lastNames, mailDomains } = demo.participantCatalog;
  const { participantDepartments: departments, designations } = demo.clientLookups;
  let s = [...client.code].reduce((n, ch) => (n * 37 + ch.charCodeAt(0)) % 2147483647, 7);
  const rnd = (n) => {
    s = (s * 48271) % 2147483647;
    return s % n;
  };
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prefix = client.code.replace(/[^A-Z]/g, '').slice(0, 3) || 'EMP';
  const used = new Set();

  return Array.from({ length: 6 + rnd(35) }, (_, i) => {
    let first;
    let last;
    do {
      first = firstNames[rnd(firstNames.length)];
      last = lastNames[rnd(lastNames.length)];
    } while (used.has(`${first} ${last}`) && used.size < firstNames.length * lastNames.length);
    used.add(`${first} ${last}`);
    const name = `${first} ${last}`;

    // Journey: 1–3 distinct projects, oldest first
    const picks = [...new Set(Array.from({ length: 1 + rnd(3) }, () => rnd(projects.length)))].map((k) => projects[k]);
    const journey = picks
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map((p) => {
        const createdAt = new Date(new Date(p.start).getTime() - (3 + rnd(20)) * DAY);
        createdAt.setHours(9 + rnd(9), rnd(60));
        const ended = new Date(p.end) < today;
        // A few people never finish a project that has ended
        const status = p.status === 'upcoming' ? 'pending' : p.status === 'in-progress' ? 'in-progress' : ended && rnd(6) === 0 ? 'pending' : 'completed';
        const completedAt = status === 'completed' ? new Date(new Date(p.end).getTime() - rnd(3) * DAY).toISOString() : null;
        return { projectId: p.id, project: p.name, createdAt: createdAt.toISOString(), completedAt, status };
      });
    const status = journey.some((j) => j.status === 'in-progress') ? 'in-progress' : journey.some((j) => j.status === 'pending') ? 'pending' : 'completed';

    return {
      id: `${client.id}-pt${i + 1}`,
      name,
      email: `${first}.${last}${rnd(90) + 10}@${mailDomains[rnd(mailDomains.length)]}`.toLowerCase(),
      mobile: `+91 ${7 + rnd(3)}${String(rnd(10000)).padStart(4, '0')} ${String(rnd(100000)).padStart(5, '0')}`,
      department: departments[rnd(departments.length)],
      designation: designations[rnd(designations.length)],
      employeeCode: `${prefix}${String(100 + rnd(900))}`,
      journey,
      status,
    };
  });
}

/**
 * Mock activity for a client (see clientsApi.activity): its real history first, then a stable spread of events over the
 * last 12 weeks (never before the client was added) — projects set up, participants enrolled, invoices raised and
 * paid, SPOC access given. Entries: { id, module, kind, verb, entity, detail, at, amount? }.
 */
function clientActivityFor(client) {
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let s = [...client.code].reduce((n, ch) => (n * 41 + ch.charCodeAt(0)) % 2147483647, 13);
  const rnd = (n) => {
    s = (s * 48271) % 2147483647;
    return s % n;
  };
  const PEOPLE = ['Neha Verma', 'Rohan Kapoor', 'Priya Sharma', 'Atul Kumar', 'Vikram Rao'];
  const SPOCS = ['Kavita Menon', 'Sameer Joshi', 'Ritu Malhotra'];
  const projects = projectsFor(client);
  const people = participantsFor(client, projects);
  const added = new Date(client.createdAt).getTime();

  const history = (client.history ?? [{ type: 'created', by: client.createdBy, at: client.createdAt }]).map((h, i) => {
    const base = { id: `${client.id}-h${i}`, module: 'client', at: h.at, detail: `by ${h.by}` };
    if (h.type === 'created') return { ...base, kind: 'client', verb: 'Added client', entity: client.name };
    if (h.type === 'status') return { ...base, kind: 'status', verb: h.status === 'active' ? 'Marked active' : 'Marked inactive', entity: client.name };
    if (h.type === 'settings') return { ...base, kind: 'settings', verb: 'Changed settings & configuration of', entity: client.name };
    return { ...base, kind: 'edit', verb: 'Updated details of', entity: client.name };
  });

  const events = [];
  const pick = (list) => list[rnd(list.length)];
  for (let d = 83; d >= 0; d--) {
    const day = today.getTime() - d * DAY;
    // 0–3 events a day, quieter at weekends
    const weekend = [0, 6].includes(new Date(day).getDay());
    const n = weekend ? (rnd(4) === 0 ? 1 : 0) : [0, 1, 1, 2, 3][rnd(5)];
    for (let k = 0; k < n; k++) {
      const at = new Date(day + (9 + rnd(9)) * 3600000 + rnd(60) * 60000);
      if (at.getTime() < added || at > new Date()) continue;
      const by = pick(PEOPLE);
      const project = projects.length ? pick(projects) : null;
      const r = rnd(10);
      let e;
      if (project && r < 2) e = { module: 'projects', kind: 'create', verb: 'Set up project', entity: project.name, detail: `${by} · ${project.programs.length} programs` };
      else if (project && r < 3) e = { module: 'projects', kind: 'reschedule', verb: 'Rescheduled', entity: pick(project.programs).program, detail: `${by} · ${project.name}` };
      else if (project && people.length && r < 5) e = { module: 'participants', kind: 'assign', verb: 'Enrolled participants in', entity: project.name, detail: `${by} · ${2 + rnd(14)} people` };
      else if (people.length && r < 6)
        e = { module: 'participants', kind: 'complete', verb: 'Learning journey completed by', entity: pick(people).name, detail: project ? project.name : 'All projects' };
      else if (r < 8) {
        const amount = (40 + rnd(400)) * 1000;
        e = rnd(2)
          ? { module: 'finance', kind: 'credit', verb: 'Raised invoice', entity: `INV-${at.getFullYear()}-${String(100 + rnd(900))}`, detail: by, amount }
          : { module: 'finance', kind: 'paid', verb: 'Payment received for', entity: `INV-${at.getFullYear()}-${String(100 + rnd(900))}`, detail: 'Bank transfer', amount };
      } else e = { module: 'access', kind: 'access', verb: 'Gave project access to', entity: pick(SPOCS), detail: `${by} · ${project ? project.name : 'All projects'}` };
      events.push({ id: `${client.id}-a${d}-${k}`, at: at.toISOString(), ...e });
    }
  }

  const entries = [...history, ...events].sort((a, b) => new Date(b.at) - new Date(a.at));
  // The last 84 days — or only since the client was added, if that's more recent (at least two weeks)
  const addedDay = new Date(added);
  addedDay.setHours(0, 0, 0, 0);
  const days = Math.max(14, Math.min(84, Math.round((today - addedDay) / DAY) + 1));
  const heat = Array.from({ length: days }, (_, i) => {
    const date = new Date(today.getTime() - (days - 1 - i) * DAY);
    return { date: date.toISOString(), count: entries.filter((e) => new Date(e.at).toDateString() === date.toDateString()).length };
  });
  return { entries, heat };
}

/** Defaults for a client's Settings & Configuration (sample options until the real list is decided) */
const CLIENT_SETTINGS = { portalAccess: true, spocEmails: true, reminders: true, products: { prism: false, praxn: false }, prismAssessments: [] };
/** The assessments in Prism a client can be given (sample list until Prism's real catalogue is connected) */
const PRISM_ASSESSMENTS = [
  { id: 'pa-360', name: 'Leadership 360°', hint: 'Multi-rater feedback' },
  { id: 'pa-disc', name: 'DISC profile', hint: 'Behavioural style' },
  { id: 'pa-eq', name: 'Emotional intelligence', hint: 'EQ self-assessment' },
  { id: 'pa-team', name: 'Team effectiveness', hint: 'Team health check' },
  { id: 'pa-agility', name: 'Learning agility', hint: 'Readiness to grow' },
  { id: 'pa-sales', name: 'Sales competency', hint: 'Skills benchmark' },
];

/** Activity so far, oldest first (demo clients only have their creation) */
const historyOf = (c) => c.history ?? [{ type: 'created', by: c.createdBy, at: c.createdAt }];

/** The list row fields (+ full form) for a saved client */
function rowFromForm(form) {
  const company = form.trainingFor === 'company';
  return {
    code: form.code,
    name: company ? form.companyName.trim() : form.participantName.trim(),
    industry: company ? form.industry : 'Individual',
    city: form.comm.city,
    mobile: `+91 ${form.mobile.replace(/\D/g, '').replace(/(\d{5})(\d{5})/, '$1 $2')}`,
    logo: form.logo || null,
    trainingFor: form.trainingFor,
    details: structuredClone(form),
  };
}

/** Demo clients only have list fields — fill the rest of the form with matching dummy data so Edit opens complete */
function formFromRow(c) {
  const india = demo.clientLookups.geo.India;
  const state = Object.keys(india).find((s) => india[s].includes(c.city)) ?? 'Maharashtra';
  const city = india[state].includes(c.city) ? c.city : 'Mumbai';
  const industry = demo.clientLookups.industries.includes(c.industry) ? c.industry : c.industry === 'Training' ? 'Education & Training' : 'Other';
  const p = companyProfile(c.name, [industry, 'Public Limited', state, city]);
  return { ...p, trainingFor: 'company', code: c.code, mobile: c.mobile.replace(/^\+91\s*/, '').replace(/\D/g, ''), logo: c.logo ?? '' };
}

/**
 * Dummy company profile in the Add client form's shape, built deterministically from the name.
 * `profile` = [industry, company type, state, city]; `fromCrm` tags the documents as coming from the CRM portal.
 */
function companyProfile(name, [industry, companyType, state, city], { fromCrm = false } = {}) {
  const seed = [...name].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 99991, 7);
  const num = (len, salt = 0) => String((seed * 7919 + salt * 104729) % 10 ** len).padStart(len, '0');
  const slug = name
    .toLowerCase()
    .replace(/\b(ltd|limited|corporation|company|of|india|and)\b/g, '')
    .replace(/[^a-z]/g, '');
  const letters = (slug.toUpperCase() + 'XYZAB').slice(0, 3);
  const STATE_CODE = {
    Delhi: '07',
    Gujarat: '24',
    Haryana: '06',
    Jharkhand: '20',
    Karnataka: '29',
    Maharashtra: '27',
    'Tamil Nadu': '33',
    Telangana: '36',
    'Uttar Pradesh': '09',
    'West Bengal': '19',
  };
  const STD = {
    Delhi: '011',
    Gujarat: '079',
    Haryana: '0124',
    Jharkhand: '0657',
    Karnataka: '080',
    Maharashtra: '022',
    'Tamil Nadu': '044',
    Telangana: '040',
    'Uttar Pradesh': '0120',
    'West Bengal': '033',
  };
  const PIN = {
    'New Delhi': '110001',
    Ahmedabad: '380015',
    Gurugram: '122002',
    Bengaluru: '560001',
    Mumbai: '400021',
    Pune: '411001',
    Chennai: '600006',
    Noida: '201301',
    Ghaziabad: '201001',
    Kolkata: '700001',
    Hyderabad: '500001',
    Jamshedpur: '831001',
  };
  const pan = `${letters}C${letters[0]}${num(4, 1)}${String.fromCharCode(65 + (seed % 26))}`;
  const gst = (st) => `${STATE_CODE[st]}${pan}1Z${seed % 10}`;
  const second = state === 'Karnataka' ? ['Maharashtra', 'Mumbai'] : ['Karnataka', 'Bengaluru'];
  // Dummy documents open a sample PDF in the preview
  const doc = (fileName, size) => ({ name: fileName, size, type: 'application/pdf', url: '/samples/sample-document.pdf', ...(fromCrm && { fromCrm: true }) });
  const yearStart = new Date(new Date().getFullYear(), 3, 1);
  const LOGOS = ['bars', 'chevron', 'circles', 'hexagon', 'leaf', 'ring', 'spark', 'wave'];
  const pin = (c) => PIN[c] ?? '400001';

  const comm = { line1: `${name.split(' ')[0]} House, ${10 + (seed % 80)} Corporate Park`, line2: 'Business District', country: 'India', state, city, pin: pin(city) };
  const office = { line1: `Tower ${String.fromCharCode(65 + (seed % 4))}, ${100 + (seed % 400)} Tech Park Road`, line2: 'Near Metro Station', country: 'India', state, city, pin: pin(city) };
  const lowerTds = seed % 2 === 0;
  return {
    companyName: name,
    companyType,
    industry,
    website: `${slug}.com`,
    sez: seed % 3 === 0 ? 'yes' : 'no',
    ...(seed % 3 === 0 && { sezNo: `SEZ/${(STD[state] ?? '022').slice(1)}/20${10 + (seed % 14)}/${String(100 + (seed % 900)).padStart(4, '0')}`, sezDoc: doc('SEZ-approval-letter.pdf', 140_000 + (seed % 60_000)) }),
    mobile: `9${num(9, 2)}`,
    stdCode: STD[state] ?? '022',
    phone: num(8, 3).replace(/^0/, '4'),
    logo: `/logos/mark-${LOGOS[seed % LOGOS.length]}.svg`,
    comm,
    officeSame: false,
    office,
    billing: [
      { id: uid('bill'), ...comm, gstNo: gst(state), gstDoc: doc(`GST-Certificate-${state.replace(/\s/g, '')}.pdf`, 182_000 + (seed % 90_000)) },
      {
        id: uid('bill'),
        line1: `${200 + (seed % 300)} Regional Office`,
        line2: 'Commercial Complex',
        country: 'India',
        state: second[0],
        city: second[1],
        pin: pin(second[1]),
        gstNo: gst(second[0]),
        gstDoc: doc(`GST-Certificate-${second[0].replace(/\s/g, '')}.pdf`, 164_000 + (seed % 70_000)),
      },
    ],
    lowerTds,
    tdsRate: lowerTds ? '2' : '',
    tdsAmount: lowerTds ? `${5 + (seed % 20)}00000` : '',
    tdsSection: lowerTds ? '194J' : '',
    tdsFrom: lowerTds ? yearStart : null,
    tdsTo: lowerTds ? new Date(yearStart.getFullYear() + 1, 2, 31) : null,
    tdsCert: lowerTds ? doc(`Lower-TDS-Certificate-FY${String(yearStart.getFullYear()).slice(2)}.pdf`, 96_000 + (seed % 40_000)) : null,
  };
}

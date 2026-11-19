/**
 * Projects (Training Partner portal): the project list, Add project (with the CRM opportunity look-up) and each
 * program's workspace. Import from '@/services/api', which re-exports everything.
 *
 * The projects are the same ones the client page shows (clientsApi's projectsFor — same ids, names and dates), filled
 * out with what Projects needs: a PRJ code, an owner, cohorts, facilitators and each program's setup. Everything is
 * built relative to today (statuses, "needs action", due dates), so the demo always looks current.
 */
import * as demo from '@/data/demoData';
import { addDays, startOfDay } from '@/utils/formatDate';
import { clientStore, projectsFor } from './clientsApi';
import { modulesApi, programStore, programsApi } from './contentApi';
import { facilitatorStore } from './facilitatorsApi';
import { entityStore, subEntityStore } from './financeMastersApi';
import { mock } from './coreApi';

const DAY = 86400000;

/* --------------------------------------------------------------- Lookups */
/** The program catalogue for projects: [name, program type] */
const PROGRAM_CATALOG = [
  ['Authentic Executive Presence – Speaker Series', 'Coaching'],
  ['Coaching Essentials for Managers', 'ICF Program'],
  ['Situational Leadership® II', 'Standard Program'],
  ['Crucial Conversations® for Mastering Dialogue', 'Standard Program'],
  ['First-Time Manager Program', 'Standard Program'],
  ['Women in Leadership Journey', 'Coaching'],
  ['Building Trust', 'Standard Program'],
  ['Leading Through Change', 'Standard Program'],
  ['Leadership Assessment Center', 'Assessment Center'],
  ['Customer Service Excellence', 'Standard Program'],
];
export const PROGRAM_TYPES = ['Standard Program', 'Coaching', 'ICF Program', 'Assessment Center'];
const TYPE_OF = Object.fromEntries(PROGRAM_CATALOG);
const typeOf = (program) => TYPE_OF[program] ?? 'Standard Program';
/** Who delivers programs: these sub-entities (names as in the Sub-entity master), each with its legal entity */
const DELIVERY_UNITS = ['Blanchard', 'Crucial Learning', 'BYLD Learning'];
const OWNERS = ['Atul Kumar', 'Neha Verma', 'Rohan Kapoor', 'Priya Sharma', 'Vikram Rao'];
const BD_OWNERS = ['Karan Mehta', 'Rahul Bansal', 'Imran Shaikh', 'Sneha Gupta'];
const CONTACT_NAMES = ['Karan Sethi', 'Meera Iyer', 'Ritu Malhotra', 'Arjun Nair', 'Pooja Bansal', 'Sameer Joshi', 'Kavita Menon'];
export const SETUP_ITEMS = [
  ['facilitator', 'Facilitator assigned'],
  ['content', 'Content mapped'],
  ['participants', 'Participants enrolled'],
  ['logistics', 'Venue / joining link'],
];

function deliveredBy() {
  return DELIVERY_UNITS.map((name) => {
    const sub = subEntityStore.find((s) => s.name === name);
    const entity = entityStore.find((e) => e.id === sub?.entity);
    return { subEntity: name, entity: entity?.name ?? '' };
  });
}
const activeClients = () => clientStore.filter((c) => c.status === 'active').sort((a, b) => a.name.localeCompare(b.name));
const clientRef = (c) => ({ id: c.id, name: c.name, code: c.code, logo: c.logo ?? null });

/* --------------------------------------------------------------- Helpers */
const today = () => startOfDay(new Date());
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`;
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);
const hash = (str) => [...str].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 2147483647, 7) || 1;
/** Stable pseudo-random integers for a key: r(n) → 0…n-1 */
function rng(key) {
  let s = hash(key);
  return (n) => {
    s = (s * 48271) % 2147483647;
    return s % n;
  };
}
const statusOf = (start, end, t) => (end < t ? 'completed' : start > t ? 'upcoming' : 'in-progress');
const STAGE = { upcoming: 'in-setup', 'in-progress': 'live', completed: 'completed' };

/** A program with everything that depends on today filled in: status, readiness, needsAction */
function programView(pg, t = today()) {
  const status = statusOf(new Date(pg.start), new Date(pg.end), t);
  const done = pg.setup.filter((s) => s.done).length;
  const readiness = Math.round((done / 4) * 100);
  const needsAction = status === 'upcoming' && daysBetween(t, pg.start) <= 14 && done < 4;
  return { ...pg, status, readiness, needsAction };
}

/** A project with its programs (date order kept as stored) and the totals the list shows */
function projectView(p, t = today()) {
  const programs = p.programs.map((pg) => programView(pg, t));
  const start = new Date(Math.min(...programs.map((x) => new Date(x.start))));
  const end = new Date(Math.max(...programs.map((x) => new Date(x.end))));
  const status = statusOf(start, end, t);
  return {
    ...p,
    programs,
    start: iso(start),
    end: iso(end),
    status,
    stage: STAGE[status],
    participants: programs.reduce((n, x) => n + x.participants, 0),
    needsAction: programs.filter((x) => x.needsAction).length,
    readiness: Math.round(programs.reduce((n, x) => n + x.readiness, 0) / programs.length),
  };
}

/* --------------------------------------------------------------- The store */
let store = null;
const usedIds = new Set();
const usedCodes = new Set();
const activeFacilitators = () => facilitatorStore.filter((f) => f.status === 'active');

function newCode(r) {
  let code;
  do code = `PRJ-${1000 + r(9000)}`;
  while (usedCodes.has(code));
  usedCodes.add(code);
  return code;
}

/** One stored program, built from a client-page program (same dates, program and delivery) */
function seedProgram(projectId, base, i, r, t) {
  const start = new Date(base.start);
  const status = statusOf(start, new Date(base.end), t);
  // Running / delivered programs were fully set up; upcoming ones are part-way — more so as the start nears
  let done = 4;
  if (status === 'upcoming') done = daysBetween(t, start) <= 14 ? [1, 2, 3, 3, 4, 4][r(6)] : [0, 0, 1, 1, 2, 3, 4][r(7)];
  const order = SETUP_ITEMS.map(([key]) => key).sort(() => r(3) - 1);
  const isDone = (key) => order.indexOf(key) < done;
  const facs = activeFacilitators();
  const fac = isDone('facilitator') && facs.length ? facs[r(facs.length)] : null;
  return {
    id: `${projectId}-g${i + 1}`,
    oppId: base.oppId,
    program: base.program,
    type: typeOf(base.program),
    entity: base.entity,
    subEntity: base.subEntity,
    start: base.start,
    end: base.end,
    cohort: `Cohort ${String.fromCharCode(65 + i)}`,
    participants: isDone('participants') ? 8 + r(32) : 0,
    expected: null,
    facilitator: fac ? { id: fac.id, name: fac.name, photo: fac.photo } : null,
    setup: SETUP_ITEMS.map(([key, label]) => ({ key, label, done: isDone(key) })),
  };
}

function seedProject(client, base, t) {
  const r = rng(base.id);
  usedIds.add(base.id);
  const programs = base.programs.map((pg, i) => seedProgram(base.id, pg, i, r, t));
  const now = Date.now();
  // Set up a while back (a project starting soon was still set up before today); last touched a few hours to ~10 days
  // ago — never before it was created
  const created = Math.min(new Date(base.createdAt).getTime(), now - (30 + r(72)) * 3600000);
  const modifiedAt = new Date(Math.max(created, now - (1 + r(240)) * 3600000)).toISOString();
  return {
    id: base.id,
    code: newCode(r),
    name: base.name,
    projectType: programs[0].type,
    client: clientRef(client),
    owner: OWNERS[r(OWNERS.length)],
    createdAt: new Date(created).toISOString(),
    createdBy: base.createdBy,
    modifiedAt,
    modifiedBy: OWNERS[r(OWNERS.length)],
    programs,
  };
}

function ensure() {
  if (!store) {
    const t = today();
    store = clientStore.flatMap((c) => projectsFor(c).map((p) => seedProject(c, p, t)));
  }
  return store;
}

const byModified = (a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt);

/** Every project (with today's statuses), last updated first — synchronous, for the ⌘K search */
export function allProjects() {
  const t = today();
  return ensure().map((p) => projectView(p, t)).sort(byModified);
}

/** A CRM opportunity (mock: built from its number; ones ending in 0 aren't in the CRM) */
function opportunity(id) {
  const n = Number(id);
  const r = rng(`opp-${id}`);
  const clients = activeClients();
  const units = deliveredBy();
  const sample = id === '3664'; // the one used in the demo notes
  const client = (sample && clients.find((c) => c.name === 'Maruti Suzuki India Ltd')) || clients[n % clients.length];
  const [program, programType] = sample ? ['Customer Service Excellence', 'Standard Program'] : PROGRAM_CATALOG[n % PROGRAM_CATALOG.length];
  const unit = sample ? units.find((u) => u.subEntity === 'Crucial Learning') : units[r(units.length)];
  return {
    oppId: n,
    client: clientRef(client),
    projectName: demo.projectCatalog.names[n % demo.projectCatalog.names.length],
    projectType: programType,
    program,
    programType,
    entity: unit.entity,
    subEntity: unit.subEntity,
    start: iso(addDays(today(), sample ? 24 : 10 + r(50))),
    participants: sample ? 36 : 12 + r(30),
    dealValue: sample ? 750000 : (4 + r(30)) * 50000,
    bdOwner: sample ? 'Karan Mehta' : BD_OWNERS[r(BD_OWNERS.length)],
  };
}

export const projectsApi = {
  /** Every project, last updated first */
  list: () => mock(allProjects()),

  /** Same, without the wait */
  all: allProjects,

  /** Takes a project off the list (its programs go with it) */
  async archive(id) {
    const list = ensure();
    const i = list.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('This project no longer exists.');
    list.splice(i, 1);
    return mock(true, 600);
  },

  /** Choices for Add project: active clients, the program catalogue, who delivers */
  formLookups: () => ({
    clients: activeClients().map(clientRef),
    programs: PROGRAM_CATALOG.map(([name, type]) => ({ name, type })),
    programTypes: PROGRAM_TYPES,
    deliveredBy: deliveredBy(),
  }),

  /** Up to 6 programs this client has already run (started), newest first, each with its project's name */
  earlierPrograms(clientId) {
    const t = today();
    return ensure()
      .filter((p) => p.client.id === clientId)
      .flatMap((p) => p.programs.map((pg) => ({ ...programView(pg, t), projectId: p.id, projectName: p.name })))
      .filter((pg) => new Date(pg.start) <= t)
      .sort((a, b) => new Date(b.start) - new Date(a.start))
      .slice(0, 6);
  },

  /** Looks up a won opportunity in the CRM portal by its 4-digit number (about 900 ms) */
  async lookupOpportunity(id) {
    const digits = String(id).replace(/\D/g, '');
    if (!/^\d{4}$/.test(digits)) throw new Error('An opportunity ID has 4 digits, e.g. OPP-3664.');
    if (digits.endsWith('0')) {
      await mock(null, 900);
      const e = new Error(`OPP-${digits} isn’t in the CRM portal. Check the number, or start from scratch.`);
      e.code = 'not-found';
      throw e;
    }
    return mock(opportunity(digits), 900);
  },

  /**
   * Creates a project with its first program (two weeks long, nothing set up yet) and puts it at the top of the list.
   * form = { clientId, name, projectType, program, programType, entity, subEntity, start (Date), cohort, oppId?, participants? }
   */
  async create(form, userName) {
    const list = ensure();
    const client = clientStore.find((c) => c.id === form.clientId);
    if (!client) throw new Error('That client isn’t on file any more.');
    let n = list.filter((p) => p.client.id === client.id).length + 1;
    while (usedIds.has(`${client.id}-pr${n}`)) n++;
    const id = `${client.id}-pr${n}`;
    usedIds.add(id);
    const r = rng(`${id}-${Date.now()}`);
    const start = startOfDay(form.start);
    const now = new Date().toISOString();
    const project = {
      id,
      code: newCode(r),
      name: form.name.trim(),
      projectType: form.projectType,
      client: clientRef(client),
      owner: userName,
      createdAt: now,
      createdBy: userName,
      modifiedAt: now,
      modifiedBy: userName,
      programs: [
        {
          id: `${id}-g1`,
          oppId: form.oppId ? Number(form.oppId) : 1000 + r(9000),
          program: form.program,
          type: form.programType,
          entity: form.entity,
          subEntity: form.subEntity,
          start: iso(start),
          end: iso(addDays(start, 13)),
          cohort: form.cohort.trim(),
          participants: 0,
          expected: form.participants ?? null,
          facilitator: null,
          setup: SETUP_ITEMS.map(([key, label]) => ({ key, label, done: false })),
          copiedFrom: form.copyFrom ?? null,
        },
      ],
    };
    list.unshift(project);
    return mock(projectView(project), 800);
  },
};

/* --------------------------------------------------------------- Program workspace */
/** Chapters and their steps: [key, label, minutes, due (days from the start; After delivery: from the end)] */
export const CHAPTERS = [
  { key: 'foundation', label: 'Foundation', steps: [['basics', 'Program basics', 3, -30], ['contacts', 'Client contacts', 2, -28], ['agreement', 'Agreement and approval', 5, -21]] },
  { key: 'journey', label: 'Learning journey', steps: [['sessions', 'Sessions and schedule', 6, -21], ['content', 'Content and kits', 4, -14], ['assessments', 'Assessments and check-ins', 4, -10]] },
  { key: 'people', label: 'People', steps: [['facilitators', 'Facilitators', 3, -21], ['participants', 'Participants', 5, -10]] },
  { key: 'logistics', label: 'Logistics', steps: [['venue', 'Venue and room', 4, -14], ['travel', 'Trainer travel and stay', 5, -10], ['workbooks', 'Workbooks', 3, -7]] },
  { key: 'communication', label: 'Communication', steps: [['invites', 'Invites and reminders', 3, -7], ['feedback', 'Feedback and certificate', 3, -3]] },
  { key: 'golive', label: 'Go live', steps: [['readiness', 'Readiness check', 2, -1]] },
  { key: 'after', label: 'After delivery', steps: [['debrief', 'Attendance and debrief', 5, 3]] },
];
const LOGISTICS = ['venue', 'travel', 'workbooks'];
const short = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

// Each program's workspace data, seeded the first time it's opened, then edited in place
const workspaces = new Map();

function seedWorkspace(project, pg, modules, library) {
  const r = rng(`ws-${pg.id}`);
  const t = today();
  const start = new Date(pg.start);
  const end = new Date(pg.end);
  const setup = Object.fromEntries(pg.setup.map((s) => [s.key, s.done]));
  const upcoming = pg.status === 'upcoming';

  // Agreement: delivered / running ones are approved; upcoming ones anywhere from "no PO yet" to approved
  const v = upcoming && !setup.logistics ? r(10) : 9;
  const stage = v < 2 ? 'none' : v === 2 ? 'sent-back' : v < 5 ? 'audit-waiting' : 'approved';
  const lastDay = stage === 'sent-back' ? addDays(end, -3) : addDays(end, 10);
  const ago = (d) => addDays(t, -d).toISOString();
  const approvals = [
    { name: 'Neeraj Gupta', role: 'Finance', status: stage === 'none' ? 'waiting' : 'approved', at: stage === 'none' ? null : ago(2 + r(6)) },
    { name: 'Kavita Rao', role: 'Audit', status: stage === 'approved' ? 'approved' : stage === 'sent-back' ? 'sent-back' : 'waiting', at: stage === 'approved' || stage === 'sent-back' ? ago(r(3)) : null },
  ];

  // Contacts the CRM brought in (some programs have none yet)
  const count = upcoming ? r(4) : 1 + r(3);
  const domain = `${project.client.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ')[0] || 'client'}.com`;
  const { participantDepartments: departments, designations } = demo.clientLookups;
  const first = r(CONTACT_NAMES.length);
  const contacts = Array.from({ length: count }, (_, i) => {
    const name = CONTACT_NAMES[(first + i) % CONTACT_NAMES.length];
    const [fn, ln] = name.toLowerCase().split(' ');
    return {
      id: `${pg.id}-c${i + 1}`,
      name,
      email: `${fn}.${ln}@${domain}`,
      mobile: `9${String(100000000 + r(899999999)).slice(0, 9)}`,
      department: r(4) ? departments[r(departments.length)] : null,
      designation: r(4) ? designations[r(designations.length)] : null,
      main: i === 0,
      source: 'crm',
    };
  });

  // The default learning journey
  const mod = (name) => modules.find((m) => m.name.toLowerCase() === name)?.id ?? modules[0]?.id ?? null;
  const duration = Math.max(1, daysBetween(start, end));
  const elementIds = (stageKey, k) => (setup.content || !upcoming ? (library?.stages[stageKey] ?? []).slice(0, k).map((e) => e.id) : []);
  const venueSet = setup.logistics || !upcoming;
  const journey = [
    { type: 'self', name: `Pre-work: ${pg.program} basics`, module: mod('pre'), date: addDays(start, -6), minutes: 60, items: elementIds('pre', 2) },
    {
      type: 'assessment',
      name: 'Behavioural assessment',
      module: mod('pre'),
      date: addDays(start, -3),
      minutes: 30,
      assessment: { name: 'Behavioural assessment', timeLimit: 30, passScore: 70, attempts: 2, reports: true, shuffle: true, showScore: true },
    },
    { type: 'inperson', name: 'Day 1: Foundations', module: mod('during'), date: start, time: '09:30', minutes: 360, venueSet, items: elementIds('during', 2), ekit: elementIds('during', 1) },
    {
      type: 'virtual',
      name: 'Practice lab',
      module: mod('during'),
      date: addDays(start, Math.round(duration * 0.4)),
      time: upcoming && !r(3) ? null : '10:00',
      minutes: 120,
      platform: 'Google Meet',
      link: upcoming && !setup.logistics ? null : `https://meet.learnnext.in/${pg.oppId}-${100 + r(900)}`,
      items: elementIds('during', 1),
      ekit: [],
    },
    ...(duration >= 5 && r(2) ? [{ type: 'inperson', name: 'Day 2: Putting it to work', module: mod('during'), date: addDays(start, Math.round(duration * 0.75)), time: '09:30', minutes: 360, venueSet, items: [], ekit: [] }] : []),
    { type: 'self', name: 'Reflection and action plan', module: mod('post'), date: addDays(end, 1), minutes: 60, items: elementIds('post', 1) },
    ...(r(2) ? [{ type: 'feedback', name: '360 feedback', module: mod('post'), date: addDays(end, 14), minutes: 20, closesAfter: 7 }] : []),
  ].map((s, k) => ({ items: [], ekit: [], time: null, ...s, id: `${pg.id}-j${k + 1}`, date: iso(s.date) }));

  return {
    flags: {
      basics: !upcoming || r(5) > 0,
      sessions: !upcoming || pg.readiness >= 50 || r(2) === 0,
      assessments: !upcoming || r(3) === 0,
      travel: !upcoming || r(2) === 0,
      workbooks: !upcoming || r(2) === 0,
      invites: !upcoming || r(3) === 0,
      feedback: !upcoming || r(4) === 0,
    },
    goLiveLeft: 10 + r(6),
    basics: { seats: pg.participants || pg.expected || 20 + r(20), bdOwner: BD_OWNERS[r(BD_OWNERS.length)], signOff: r(3) > 0, accessMonths: [3, 6, 12][r(3)] },
    contacts,
    agreement: {
      po: `PO-${project.client.code}-${pg.oppId}`,
      version: 1,
      file: stage === 'none' && r(2) ? null : { name: `${project.client.code}_PO_${pg.oppId}.pdf`, type: 'application/pdf', size: 312 * 1024, url: '/samples/sample-document.pdf' },
      validFrom: iso(addDays(start, -31)),
      validTo: iso(lastDay),
      approvals,
      comment: stage === 'sent-back' ? `The PO is valid till ${short(lastDay)}, but the last session is on ${short(end)}. Upload an extended PO or a validity extension letter.` : null,
    },
    journey,
  };
}

/** A step's state and note: done | todo | due | overdue | locked */
function stepState([key, , minutes, offset], chapterKey, pg, st, t) {
  const setup = Object.fromEntries(pg.setup.map((s) => [s.key, s.done]));
  const ag = st.agreement;
  const approved = ag.approvals.every((a) => a.status === 'approved');
  const dueDate = chapterKey === 'after' ? addDays(new Date(pg.end), offset) : addDays(new Date(pg.start), offset);
  const byDate = (todoNote) => {
    const d = daysBetween(t, dueDate);
    if (d < 0) return { state: 'overdue', note: `${-d} day${d === -1 ? '' : 's'} overdue`, due: iso(dueDate) };
    if (d <= 3) return { state: 'due', note: d === 0 ? 'Due today' : d === 1 ? 'Due tomorrow' : `Due ${short(dueDate)}`, due: iso(dueDate) };
    return { state: 'todo', note: todoNote ?? `About ${minutes} min`, due: iso(dueDate) };
  };
  const done = { state: 'done', note: 'Done', due: iso(dueDate) };

  if (key === 'debrief') {
    if (pg.status === 'upcoming') return { state: 'locked', note: 'Opens after launch', due: iso(dueDate) };
    if (pg.status === 'completed' && daysBetween(dueDate, t) > 7) return done;
    return byDate();
  }
  if (pg.status !== 'upcoming') return done;
  if (key === 'agreement') {
    if (approved) return done;
    const back = ag.approvals.find((a) => a.status === 'sent-back');
    if (back) return { state: 'overdue', note: `Sent back by ${back.role}`, due: iso(dueDate) };
    if (ag.file) return { state: 'due', note: 'Waiting for approval', due: iso(dueDate) };
    return { state: 'todo', note: 'PO not uploaded', due: iso(dueDate) };
  }
  if (LOGISTICS.includes(key) && !approved) return { state: 'locked', note: 'Unlocks after agreement approval', due: iso(dueDate) };
  const isDone = {
    basics: st.flags.basics,
    contacts: st.contacts.length > 0,
    sessions: st.flags.sessions,
    content: setup.content,
    assessments: st.flags.assessments,
    facilitators: setup.facilitator,
    participants: setup.participants,
    venue: setup.logistics,
    travel: st.flags.travel,
    workbooks: st.flags.workbooks,
    invites: st.flags.invites,
    feedback: st.flags.feedback,
    readiness: false,
  }[key];
  if (isDone) return done;
  return byDate(key === 'readiness' ? `${st.goLiveLeft} items left` : undefined);
}

function compose(project, pg, st, modules, library) {
  const t = today();
  const start = new Date(pg.start);
  const end = new Date(pg.end);
  const chapters = CHAPTERS.map((c) => ({
    key: c.key,
    label: c.label,
    steps: c.steps.map((s) => ({ key: s[0], label: s[1], minutes: s[2], ...stepState(s, c.key, pg, st, t) })),
  }));
  const counted = chapters.filter((c) => c.key !== 'golive' && c.key !== 'after').flatMap((c) => c.steps);
  const doneCount = counted.filter((s) => s.state === 'done').length;
  const open = chapters.filter((c) => c.key !== 'after').flatMap((c) => c.steps.map((s) => ({ ...s, chapter: { key: c.key, label: c.label } })));
  const next = open.find((s) => s.state === 'overdue') ?? open.find((s) => s.state === 'due') ?? open.find((s) => s.state === 'todo') ?? null;
  const duration = Math.max(1, daysBetween(start, end));
  const timeline = [
    { label: 'Welcome emails go out', date: addDays(start, -5) },
    { label: 'Pre-work opens', date: addDays(start, -3) },
    { label: 'Day 1', date: start, key: true },
    { label: 'Practice lab', date: addDays(start, Math.round(duration * 0.4)) },
    { label: 'Reflection and action plan', date: addDays(start, Math.round(duration * 0.75)) },
    { label: 'Certificates and debrief', date: addDays(end, 1) },
  ].map((x) => ({ ...x, date: iso(x.date), past: x.date < t }));
  const main = st.contacts.find((c) => c.main);

  return structuredClone({
    project: { id: project.id, name: project.name, code: project.code, client: project.client, projectType: project.projectType },
    program: pg,
    chapters,
    progress: { done: doneCount, total: counted.length, pct: Math.round((doneCount / counted.length) * 100) },
    next,
    timeline,
    modules,
    library,
    journey: [...st.journey].sort((a, b) => new Date(a.date) - new Date(b.date) || (a.time ?? '').localeCompare(b.time ?? '')),
    basics: { ...st.basics, spoc: main?.name ?? null },
    contacts: st.contacts,
    agreement: st.agreement,
  });
}

/** The project + program for a workspace call (null if either is gone) */
function find(projectId, programId) {
  const project = ensure().find((p) => p.id === projectId);
  const raw = project?.programs.find((x) => x.id === programId);
  return raw ? { project: projectView(project), pg: programView(raw) } : null;
}

async function load(projectId, programId) {
  const found = find(projectId, programId);
  if (!found) return mock(null, 300);
  const { project, pg } = found;
  const content = programStore.find((p) => p.name === pg.program);
  const [allModules, stages] = await Promise.all([modulesApi.list(), content ? programsApi.content(content.id) : Promise.resolve(null)]);
  const modules = allModules.filter((m) => m.enabled).map((m) => ({ id: m.id, name: m.name }));
  const library = content ? { programId: content.id, programName: content.name, stages: { pre: stages.pre ?? [], during: stages.during ?? [], post: stages.post ?? [] } } : null;
  if (!workspaces.has(pg.id)) workspaces.set(pg.id, seedWorkspace(project, pg, modules, library));
  return compose(project, pg, workspaces.get(pg.id), modules, library);
}

const stateOf = (programId) => {
  const st = workspaces.get(programId);
  if (!st) throw new Error('This program is no longer available.');
  return st;
};

export const programWorkspaceApi = {
  /** Everything a program's workspace page shows (null if the project or program is gone) */
  get: load,

  /** Adds a client contact (no id) or saves one; the first contact, or one ticked as main, is the only main contact */
  async saveContact(projectId, programId, contact) {
    const st = stateOf(programId);
    const clean = { ...contact, name: contact.name.trim(), email: contact.email.trim(), department: contact.department || null, designation: contact.designation || null };
    const main = clean.main || st.contacts.length === 0 || (contact.id && st.contacts.find((c) => c.id === contact.id)?.main);
    if (main) st.contacts.forEach((c) => (c.main = false));
    if (contact.id) {
      const c = st.contacts.find((x) => x.id === contact.id);
      if (!c) throw new Error('This contact no longer exists.');
      Object.assign(c, clean, { main: Boolean(main) });
    } else {
      st.contacts.push({ ...clean, id: `${programId}-c${Date.now().toString(36)}`, main: Boolean(main), source: 'you' });
    }
    return load(projectId, programId);
  },

  /** A new PO version: both approvals start over */
  async uploadPo(projectId, programId, file) {
    const st = stateOf(programId);
    const ag = st.agreement;
    ag.version += 1;
    ag.file = file;
    ag.comment = null;
    ag.approvals = ag.approvals.map((a) => ({ ...a, status: 'waiting', at: new Date().toISOString() }));
    return load(projectId, programId);
  },

  /** Adds (no id) or saves a learning-journey step */
  async saveJourneyStep(projectId, programId, step) {
    const st = stateOf(programId);
    const clean = { ...step, date: iso(startOfDay(step.date)) };
    if (step.id) {
      const i = st.journey.findIndex((s) => s.id === step.id);
      if (i < 0) throw new Error('This step no longer exists.');
      st.journey[i] = { ...st.journey[i], ...clean };
    } else {
      st.journey.push({ items: [], ekit: [], ...clean, id: `${programId}-j${Date.now().toString(36)}` });
    }
    return load(projectId, programId);
  },

  async removeJourneyStep(projectId, programId, stepId) {
    const st = stateOf(programId);
    st.journey = st.journey.filter((s) => s.id !== stepId);
    return load(projectId, programId);
  },

  /** Which Manage Content elements a journey step gives to participants (items) and puts in the trainer e-kit */
  async saveStepContent(projectId, programId, stepId, { items, ekit }) {
    const st = stateOf(programId);
    const s = st.journey.find((x) => x.id === stepId);
    if (!s) throw new Error('This step no longer exists.');
    Object.assign(s, { items: [...items], ekit: [...ekit] });
    return load(projectId, programId);
  },
};

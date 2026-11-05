/** Settings → Others: Menu Mapping & Access and Roles & Access. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import { uid } from '@/utils/helpers';
import { sameName } from './contentApi';
import { mock } from './coreApi';

/* --------------------------------------------------------------- Menu Mapping & Access master */
// LearnNext admin's own menu (as in the sidebar, src/config/navigation.js), Finance with its sub-pages:
// [id, name, parent, page name, url, icon, priority]
const MENU_SEED = [
  ['m-1', 'Dashboard', null, 'Dashboard', '/dashboard', 'LayoutDashboard', 1],
  ['m-2', 'All Clients', null, 'All Clients', '/clients', 'Building2', 2],
  ['m-3', 'Projects', null, 'Projects', '/projects', 'FolderKanban', 3],
  ['m-4', 'Finance', null, 'Finance', '/finance', 'Wallet', 4],
  ['m-5', 'All Invoices', 'm-4', 'All Invoices', '/finance/invoices', 'Receipt', 1],
  ['m-6', 'Credit Note', 'm-4', 'Credit Note', '/finance/credit-notes', 'FileMinus', 2],
  ['m-7', 'Debit Note', 'm-4', 'Debit Note', '/finance/debit-notes', 'FilePlus', 3],
  ['m-8', 'E-Invoice', 'm-4', 'E-Invoice', '/finance/e-invoice', 'ReceiptText', 4],
  ['m-9', 'Trainer Invoice', 'm-4', 'Trainer Invoice', '/finance/trainer-invoices', 'UserCheck', 5],
  ['m-10', 'Invoice Approvals', 'm-4', 'Invoice Approvals', '/finance/invoice-approvals', 'FileCheck', 6],
  ['m-11', 'Manage Content', null, 'Manage Content', '/content', 'Library', 5],
  ['m-12', 'Facilitators', null, 'Facilitators', '/facilitators', 'Users', 6],
  ['m-13', 'Assessments', null, 'Assessments', '/assessments', 'ClipboardList', 7],
  ['m-14', 'Polls & Surveys', null, 'Polls & Surveys', '/polls-surveys', 'Vote', 8],
  ['m-15', 'Settings', null, 'Settings', '/settings', 'Settings', 9],
  ['m-16', 'Reports', null, 'Reports', '/reports', 'ChartColumn', 10],
  ['m-17', 'Support desk', null, 'Support desk', '/support', 'Headset', 11],
];
const menuStore = MENU_SEED.map(([id, name, parent, pageName, url, icon, priority], i) => ({
  id,
  module: 'Training Partner',
  name,
  parent,
  pageName,
  url,
  icon,
  priority,
  createdBy: i % 3 === 1 ? 'Priya Sharma' : 'Atul Kumar',
  createdAt: new Date(Date.now() - (400 - i * 30) * 864e5).toISOString(),
}));
const siblingsOf = (parent, exceptId) => menuStore.filter((m) => (m.parent ?? null) === (parent ?? null) && m.id !== exceptId).sort((a, b) => a.priority - b.priority);
/** Put `item` at `priority` among its siblings and renumber them 1…n (no gaps, no ties) */
const placeMenu = (item, priority) => {
  const list = siblingsOf(item.parent, item.id);
  list.splice(Math.max(0, Math.min(priority - 1, list.length)), 0, item);
  list.forEach((m, i) => {
    m.priority = i + 1;
  });
};
const cleanUrl = (url) => '/' + url.trim().replace(/^\/+/, '').replace(/\s+/g, '');

export const menusApi = {
  /** Modules a menu can belong to — only the admin portal for now */
  modules: () => ['Training Partner'],

  /** Every menu (flat; the page arranges the tree) */
  list: () => mock(menuStore),

  /** Siblings under a parent (null = top level), in priority order — for the priority picker and the preview */
  siblings: (parent, exceptId) => structuredClone(siblingsOf(parent, exceptId)),

  /** Names are unique among siblings (any case) */
  nameTaken: (name, parent, exceptId) => siblingsOf(parent, exceptId).some((m) => sameName(m.name, name)),

  /** Page URLs are unique across all menus */
  urlTaken: (url, exceptId) => menuStore.some((m) => m.id !== exceptId && m.url.toLowerCase() === cleanUrl(url).toLowerCase()),

  async create(form, createdBy) {
    if (menusApi.nameTaken(form.name, form.parent)) throw new Error('There is already a menu with this name here.');
    const item = { id: uid('m'), module: form.module, name: form.name.trim(), parent: form.parent || null, pageName: form.pageName.trim(), url: cleanUrl(form.url), icon: form.icon || null, priority: 0, createdBy, createdAt: new Date().toISOString() };
    menuStore.push(item);
    placeMenu(item, form.priority);
    return mock(item, 500);
  },

  async update(id, form) {
    const item = menuStore.find((m) => m.id === id);
    if (!item) throw new Error('This menu no longer exists.');
    if (menusApi.nameTaken(form.name, form.parent, id)) throw new Error('There is already a menu with this name here.');
    const oldParent = item.parent;
    Object.assign(item, { module: form.module, name: form.name.trim(), parent: form.parent || null, pageName: form.pageName.trim(), url: cleanUrl(form.url), icon: form.icon || null });
    placeMenu(item, form.priority);
    // Moving out of a parent closes the gap it left
    if (oldParent !== item.parent) siblingsOf(oldParent).forEach((m, i) => (m.priority = i + 1));
    return mock(item, 500);
  },

  /** Not while it has sub-menus */
  async remove(id) {
    const children = menuStore.filter((m) => m.parent === id).length;
    if (children) throw new Error(`It has ${children} sub-${children === 1 ? 'menu' : 'menus'} — move or delete ${children === 1 ? 'it' : 'them'} first.`);
    const i = menuStore.findIndex((m) => m.id === id);
    if (i < 0) return mock(true, 300);
    const [gone] = menuStore.splice(i, 1);
    siblingsOf(gone.parent).forEach((m, n) => (m.priority = n + 1));
    return mock(true, 400);
  },
};

/* --------------------------------------------------------------- Roles & Access */
// What a role can do on a page; each page offers only the actions that make sense for it (by URL; the rest get CRUD + export)
export const ACCESS_ACTIONS = ['view', 'add', 'edit', 'delete', 'export', 'approve'];
const CRUD = ['view', 'add', 'edit', 'delete', 'export'];
const PAGE_ACTIONS = {
  '/dashboard': ['view', 'export'],
  '/reports': ['view', 'export'],
  '/settings': ['view', 'add', 'edit', 'delete'],
  '/support': ['view', 'edit', 'export'],
  '/finance/invoice-approvals': ['view', 'approve', 'export'],
  '/finance/trainer-invoices': [...CRUD, 'approve'],
  '/facilitators': [...CRUD, 'approve'],
};
/** The actions a menu offers ([] for a parent that only groups sub-menus) */
export const menuActions = (menu, hasChildren) => (hasChildren ? [] : (PAGE_ACTIONS[menu.url] ?? CRUD));

const isPage = (m) => !menuStore.some((k) => k.parent === m.id);
const menuByUrl = (url) => menuStore.find((m) => m.url === url)?.id;
/** Seed access as { url: actions } → { menuId: actions } */
const grant = (byUrl) => Object.fromEntries(Object.entries(byUrl).map(([url, acts]) => [menuByUrl(url), acts]).filter(([id]) => id));
// The admins who have each role (name + portrait) — the roles list shows their faces
const face = (id) => `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&q=80`;
const ROLE_PEOPLE = {
  'role-super': [['Atul Kumar', '1633332755192-727a05c4013d'], ['Priya Sharma', '1494790108377-be9c29b29330']],
  'role-admin': [['Rohan Kapoor', '1500648767791-00dcc994a43e'], ['Neha Gupta', '1438761681033-6461ffad8d80'], ['Arjun Mehta', '1506794778202-cad84cf45f1d'], ['Sana Sheikh', '1544005313-94ddf0286df2']],
  'role-finance': [['Vikram Rao', '1472099645785-5658abf4ff4e'], ['Pooja Iyer', '1534528741775-53994a69daeb'], ['Manish Jain', '1539571696357-5a69c17a67c6']],
  'role-program': [['Kavya Nair', '1573496359142-b8d87734a5a2'], ['Rahul Verma', '1570295999919-56ceb5ecca61'], ['Ananya Das', '1580489944761-15a19d654956'], ['Siddharth Bose', '1557862921-37829c790f19'], ['Meera Pillai', '1487412720507-e7ab37603c6f']],
  'role-support': [['Farhan Ali', '1560250097-0b93528c311a'], ['Ritu Singh', '1517841905240-472988babdf9'], ['Deepak Yadav', '1564564321837-a57b7070ac4f'], ['Isha Kapoor', '1529626455594-4ff0802cfb7e'], ['Nikhil Joshi', '1618077360395-f3068be8e001'], ['Tanvi Shah', '1508214751196-bcfd4ca60f91']],
};
const FINANCE_PAGES = ['/finance/invoices', '/finance/credit-notes', '/finance/debit-notes', '/finance/e-invoice', '/finance/trainer-invoices', '/finance/invoice-approvals'];
const roleStore = [
  { id: 'role-super', name: 'Super Admin', description: 'Everything, always', tone: 'primary', members: 2, locked: true, access: {} },
  {
    id: 'role-admin',
    name: 'Training Partner',
    description: 'Runs day-to-day operations',
    tone: 'rose',
    members: 4,
    // Every page (a parent like Finance just groups its sub-pages); not approving or deleting finance records
    access: Object.fromEntries(
      menuStore.filter(isPage).map((m) => [m.id, menuActions(m, false).filter((a) => a !== 'approve' && !(a === 'delete' && FINANCE_PAGES.includes(m.url)))]),
    ),
  },
  {
    id: 'role-finance',
    name: 'Finance Manager',
    description: 'Invoices, notes and approvals',
    tone: 'success',
    members: 3,
    access: grant({
      '/dashboard': ['view', 'export'],
      '/clients': ['view'],
      ...Object.fromEntries(FINANCE_PAGES.map((u) => [u, PAGE_ACTIONS[u] ?? CRUD])),
      '/finance/credit-notes': ['view', 'add', 'export'],
      '/finance/debit-notes': ['view', 'add', 'export'],
      '/reports': ['view', 'export'],
    }),
  },
  {
    id: 'role-program',
    name: 'Program Manager',
    description: 'Clients, projects and content',
    tone: 'violet',
    members: 5,
    access: grant({
      '/dashboard': ['view'],
      '/clients': ['view', 'add', 'edit', 'export'],
      '/projects': ['view', 'add', 'edit', 'export'],
      '/content': ['view', 'add', 'edit', 'export'],
      '/facilitators': ['view', 'add', 'edit', 'export'],
      '/assessments': ['view', 'add', 'edit', 'export'],
      '/polls-surveys': ['view', 'add', 'edit', 'export'],
      '/reports': ['view'],
    }),
  },
  {
    id: 'role-support',
    name: 'Support Executive',
    description: 'Answers support tickets',
    tone: 'warning',
    members: 6,
    access: grant({ '/dashboard': ['view'], '/clients': ['view'], '/facilitators': ['view'], '/support': ['view', 'edit'] }),
  },
];
/** Super Admin = every action on every page, computed so new menus are included */
const fullAccess = () => Object.fromEntries(menuStore.filter(isPage).map((m) => [m.id, menuActions(m, false)]));
const roleView = (r) => {
  const access = r.locked ? fullAccess() : r.access;
  const people = (ROLE_PEOPLE[r.id] ?? []).map(([name, id]) => ({ name, photo: face(id) }));
  return { ...structuredClone(r), people, members: people.length, access: structuredClone(access), menus: Object.values(access).filter((a) => a.includes('view')).length };
};

export const rolesAccessApi = {
  /** The admin roles, each with its access ({ menuId: actions }) and how many pages it can open */
  list: () => mock(roleStore.map(roleView)),

  /** Save a role's access (Super Admin can't change) */
  async save(id, access) {
    const r = roleStore.find((x) => x.id === id);
    if (!r) throw new Error('This role no longer exists.');
    if (r.locked) throw new Error('Super Admin always has full access.');
    r.access = Object.fromEntries(Object.entries(structuredClone(access)).filter(([, acts]) => acts.length));
    return mock(roleView(r), 500);
  },
};

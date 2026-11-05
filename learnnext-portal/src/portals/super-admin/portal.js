/**
 * The Super Admin portal, as the app's shell sees it (read through usePortal): just Manage Clients (+ My Profile from
 * the user menu) — its own menu, phone tab, page names and ⌘K search (its clients = training partners). No
 * notifications, no sidebar footer card, no extra "More" tiles.
 */
import { Building2 } from 'lucide-react';
import { partnersApi } from '@/services/api';

const MENU = [{ label: 'Manage Clients', to: '/clients', icon: Building2 }];

/** Breadcrumb / tab-title names for Super Admin's pages */
function routeMeta(pathname) {
  const inClients = { section: 'Manage Clients', sectionTo: '/clients' };
  if (pathname === '/clients') return { title: 'Manage Clients', icon: Building2 };
  if (pathname === '/clients/new') return { title: 'Add client', ...inClients };
  if (/^\/clients\/[^/]+\/edit$/.test(pathname)) return { title: 'Edit client', ...inClients };
  if (/^\/clients\/[^/]+$/.test(pathname)) return { title: 'Client details', ...inClients };
  if (pathname === '/profile') return { title: 'My Profile' };
  return undefined;
}

const PAGES = [
  { id: '/clients', label: 'Manage Clients', to: '/clients', section: null },
  { id: '/clients/new', label: 'Add client', to: '/clients/new', section: 'Manage Clients' },
  { id: '/profile', label: 'My Profile', to: '/profile', section: 'Account' },
];

const searchSources = [
  {
    key: 'pages',
    label: 'Pages',
    icon: 'pages',
    fields: ['label', 'section'],
    items: () => PAGES,
    toResult: (p) => ({ id: p.id, title: p.label, subtitle: p.section ?? 'Page', to: p.to }),
  },
  {
    key: 'clients',
    label: 'Clients',
    icon: 'clients',
    fields: ['name', 'code', 'mobile', 'city', 'contactName'],
    items: () => partnersApi.all(),
    toResult: (p) => ({ id: p.id, title: p.name, subtitle: [p.code, p.city, p.contactName].filter(Boolean).join(' · '), to: `/clients/${p.id}` }),
  },
];

export const superAdminPortal = {
  nav: MENU,
  links: MENU,
  tabs: [{ label: 'Clients', to: '/clients', icon: Building2 }],
  routeMeta,
  notifications: false,
  searchSources,
  SidebarFooter: null,
  useMoreItems: () => [],
};

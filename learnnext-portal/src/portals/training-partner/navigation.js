/**
 * Single source of truth for the admin navigation.
 *
 * - Sidebar and mobile drawer render NAV_ITEMS (an item with `children` becomes a collapsible submenu).
 * - Breadcrumbs, document titles and placeholder pages use ROUTE_META.
 * - Routes for items without a real page are generated from NAV_PATHS (see src/routes/AppRoutes.jsx).
 * To add a page: create it in src/pages, register the route in src/routes/AppRoutes.jsx, then add an item here.
 */
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Wallet,
  Receipt,
  FileMinus,
  FilePlus,
  ReceiptText,
  UserCheck,
  FileCheck,
  Library,
  Users,
  ClipboardList,
  Vote,
  Settings,
  ChartColumn,
  LayoutTemplate,
} from 'lucide-react';
import { MASTERS } from '@/portals/training-partner/settings/settingsMasters';

export const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'All Clients', to: '/clients', icon: Building2 },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  {
    label: 'Finance',
    icon: Wallet,
    children: [
      { label: 'All Invoices', to: '/finance/invoices', icon: Receipt },
      { label: 'Credit Note', to: '/finance/credit-notes', icon: FileMinus },
      { label: 'Debit Note', to: '/finance/debit-notes', icon: FilePlus },
      { label: 'E-Invoice', to: '/finance/e-invoice', icon: ReceiptText },
      { label: 'Trainer Invoice', to: '/finance/trainer-invoices', icon: UserCheck },
      { label: 'Invoice Approvals', to: '/finance/invoice-approvals', icon: FileCheck },
    ],
  },
  { label: 'Manage Content', to: '/content', icon: Library },
  { label: 'Facilitators', to: '/facilitators', icon: Users },
  { label: 'Assessments', to: '/assessments', icon: ClipboardList },
  { label: 'Polls & Surveys', to: '/polls-surveys', icon: Vote },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Reports', to: '/reports', icon: ChartColumn },
  // Gallery of the full-screen system pages (404, crash, 500, 503, offline, session expired). `devOnly`: a development
  // aid for viewing those pages, not an admin feature — the sidebar shows it apart, under a quiet "Dev only" label
  { label: 'System pages', to: '/ui-preview', icon: LayoutTemplate, devOnly: true },
  // Help & Support and Logout live in the sidebar footer (see Sidebar.jsx)
];

/** Every navigable leaf item (submenu children included), in menu order — used by search and routing. */
export const NAV_LINKS = NAV_ITEMS.flatMap((item) => (item.children ? item.children : [item]));

/** All nav paths. */
export const NAV_PATHS = NAV_LINKS.map((item) => item.to);

/**
 * path -> { title, section, sectionTo, icon } used for breadcrumbs, <title> and placeholder pages. `section` is the
 * parent (if any) and `sectionTo` where its breadcrumb links — pages with unsaved changes can intercept that (leaveGuard).
 */
export const ROUTE_META = NAV_ITEMS.reduce((acc, item) => {
  if (item.children) {
    item.children.forEach((child) => {
      // The group has no page of its own — its crumb opens the group's first page
      acc[child.to] = { title: child.label, section: item.label, sectionTo: item.children[0].to, icon: child.icon };
    });
  } else {
    acc[item.to] = { title: item.label, icon: item.icon };
  }
  return acc;
}, {
  // Reached from the user menu, not the sidebar
  '/profile': { title: 'My Profile' },
  // Reached from the All Clients page
  '/clients/new': { title: 'Add client', section: 'All Clients', sectionTo: '/clients' },
  // Reached from the Support desk card in the sidebar footer
  '/support': { title: 'Support desk' },
});

/** ROUTE_META for a pathname, including pages with an id in the path (e.g. /clients/cl-4/edit) */
export function getRouteMeta(pathname) {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  if (/^\/clients\/[^/]+\/edit$/.test(pathname)) return { title: 'Edit client', section: 'All Clients', sectionTo: '/clients' };
  if (/^\/clients\/[^/]+$/.test(pathname)) return { title: 'Client details', section: 'All Clients', sectionTo: '/clients' };
  // Verifying a facilitator's submitted KYC, opened from Approval pending
  if (/^\/facilitators\/[^/]+\/verify$/.test(pathname)) return { title: 'Verify KYC', section: 'Facilitators', sectionTo: '/facilitators' };
  // An active facilitator's profile, opened from the list
  if (/^\/facilitators\/[^/]+$/.test(pathname)) return { title: 'Facilitator details', section: 'Facilitators', sectionTo: '/facilitators' };
  // A program's content page, opened by Add content
  if (/^\/content\/[^/]+$/.test(pathname)) return { title: 'Program content', section: 'Manage Content', sectionTo: '/content' };
  // A master under Settings, e.g. /settings/sap-bp → "SAP BP" (its real name; the slug only as a fallback)
  const master = pathname.match(/^\/settings\/([^/]+)$/);
  if (master) {
    const slug = master[1];
    const title = MASTERS[slug]?.item.label ?? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    return { title, section: 'Settings', sectionTo: '/settings' };
  }
  return undefined;
}

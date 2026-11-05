/**
 * What the ⌘K search looks through in the Training Partner portal (passed to searchAll by GlobalSearch via the
 * portal definition). To make a module searchable, add an entry here — GlobalSearch renders groups automatically.
 * `fields` are searched (any of them may match); `toResult` = { id, title, subtitle, to } — `to` is where picking it
 * goes (a page, or a page that opens the record: /support?ticket=…, /facilitators?q=…).
 */
import { clientStore } from '@/services/clientsApi';
import { entityName, programStore } from '@/services/contentApi';
import { facilitatorStore } from '@/services/facilitatorsApi';
import { NAV_LINKS } from './navigation';
import { getTickets } from './support/supportStore';
import { MASTERS, SEARCH_KEYWORDS } from './settings/settingsMasters';

// Every place the search can jump to: the sidebar pages plus the ones reached from elsewhere
const SEARCH_PAGES = [
  ...NAV_LINKS.map((l) => ({ id: l.to, label: l.label, to: l.to, section: l.to.startsWith('/finance') ? 'Finance' : null })),
  { id: '/profile', label: 'My Profile', to: '/profile', section: 'Account' },
  { id: '/support', label: 'Support desk', to: '/support', section: null },
  { id: '/clients/new', label: 'Add client', to: '/clients/new', section: 'All Clients' },
];
const facilitatorStage = (f) => (f.status === 'kyc' && f.kycSubmittedAt ? 'review' : f.status);
const FAC_STAGE_LABEL = { kyc: 'KYC pending', review: 'Approval pending', payment: 'Payment setup pending', active: 'Active', expired: 'Agreement expired' };

export const searchSources = [
  {
    key: 'pages',
    label: 'Pages',
    icon: 'pages',
    fields: ['label', 'section'],
    items: () => SEARCH_PAGES,
    toResult: (p) => ({ id: p.id, title: p.label, subtitle: p.section ?? 'Page', to: p.to }),
  },
  {
    key: 'clients',
    label: 'Clients',
    icon: 'clients',
    fields: ['name', 'code', 'mobile', 'email', 'city', 'industry'],
    items: () => clientStore,
    toResult: (c) => ({ id: c.id, title: c.name, subtitle: [c.code, c.industry, c.city].filter(Boolean).join(' · '), to: `/clients/${c.id}` }),
  },
  {
    key: 'programs',
    label: 'Programs',
    icon: 'programs',
    fields: ['name', 'category'],
    items: () => programStore,
    toResult: (p) => ({ id: p.id, title: p.name, subtitle: `${p.category} · ${entityName(p.entity)}`, to: `/content/${p.id}` }),
  },
  {
    key: 'facilitators',
    label: 'Facilitators',
    icon: 'facilitators',
    fields: ['name', 'email', 'mobile', 'city'],
    items: () => facilitatorStore.map((f) => ({ ...f, city: f.address?.city })),
    // A submitted KYC opens straight on its Verify page; anyone else opens the list searched to them
    toResult: (f) => ({
      id: f.id,
      title: f.name,
      subtitle: [FAC_STAGE_LABEL[facilitatorStage(f)], f.email].filter(Boolean).join(' · '),
      to: facilitatorStage(f) === 'review' ? `/facilitators/${f.id}/verify` : `/facilitators?q=${encodeURIComponent(f.email)}`,
    }),
  },
  {
    key: 'tickets',
    label: 'Support tickets',
    icon: 'tickets',
    fields: ['number', 'subject', 'name', 'email', 'org', 'category', 'subCategory'],
    items: () => getTickets(),
    toResult: (t) => ({ id: t.id, title: t.subject, subtitle: `${t.number} · ${t.name} · ${t.status === 'closed' ? 'Closed' : 'Open'}`, to: `/support?ticket=${t.id}` }),
  },
  {
    key: 'masters',
    label: 'Settings',
    icon: 'masters',
    fields: ['label', 'description', 'group', 'keywords'],
    items: () => Object.entries(MASTERS).map(([slug, { item, group }]) => ({ slug, label: item.label, description: item.description, group: group.title, keywords: SEARCH_KEYWORDS[slug] ?? '' })),
    toResult: (m) => ({ id: m.slug, title: m.label, subtitle: `${m.group} · ${m.description}`, to: `/settings/${m.slug}` }),
  },
];

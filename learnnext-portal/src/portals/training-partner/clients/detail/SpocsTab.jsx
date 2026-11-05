import { useMemo, useState } from 'react';
import { ArrowRight, Building, Check, Search, Clock, Eye, EyeOff, FolderKanban, Grid3x3, List, Mail, MapPin, Pencil, Phone, ShieldCheck, UserCog, UserPlus, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { STORAGE_KEYS } from '@/config/app';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Avatar, Button, DataTable, Drawer, IconButton, Input, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { MobileNumber } from '@/shared/clients/components/clientColumns';
import { SpocFormModal, formatMobile } from './SpocFormModal';
import { TabHeader } from '@/shared/clients/detail/TabHeader';

const DETAIL_TITLE_ID = 'spoc-access-title';

// Project status as a small coloured dot + label under each column heading
const STATUS = {
  'in-progress': { dot: 'bg-primary', label: 'In progress' },
  upcoming: { dot: 'bg-info', label: 'Upcoming' },
  completed: { dot: 'bg-success', label: 'Completed' },
};

/**
 * SPOCs & Project Access. "Add SPOC" in the header and an edit pencil on each SPOC open SpocFormModal (details + which
 * projects they can see). Two views (switch in the header, remembered): a list like Participants, or
 * an access matrix: the client's SPOCs down the side (avatar, name, department, email),
 * its projects across the top (name with a status dot; status and dates on hover), and a check wherever a SPOC can see that project — neighbouring checks join into a
 * soft green "access lane", so who-sees-what reads at a glance. The last column sums it up ("All projects" / "2 of 4" with a small bar). The SPOC
 * column (and from tablet up the Access column) stays pinned while the projects scroll sideways.
 */
export function SpocsTab({ clientId, spocs, projects, onChanged }) {
  const [view, setView] = useLocalStorage(STORAGE_KEYS.spocsView, 'matrix');
  // Add / edit modal: spoc = the one being edited, null = new (kept while it closes so the form doesn't flash)
  const [form, setForm] = useState({ open: false, spoc: null });
  const openForm = (spoc = null) => setForm({ open: true, spoc });
  const full = spocs.filter((s) => projects.length > 0 && s.projects.length === projects.length).length;
  // Phones always get the list (as cards) — no matrix and no switch there
  const mobile = useIsMobile();
  const list = view === 'list' || mobile;
  // Search box (as on Participants): name, email, department or location
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const visible = useMemo(() => (q ? spocs.filter((s) => [s.name, s.email, s.department, s.location].some((v) => v?.toLowerCase().includes(q))) : spocs), [spocs, q]);

  return (
    <div className="ln-flat-mobile flex flex-col overflow-clip rounded-card border border-glass-border shadow-card glass">
      {/* Phones: just the view switch and Add SPOC (the heading and the chips hide — the tab already names it) */}
      <TabHeader
        icon={UserCog}
        tone="violet"
        title="SPOCs & Project Access"
        count={spocs.length}
        description="Single points of contact and which projects they can see"
        hideTitleOnMobile={spocs.length > 0}
        className="max-sm:px-3 max-sm:pb-0 max-sm:pt-1"
      >
        {spocs.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-sm:w-full max-sm:flex-nowrap max-sm:gap-x-2">
            {/* Two quiet chips: projects, and how many SPOCs can see all of them */}
            {projects.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 max-sm:hidden">
                {[
                  { icon: FolderKanban, value: projects.length, label: projects.length === 1 ? 'project' : 'projects' },
                  { icon: ShieldCheck, value: full, label: 'full access' },
                ].map(({ icon: Icon, value, label }) => (
                  <span key={label} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-text-muted/[0.06] px-2.5 text-[13px] ring-1 ring-inset ring-text-muted/10 text-text-secondary">
                    <Icon className="size-3.5 text-text-muted" aria-hidden="true" />
                    <span className="font-semibold tabular-nums text-text">{value}</span>
                    {label}
                  </span>
                ))}
              </div>
            )}
            <Input
              type="search"
              leftIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SPOCs…"
              aria-label="Search SPOCs"
              className="min-w-0 max-sm:flex-1 sm:w-52"
            />
            {/* Same view switch as the Projects tab (icons only, remembered) */}
            <SegmentedControl
              size="sm"
              ariaLabel="View"
              className="hidden md:flex"
              value={list ? 'list' : 'matrix'}
              onChange={setView}
              tabs={[
                { value: 'matrix', label: <span className="sr-only">Access matrix</span>, icon: Grid3x3, tooltip: 'Access matrix' },
                { value: 'list', label: <span className="sr-only">List view</span>, icon: List, tooltip: 'List view' },
              ]}
            />
            <Button leftIcon={UserPlus} onClick={() => openForm()} className="shrink-0">
              Add SPOC
            </Button>
          </div>
        )}
      </TabHeader>

      {spocs.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No SPOCs yet"
          description="Add the client’s points of contact and choose which projects each can see."
          action={
            <Button leftIcon={UserPlus} onClick={() => openForm()}>
              Add SPOC
            </Button>
          }
          className="border-t border-border"
        />
      ) : visible.length === 0 ? (
        <EmptyState compact icon={UserCog} title="No SPOCs match" description="Try another name, email or department." action={<Button variant="secondary" onClick={() => setSearch('')}>Clear search</Button>} className="border-t border-border" />
      ) : list ? (
        <SpocList spocs={visible} projects={projects} onEdit={openForm} />
      ) : (
        <>
          <div className="overflow-x-auto border-t border-border bg-surface/70 [scrollbar-width:thin] dark:bg-surface-secondary/60">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <caption className="sr-only">Which projects each SPOC can see</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-[11rem] min-w-[11rem] max-w-[11rem] border-b border-border-strong bg-surface px-5 py-3 text-left align-bottom text-[13px] font-semibold text-text-secondary sm:w-auto sm:min-w-[15rem] sm:max-w-none sm:px-6 dark:bg-surface-secondary"
                  >
                    SPOC
                  </th>
                  {projects.map((p) => (
                    // Just the name (up to two lines) with a status dot; full status and dates on hover
                    <th
                      key={p.id}
                      scope="col"
                      className="min-w-[7.5rem] max-w-[9rem] border-b border-border-strong px-3 py-3 text-center align-bottom font-normal"
                      title={`${p.name} · ${STATUS[p.status]?.label ?? p.status} · ${formatDate(p.start)} – ${formatDate(p.end)}`}
                    >
                      <span className="line-clamp-2 text-xs font-medium leading-4 text-text-secondary">
                        <span className={cn('mr-1 inline-block size-1.5 -translate-y-px rounded-full align-middle', STATUS[p.status]?.dot ?? 'bg-text-muted')} aria-hidden="true" />
                        {p.name}
                      </span>
                      <span className="sr-only">{STATUS[p.status]?.label ?? p.status}</span>
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="min-w-[8.5rem] border-b border-l border-border-strong bg-surface px-5 py-3 text-right align-bottom text-[13px] font-semibold text-text-secondary sm:sticky sm:right-0 sm:z-10 sm:px-6 dark:bg-surface-secondary"
                  >
                    Access
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => {
                  const n = s.projects.length;
                  return (
                    <tr key={s.id} className="group">
                      {/* Sticky SPOC cell: opaque so the scrolling columns pass under it */}
                      <th
                        scope="row"
                        className="sticky left-0 z-10 max-w-[11rem] border-b border-border bg-surface px-5 py-3.5 text-left font-normal transition-colors group-last:border-b-0 group-hover:bg-surface-secondary sm:max-w-none sm:px-6 dark:bg-surface-secondary dark:group-hover:bg-surface-sunken"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={s.name} size="md" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text">{s.name}</p>
                            <p className="truncate text-xs text-text-muted" title={[s.email, formatMobile(s.mobile), s.location, s.lastActive && `active ${formatRelative(s.lastActive)}`].filter(Boolean).join(' · ')}>
                              {[s.department, s.email].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                          {/* Edit: shows on row hover / focus */}
                          <IconButton
                            icon={Pencil}
                            label={`Edit ${s.name}`}
                            size="xs"
                            onClick={() => openForm(s)}
                            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                          />
                        </div>
                      </th>
                      {projects.map((p, i) => {
                        const has = s.projects.includes(p.id);
                        const prev = i > 0 && s.projects.includes(projects[i - 1].id);
                        const next = i < projects.length - 1 && s.projects.includes(projects[i + 1].id);
                        return (
                          <td key={p.id} className="relative border-b border-border px-2.5 py-3.5 text-center transition-colors group-last:border-b-0 group-hover:bg-surface-sunken/40">
                            {/* Access lane: neighbouring checks join into one soft capsule, so a row reads as a lane rather than a dotted grid */}
                            {has && (
                              <span
                                className={cn(
                                  'absolute inset-y-0 my-auto h-8 bg-success-soft/80',
                                  prev ? 'left-0' : 'left-[calc(50%-1rem)] rounded-l-full',
                                  next ? 'right-0' : 'right-[calc(50%-1rem)] rounded-r-full'
                                )}
                                aria-hidden="true"
                              />
                            )}
                            {has ? (
                              <span
                                className="relative inline-flex size-6 items-center justify-center rounded-full bg-surface text-success ring-1 ring-inset ring-success/25 dark:bg-surface-secondary"
                                title={`${s.name} can see ${p.name}`}
                              >
                                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                                <span className="sr-only">Has access</span>
                              </span>
                            ) : (
                              <span className="inline-flex size-7 items-center justify-center" title={`${s.name} can't see ${p.name}`}>
                                <span className="size-1.5 rounded-full bg-border-strong" aria-hidden="true" />
                                <span className="sr-only">No access</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border-b border-l border-border bg-surface px-5 py-3.5 text-right transition-colors group-last:border-b-0 group-hover:bg-surface-secondary sm:sticky sm:right-0 sm:z-10 sm:px-6 dark:bg-surface-secondary dark:group-hover:bg-surface-sunken">
                        <AccessSummary n={n} total={projects.length} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend + what's going on when there are no projects to show */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-3 text-xs text-text-muted sm:px-6">
            {projects.length === 0 ? (
              <span>This client has no projects yet — access shows here once projects are set up.</span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-8 items-center justify-center rounded-full bg-success-soft/80" aria-hidden="true">
                    <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-surface text-success ring-1 ring-inset ring-success/25 dark:bg-surface-secondary">
                      <Check className="size-2" strokeWidth={3} />
                    </span>
                  </span>
                  Can see the project
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-flex size-4 items-center justify-center" aria-hidden="true">
                    <span className="size-1.5 rounded-full bg-border-strong" />
                  </span>
                  No access
                </span>
                <span className="inline-flex items-center gap-3 sm:ml-auto">
                  {Object.values(STATUS).map((st) => (
                    <span key={st.label} className="inline-flex items-center gap-1.5">
                      <span className={cn('size-1.5 rounded-full', st.dot)} aria-hidden="true" />
                      {st.label}
                    </span>
                  ))}
                </span>
              </>
            )}
          </div>
        </>
      )}

      <SpocFormModal
        open={form.open}
        clientId={clientId}
        spoc={form.spoc}
        projects={projects}
        onClose={() => setForm((f) => ({ ...f, open: false }))}
        onSaved={() => onChanged?.()}
      />
    </div>
  );
}

/** Seat pill: a soft pill split into one seat per project, filled for each one they can see, with the count beside it */
function AccessSummary({ n, total }) {
  if (total === 0) return <span className="text-xs text-text-muted">No projects yet</span>;
  const all = n === total;
  return (
    <span className="inline-flex items-center gap-2" title={all ? 'Can see all projects' : `Can see ${n} of ${total} projects`}>
      <span className="flex gap-0.5 rounded-full bg-surface-sunken p-[3px]" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cn('h-3 w-1.5 rounded-[3px]', i < n ? 'bg-success/70' : 'bg-transparent')} />
        ))}
      </span>
      <span className={cn('min-w-4 text-right text-[13px] font-semibold tabular-nums', all ? 'text-success' : 'text-text')}>{all ? 'All' : n}</span>
      <span className="sr-only">{all ? 'Can see all projects' : `of ${total} projects`}</span>
    </span>
  );
}

/**
 * List view, laid out like Participants: a sortable table of SPOCs (cards on phones) — person with email, mobile,
 * role, how many projects they can see and when they were last active. Clicking a row opens a drawer with their
 * contact details and every project of this client, the ones they can see first.
 */
function SpocList({ spocs, projects, onEdit }) {
  const [detail, setDetail] = useState({ open: false, spoc: null });
  const closeDetail = () => setDetail((d) => ({ ...d, open: false }));
  const total = projects.length;

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'SPOC',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (s) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={s.name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{s.name}</p>
              <p className="max-w-[16rem] truncate text-xs text-text-muted" title={s.email}>
                {s.email}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'mobile', header: 'Mobile', hideBelow: 'lg', cell: (s) => (s.mobile ? <MobileNumber mobile={formatMobile(s.mobile)} /> : <span className="text-text-muted/70">—</span>) },
      {
        key: 'department',
        header: 'Department & location',
        sortable: true,
        accessor: (s) => s.department ?? '~',
        cell: (s) =>
          s.department || s.location ? (
            <div className="min-w-0">
              <p className="text-[13px] text-text">{s.department ?? <span className="text-text-muted/70">—</span>}</p>
              <p className="text-xs text-text-muted">{s.location ?? '—'}</p>
            </div>
          ) : (
            <span className="text-text-muted/70">—</span>
          ),
      },
      {
        key: 'access',
        header: 'Project access',
        sortable: true,
        accessor: (s) => s.projects.length,
        cell: (s) =>
          total > 0 && s.projects.length === total ? (
            <StatusBadge tone="success" label="All projects" />
          ) : (
            <span className="text-[13px] tabular-nums text-text-secondary">
              <span className="font-semibold text-text">{s.projects.length}</span> of {total} projects
            </span>
          ),
      },
      {
        key: 'lastActive',
        header: 'Last active',
        sortable: true,
        hideBelow: 'md',
        accessor: (s) => (s.lastActive ? new Date(s.lastActive) : new Date(0)),
        cell: (s) => <span className="text-[13px] text-text-muted">{s.lastActive ? formatRelative(s.lastActive) : '—'}</span>,
      },
      {
        key: 'open',
        pin: 'right', // stays in view while the table scrolls sideways
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 96,
        // Edit (stops the row click) + the "see details" cue that slides in on row hover
        cell: (s) => (
          <span className="inline-flex items-center gap-1">
            <IconButton
              icon={Pencil}
              label={`Edit ${s.name}`}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(s);
              }}
            />
            <span
              className="inline-flex size-7 -translate-x-1.5 items-center justify-center rounded-full bg-primary-soft text-primary-text opacity-0 transition-[opacity,transform] duration-300 ease-out row-hover:translate-x-0 row-hover:opacity-100"
              aria-hidden="true"
            >
              <ArrowRight className="size-3.5" />
            </span>
          </span>
        ),
      },
    ],
    [total, onEdit],
  );

  return (
    <>
      {/* lg: fills the rest of the card, so the table's footer sits at the bottom when there are few rows */}
      <div className="border-t border-border-strong max-sm:border-t-0 lg:flex lg:flex-1 lg:flex-col">
        <DataTable
          embedded
          mobileCards
          columns={columns}
          data={spocs}
          onRowClick={(spoc) => setDetail({ open: true, spoc })}
          defaultSort={{ key: 'name', direction: 'asc' }}
          caption="SPOCs"
        />
      </div>
      <Drawer open={detail.open} onClose={closeDetail} header={false} labelledBy={DETAIL_TITLE_ID}>
        {detail.spoc && (
          <SpocDetails
            spoc={detail.spoc}
            projects={projects}
            onClose={closeDetail}
            onEdit={() => {
              closeDetail();
              onEdit(detail.spoc);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

/** Drawer body: who they are + how to reach them, then the client's projects split into can see / no access */
function SpocDetails({ spoc: s, projects, onClose, onEdit }) {
  const seen = projects.filter((p) => s.projects.includes(p.id));
  const hidden = projects.filter((p) => !s.projects.includes(p.id));
  const contacts = [
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    { icon: Phone, label: 'Mobile', value: formatMobile(s.mobile), href: s.mobile && `tel:+91${s.mobile}` },
    { icon: Building, label: 'Department', value: s.department },
    { icon: MapPin, label: 'Location', value: s.location },
    { icon: Clock, label: 'Last active', value: s.lastActive ? formatRelative(s.lastActive) : 'Not yet' },
  ];
  return (
    <div className="flex min-h-full flex-col">
      {/* Edit + Close stay put while the details scroll */}
      <div className="sticky top-0 z-10 flex h-0 justify-end gap-2 px-3.5 sm:px-4.5">
        <Button variant="secondary" size="sm" leftIcon={Pencil} onClick={onEdit} className="mt-4 rounded-full bg-surface/80 backdrop-blur">
          Edit
        </Button>
        <IconButton icon={X} label="Close" size="sm" tooltip={false} onClick={onClose} className="mt-4 rounded-full bg-surface/80 shadow-xs ring-1 ring-border/70 backdrop-blur" />
      </div>

      {/* Hero: a soft violet wash (the tab's colour), as the Participants / Projects drawers wash by status */}
      <header className="bg-gradient-to-b from-chart-4/[0.13] via-chart-4/[0.05] to-transparent px-5 pb-7 pt-14 sm:px-6">
        <div className="flex items-center gap-4">
          <Avatar name={s.name} size="lg" className="rounded-full ring-4 ring-surface/80" />
          <div className="min-w-0">
            <h2 id={DETAIL_TITLE_ID} className="text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text">
              {s.name}
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">{[s.department, s.location].filter(Boolean).join(' · ') || 'SPOC'}</p>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-text-secondary">
          <span className="font-semibold text-text">{projects.length > 0 && seen.length === projects.length ? 'Can see all projects' : `Can see ${seen.length} of ${projects.length} projects`}</span>
        </p>
      </header>

      {/* Contact */}
      <dl className="mx-5 space-y-3 border-b border-border/70 pb-5 sm:mx-6">
        {contacts.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-muted">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-text-muted">{label}</dt>
              <dd className="break-all text-sm font-medium text-text">
                {!value ? (
                  <span className="font-normal text-text-muted">Not provided</span>
                ) : href ? (
                  <a href={href} className="hover:text-primary-text hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {/* Project access */}
      <section className="space-y-6 px-5 py-6 sm:px-6" aria-label="Project access">
        <AccessGroup icon={Eye} title="Can see" items={seen} empty="No projects yet" />
        {hidden.length > 0 && <AccessGroup icon={EyeOff} title="No access" items={hidden} muted />}
      </section>
    </div>
  );
}

function AccessGroup({ icon: Icon, title, items, muted, empty }) {
  return (
    <div>
      <h3 className={cn('flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]', muted ? 'text-text-muted' : 'text-success')}>
        <Icon className="size-3.5" aria-hidden="true" />
        {title} <span className="ml-0.5 font-medium tabular-nums">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-3 text-[13px] text-text-muted">{empty}</p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {items.map((p) => (
            <li key={p.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium leading-5', muted ? 'text-text-muted' : 'text-text')}>{p.name}</p>
                <p className="mt-0.5 text-xs tabular-nums text-text-muted">
                  {formatDate(p.start)} – {formatDate(p.end)}
                </p>
              </div>
              <StatusBadge status={p.status} className={cn('mt-0.5 shrink-0', muted && 'opacity-60')} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
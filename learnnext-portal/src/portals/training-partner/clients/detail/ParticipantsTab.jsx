import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Briefcase, Building, Mail, Phone, Route, Search, SearchX, SlidersHorizontal, UsersRound, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { useDebounce } from '@/hooks/useDebounce';
import { Avatar, Button, DataTable, Drawer, IconButton, Input, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CodeChip, MobileNumber } from '@/shared/clients/components/clientColumns';
import { FilterSection } from '../components/FilterSection';
import { JourneyStep } from './JourneyStep';
import { TabHeader } from '@/shared/clients/detail/TabHeader';

const STATUS_ORDER = ['in-progress', 'pending', 'completed'];
const LABEL = { 'in-progress': 'In progress', pending: 'Pending', completed: 'Completed' };
const STATUS_TEXT = { 'in-progress': 'text-primary-text', pending: 'text-warning', completed: 'text-success' };
// Journey drawer hero wash, per overall status (kept soft)
const HERO = {
  'in-progress': 'from-primary-soft/80 via-primary-soft/30',
  pending: 'from-warning-soft/60 via-warning-soft/20',
  completed: 'from-success-soft/80 via-success-soft/30',
};
const DETAIL_TITLE_ID = 'participant-journey-title';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** A blank field: a soft dash (screen readers hear "Not provided") */
function Blank() {
  return (
    <span className="text-text-muted/70">
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not provided</span>
    </span>
  );
}

/**
 * Participants — view only. People from this client with their contact details and learning journey: a searchable,
 * sortable table (cards on phones). Search sits in the header with a Filters button beside it (journey status,
 * department, designation in a drawer — as on All Clients); active filters show as removable chips. Clicking a person
 * opens a drawer with their details and every project they're in as a journey (enrolled → completed).
 */
export function ParticipantsTab({ participants }) {
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState({ open: false, person: null });
  const closeDetail = () => setDetail((d) => ({ ...d, open: false }));

  const rows = useMemo(() => filterParticipants(participants, filters, q), [participants, filters, q]);
  const chips = [
    ...(filters.status !== 'all' ? [{ key: 'status', label: LABEL[filters.status], clear: { status: 'all' } }] : []),
    ...filters.departments.map((d) => ({ key: `d-${d}`, label: d, clear: { departments: filters.departments.filter((x) => x !== d) } })),
    ...filters.designations.map((d) => ({ key: `g-${d}`, label: d, clear: { designations: filters.designations.filter((x) => x !== d) } })),
  ];
  const filtered = chips.length > 0 || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Participant',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (p) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={p.name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{p.name}</p>
              <p className="max-w-[16rem] truncate text-xs text-text-muted" title={p.email}>
                {p.email}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'mobile', header: 'Mobile', hideBelow: 'lg', cell: (p) => (p.mobile ? <MobileNumber mobile={p.mobile} /> : <Blank />) },
      {
        key: 'department',
        header: 'Department & role',
        sortable: true,
        accessor: (p) => p.department ?? '~',
        cell: (p) =>
          p.department || p.designation ? (
            <div className="min-w-0">
              <p className="text-[13px] text-text">{p.department ?? <Blank />}</p>
              <p className="text-xs text-text-muted">{p.designation ?? '—'}</p>
            </div>
          ) : (
            <Blank />
          ),
      },
      {
        key: 'employeeCode',
        header: 'Employee code',
        sortable: true,
        hideBelow: 'md',
        accessor: (p) => p.employeeCode ?? '~',
        cell: (p) => (p.employeeCode ? <CodeChip code={p.employeeCode} /> : <Blank />),
      },
      {
        key: 'status',
        header: 'Learning journey',
        sortable: true,
        accessor: (p) => STATUS_ORDER.indexOf(p.status),
        cell: (p) => {
          const done = p.journey.filter((j) => j.status === 'completed').length;
          return (
            <div className="flex flex-col items-start gap-1">
              <StatusBadge status={p.status} />
              <span className="text-xs tabular-nums text-text-muted">
                {done} of {plural(p.journey.length, 'project')} done
              </span>
            </div>
          );
        },
      },
      {
        key: 'open',
        pin: 'right', // stays in view while the table scrolls sideways
        header: <span className="sr-only">Open</span>,
        align: 'right',
        hideable: false,
        width: 56,
        // "See journey" cue — slides in on row hover
        cell: () => (
          <span
            className="inline-flex size-7 -translate-x-1.5 items-center justify-center rounded-full bg-primary-soft text-primary-text opacity-0 transition-[opacity,transform] duration-300 ease-out row-hover:translate-x-0 row-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowRight className="size-3.5" />
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="ln-flat-mobile flex flex-col overflow-clip rounded-card border border-glass-border shadow-card glass">
      {/* Header: search + Filters on the right; while filtering, the result line + chips underneath */}
      <div className="px-5 py-5 max-sm:px-3 max-sm:pb-0 max-sm:pt-1 sm:px-6">
        <TabHeader icon={UsersRound} tone="info" title="Participants" count={participants.length} description="People from this client and their learning journeys" hideTitleOnMobile className="p-0 sm:p-0">
          {participants.length > 0 && (
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                type="search"
                leftIcon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, code…"
                aria-label="Search participants"
                className="min-w-0 flex-1 sm:w-64 sm:flex-none"
              />
              <Button variant="secondary" leftIcon={SlidersHorizontal} onClick={() => setFiltersOpen(true)} aria-haspopup="dialog" className="shrink-0">
                Filters
                {chips.length > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold tabular-nums text-primary-fg">{chips.length}</span>
                )}
              </Button>
            </div>
          )}
        </TabHeader>

        {/* Only while searching / filtering: result count + removable chips */}
        {filtered && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
            <p className="mr-1 text-text-muted" aria-live="polite">
              <span className="font-semibold tabular-nums text-text">{rows.length}</span> of {participants.length} participants
            </p>
            {chips.map((chip) => (
              <span key={chip.key} className="inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-primary-soft pl-2.5 pr-1 text-xs font-medium text-primary-text">
                <span className="truncate">{chip.label}</span>
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, ...chip.clear }))}
                  aria-label={`Remove filter ${chip.label}`}
                  className="inline-flex size-5 items-center justify-center rounded-full hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </span>
            ))}
            <button type="button" onClick={clearAll} className="rounded px-1 text-xs font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Clear all
            </button>
          </div>
        )}
      </div>

      {participants.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No participants yet"
          description="People from this client will be listed here once they’re added to a project."
          className="border-t border-border"
        />
      ) : (
        // lg: fills the rest of the card, so the table's footer sits at the bottom when there are few rows
        <div className="border-t border-border-strong max-sm:border-t-0 lg:flex lg:flex-1 lg:flex-col">
          <DataTable
            embedded
            stickyHeader
            mobileCards
            columns={columns}
            data={rows}
            onRowClick={(person) => setDetail({ open: true, person })}
            defaultSort={{ key: 'name', direction: 'asc' }}
            pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
            caption="Participants"
            emptyState={
              <EmptyState
                compact
                icon={SearchX}
                title="No participants match"
                description="Try a different search or filter."
                action={
                  filtered && (
                    <Button variant="secondary" onClick={clearAll}>
                      Clear search & filters
                    </Button>
                  )
                }
              />
            }
          />
        </div>
      )}

      <ParticipantFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
        participants={participants}
        search={q}
      />

      <Drawer open={detail.open} onClose={closeDetail} header={false} labelledBy={DETAIL_TITLE_ID}>
        {detail.person && <JourneyDetails person={detail.person} onClose={closeDetail} />}
      </Drawer>
    </div>
  );
}

const EMPTY_FILTERS = { status: 'all', departments: [], designations: [] };

function filterParticipants(list, f, q) {
  return list.filter(
    (p) =>
      (f.status === 'all' || p.status === f.status) &&
      (!f.departments.length || f.departments.includes(p.department)) &&
      (!f.designations.length || f.designations.includes(p.designation)) &&
      (!q || [p.name, p.email, p.mobile, p.employeeCode, p.department, p.designation].some((v) => v && v.toLowerCase().includes(q))),
  );
}

const options = (list, key) => [...new Set(list.map((p) => p[key]).filter(Boolean))].sort().map((v) => ({ value: v, label: v }));

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N participants" (live count) */
function ParticipantFiltersDrawer({ open, onClose, filters, onApply, participants, search }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = filterParticipants(participants, draft, search).length;
  const departments = useMemo(() => options(participants, 'department'), [participants]);
  const designations = useMemo(() => options(participants, 'designation'), [participants]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter participants"
      description="By learning journey, department or role"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft(EMPTY_FILTERS)}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching participants' : `Show ${plural(count, 'participant')}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FilterSection icon={Route} tone="green" title="Learning journey" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[{ value: 'all', label: 'All' }, ...STATUS_ORDER.map((s) => ({ value: s, label: LABEL[s] }))]}
            value={draft.status}
            onChange={(status) => set({ status })}
            ariaLabel="Learning journey"
            fullWidth
          />
        </FilterSection>
        <FilterSection icon={Building} tone="blue" title="Department" onClear={draft.departments.length ? () => set({ departments: [] }) : undefined}>
          <MultiSelect options={departments} value={draft.departments} onChange={(departments) => set({ departments })} placeholder="Any department" searchPlaceholder="Search departments…" />
        </FilterSection>
        <FilterSection icon={Briefcase} tone="violet" title="Designation" onClear={draft.designations.length ? () => set({ designations: [] }) : undefined}>
          <MultiSelect options={designations} value={draft.designations} onChange={(designations) => set({ designations })} placeholder="Any designation" searchPlaceholder="Search designations…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

/** Drawer body: who they are + how to reach them, then their projects as a journey */
function JourneyDetails({ person: p, onClose }) {
  const done = p.journey.filter((j) => j.status === 'completed').length;
  const contacts = [
    { icon: Mail, label: 'Email', value: p.email, href: `mailto:${p.email}` },
    { icon: Phone, label: 'Mobile', value: p.mobile, href: p.mobile && `tel:${p.mobile.replace(/\s/g, '')}` },
    { icon: BadgeCheck, label: 'Employee code', value: p.employeeCode },
  ];
  return (
    <div className="flex min-h-full flex-col">
      {/* Close stays put while the details scroll (a zero-height sticky row floating over the hero) */}
      <div className="sticky top-0 z-10 flex h-0 justify-end px-3.5 sm:px-4.5">
        <IconButton icon={X} label="Close" size="sm" tooltip={false} onClick={onClose} className="mt-4 rounded-full bg-surface/80 shadow-xs ring-1 ring-border/70 backdrop-blur" />
      </div>

      {/* Hero */}
      <header className={cn('bg-gradient-to-b to-transparent px-5 pb-6 pt-5 sm:px-6', HERO[p.status])}>
        <div className="flex h-8 items-center">
          <StatusBadge status={p.status} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Avatar name={p.name} size="lg" className="rounded-full ring-4 ring-surface/80" />
          <div className="min-w-0">
            <h2 id={DETAIL_TITLE_ID} className="text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text">
              {p.name}
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">{[p.designation, p.department].filter(Boolean).join(' · ') || 'Role not set'}</p>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-text-secondary">
          <span className="font-semibold text-text">
            {done} of {plural(p.journey.length, 'project')} completed
          </span>
          {STATUS_ORDER.filter((s) => s !== 'completed').map((s) => {
            const n = p.journey.filter((j) => j.status === s).length;
            return n ? ` · ${n} ${LABEL[s].toLowerCase()}` : '';
          })}
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
                  <span className="font-mono">{value}</span>
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {/* Learning journey */}
      <section className="px-5 py-6 sm:px-6" aria-labelledby="participant-journey-list">
        <h3 id="participant-journey-list" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          Learning journey <span className="ml-1 font-medium tabular-nums">{p.journey.length}</span>
        </h3>
        <ol className="mt-5">
          {p.journey.map((j, i) => (
            <JourneyStep key={j.projectId} status={j.status} last={i === p.journey.length - 1}>
              <p className="pt-0.5 text-[15px] font-semibold leading-5 text-text">{j.project}</p>
              <p className="mt-1 text-[13px] tabular-nums text-text-secondary">
                <span className={cn('font-semibold', STATUS_TEXT[j.status])}>{LABEL[j.status]}</span> · Enrolled {formatDate(j.createdAt)}
              </p>
              <p className="mt-1 text-xs tabular-nums text-text-muted">{j.completedAt ? `Completed ${formatDate(j.completedAt)}` : 'Not completed yet'}</p>
            </JourneyStep>
          ))}
        </ol>
      </section>
    </div>
  );
}

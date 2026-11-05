import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building, CalendarRange, Search, ChevronLeft, ChevronRight, CircleCheck, FolderKanban, List, ListChecks, SearchX, Shapes, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { STORAGE_KEYS } from '@/config/app';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { AvatarGroup, Button, Card, DataTable, Drawer, IconButton, Input, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { FilterSection } from '../components/FilterSection';
import { TabHeader } from '@/shared/clients/detail/TabHeader';

const DAY = 86400000;
const STATUS_ORDER = ['in-progress', 'upcoming', 'completed'];
const LABEL = { 'in-progress': 'In progress', upcoming: 'Upcoming', completed: 'Completed' };

// Per status (static class names for Tailwind): project bar, also the key swatch
const BAR = {
  'in-progress': 'bg-primary/[0.12] ring-primary/30 text-primary-text',
  upcoming: 'bg-info-main/[0.12] ring-info/25 text-info',
  completed: 'bg-success-main/[0.12] ring-success/25 text-success',
};

/** "14 Oct – 31 Oct 2026" (year once when both dates share it) */
function range(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  return a.getFullYear() === b.getFullYear() ? `${formatDate(a, { year: undefined })} – ${formatDate(b)}` : `${formatDate(a)} – ${formatDate(b)}`;
}

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const yearOf = (d) => new Date(d).getFullYear();
/** Does start–end touch the given year? */
const inYear = (x, year) => yearOf(x.start) <= year && yearOf(x.end) >= year;

/** The schedule's time scale: one calendar year, Jan–Dec */
function useScale(year) {
  return useMemo(() => {
    const today = startOfToday();
    const from = new Date(year, 0, 1);
    const to = new Date(year + 1, 0, 1); // exclusive
    const pct = (d) => ((new Date(d) - from) / (to - from)) * 100;
    const months = Array.from({ length: 12 }, (_, i) => {
      const m = new Date(year, i, 1);
      return { key: i, date: m, left: pct(m), width: pct(new Date(year, i + 1, 1)) - pct(m) };
    });
    // A span's left/width in %, inclusive of the end day, cut to the year (never thinner than a sliver, so short
    // programs still show); `before` / `after` say it carries on into the previous / next year
    const span = (start, end) => {
      const a = pct(start);
      const b = pct(new Date(new Date(end).getTime() + DAY));
      const left = Math.max(a, 0);
      return { left, width: Math.max(Math.min(b, 100) - left, 0.8), before: a < 0, after: b > 100 };
    };
    return { year, months, span, today: today >= from && today < to ? pct(today) : null, todayDate: today };
  }, [year]);
}

/**
 * Projects — view only, in two views (switch in the header, remembered):
 *   Timeline  one year at a time (‹ 2026 › steps through the years, so years of history never make it wide). Months
 *             run across the top with a "Today" line; each project is a soft bar over its dates, coloured by status
 *             (blue running — its elapsed part a little deeper —, cyan upcoming, green done); a bar that carries on into
 *             another year fades out at that edge.
 *   List      every project across all years in a sortable table (newest first).
 * A Filters drawer (as on Participants) narrows both: project status, project type, program status, delivered by;
 * active filters show as removable chips. Clicking a project opens a details drawer with every program in full.
 * Nothing here edits, archives or logs in — that stays in project management.
 */
export function ProjectsTab({ projects }) {
  const [view, setView] = useLocalStorage(STORAGE_KEYS.projectsView, 'timeline');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Years with projects, plus this one; opens on this year (or the latest one with projects, if this year has none)
  const years = useMemo(() => {
    const now = yearOf(startOfToday());
    if (!projects.length) return { first: now, last: now, start: now };
    const first = Math.min(now, ...projects.map((p) => yearOf(p.start)));
    const last = Math.max(now, ...projects.map((p) => yearOf(p.end)));
    const latest = Math.max(...projects.map((p) => yearOf(p.start)).filter((y) => y <= now), first);
    return { first, last, start: projects.some((p) => inYear(p, now)) ? now : latest };
  }, [projects]);
  const [year, setYear] = useState(years.start);
  // The project shown in the details drawer (kept while it slides out, so the panel doesn't empty mid-animation)
  const [detail, setDetail] = useState({ open: false, project: null });
  const closeDetail = () => setDetail((d) => ({ ...d, open: false }));

  // Phones always get the list (as cards) — no timeline and no switch there
  const mobile = useIsMobile();
  const timeline = view !== 'list' && !mobile;
  // Filters, then the search box (project name, type, or who delivers its programs)
  const matching = useMemo(() => {
    const q = search.trim().toLowerCase();
    return filterProjects(projects, filters).filter((p) => !q || [p.name, p.projectType, ...p.programs.map((g) => g.subEntity)].some((v) => v?.toLowerCase().includes(q)));
  }, [projects, filters, search]);
  // Timeline: this year's, earliest first (reads naturally on a schedule). List: all years, newest first (the table sorts).
  const shown = useMemo(() => (timeline ? matching.filter((p) => inYear(p, year)).sort((a, b) => new Date(a.start) - new Date(b.start)) : matching), [matching, timeline, year]);
  const scale = useScale(year);
  const open = (project) => setDetail({ open: true, project });

  const chips = [
    ...(filters.status !== 'all' ? [{ key: 'status', label: LABEL[filters.status], clear: { status: 'all' } }] : []),
    ...filters.types.map((t) => ({ key: `t-${t}`, label: t, clear: { types: filters.types.filter((x) => x !== t) } })),
    ...(filters.programStatus !== 'all' ? [{ key: 'ps', label: `Programs ${LABEL[filters.programStatus].toLowerCase()}`, clear: { programStatus: 'all' } }] : []),
    ...filters.entities.map((e) => ({ key: `e-${e}`, label: e, clear: { entities: filters.entities.filter((x) => x !== e) } })),
  ];

  return (
    <Card tint="primary" subtleTint flatOnMobile padding="none" className="lg:flex lg:flex-col">
      {/* Header: view switch, year stepper (timeline only) and Filters on the right; while filtering, chips underneath */}
      <div className="px-5 py-5 max-sm:px-3 max-sm:pb-0 max-sm:pt-0 sm:px-6">
        <TabHeader icon={FolderKanban} tone="primary" title="Projects" count={projects.length || undefined} description="Training projects run for this client" hideTitleOnMobile className="p-0 sm:p-0">
          {projects.length > 0 && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              {/* Year stepper (timeline only, styled like the Filters button), view switch, Filters */}
              {timeline && (
                <div className={CONTROL} role="group" aria-label="Year">
                  <IconButton icon={ChevronLeft} label={`Show ${year - 1}`} size="xs" disabled={year <= years.first} onClick={() => setYear(year - 1)} />
                  <span className="w-11 text-center text-sm font-bold tabular-nums text-text" aria-live="polite">
                    {year}
                  </span>
                  <IconButton icon={ChevronRight} label={`Show ${year + 1}`} size="xs" disabled={year >= years.last} onClick={() => setYear(year + 1)} />
                </div>
              )}
              {/* The app's usual toggle (sliding white pill on a soft track), icons only */}
              <SegmentedControl
                size="sm"
                ariaLabel="View"
                className="hidden md:flex"
                value={timeline ? 'timeline' : 'list'}
                onChange={setView}
                tabs={[
                  { value: 'timeline', label: <span className="sr-only">Timeline view</span>, icon: CalendarRange, tooltip: 'Timeline view' },
                  { value: 'list', label: <span className="sr-only">List view</span>, icon: List, tooltip: 'List view' },
                ]}
              />
              {/* Search, as on Participants */}
              <Input
                type="search"
                leftIcon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="min-w-0 flex-1 sm:w-56 sm:flex-none"
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

        {(chips.length > 0 || search.trim()) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
            <p className="mr-1 text-text-muted" aria-live="polite">
              <span className="font-semibold tabular-nums text-text">{shown.length}</span> {timeline ? `in ${year}` : `of ${projects.length} projects`}
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
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setSearch('');
              }}
              className="rounded px-1 text-xs font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Projects run for this client will appear here on a schedule with their programs." className="border-t border-border" />
      ) : !timeline ? (
        <ProjectTable projects={shown} onOpen={open} onClear={chips.length || search.trim() ? () => (setFilters(EMPTY_FILTERS), setSearch('')) : undefined} />
      ) : shown.length === 0 ? (
        <EmptyState
          compact
          icon={FolderKanban}
          title={chips.length ? `No matching projects in ${year}` : `No projects in ${year}`}
          description={chips.length ? 'Try another year or loosen the filters.' : 'Use the arrows to see other years.'}
          className="border-t border-border"
        />
      ) : (
        <>
          <Schedule projects={shown} scale={scale} onOpen={open} />
          <CompactList projects={shown} onOpen={open} />
        </>
      )}

      <ProjectFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} projects={projects} />

      <Drawer open={detail.open} onClose={closeDetail} header={false} labelledBy={DETAIL_TITLE_ID}>
        {detail.project && <ProjectDetails project={detail.project} onClose={closeDetail} />}
      </Drawer>
    </Card>
  );
}

// A header control group that matches a secondary Button (36px from sm, white surface, border, control radius)
const CONTROL = 'inline-flex h-10 items-center gap-0.5 rounded-control border border-border-strong bg-surface px-1 sm:h-9';

const EMPTY_FILTERS = { status: 'all', types: [], programStatus: 'all', entities: [] };

/** Project status, project type, "has a program that is …", delivered by (any of its programs) */
function filterProjects(list, f) {
  return list.filter(
    (p) =>
      (f.status === 'all' || p.status === f.status) &&
      (!f.types.length || f.types.includes(p.projectType)) &&
      (f.programStatus === 'all' || p.programs.some((g) => g.status === f.programStatus)) &&
      (!f.entities.length || p.programs.some((g) => f.entities.includes(g.subEntity))),
  );
}

const STATUS_TABS = [{ value: 'all', label: 'All' }, ...STATUS_ORDER.map((s) => ({ value: s, label: LABEL[s] }))];
const optionsOf = (values) => [...new Set(values)].sort().map((v) => ({ value: v, label: v }));

/** Filters panel (same pattern as Participants / All Clients): edits a draft, applied with "Show N projects" (live count) */
function ProjectFiltersDrawer({ open, onClose, filters, onApply, projects }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = filterProjects(projects, draft).length;
  const types = useMemo(() => optionsOf(projects.map((p) => p.projectType)), [projects]);
  const entities = useMemo(() => optionsOf(projects.flatMap((p) => p.programs.map((g) => g.subEntity))), [projects]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter projects"
      description="By status, type or who delivers them"
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
            {count === 0 ? 'No matching projects' : `Show ${plural(count, 'project')}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FilterSection icon={CircleCheck} tone="green" title="Project status" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
          <SegmentedControl tabs={STATUS_TABS} value={draft.status} onChange={(status) => set({ status })} ariaLabel="Project status" fullWidth />
        </FilterSection>
        <FilterSection icon={Shapes} tone="blue" title="Project type" onClear={draft.types.length ? () => set({ types: [] }) : undefined}>
          <MultiSelect options={types} value={draft.types} onChange={(t) => set({ types: t })} placeholder="Any type" searchPlaceholder="Search types…" />
        </FilterSection>
        <FilterSection icon={ListChecks} tone="violet" title="Program status" onClear={draft.programStatus !== 'all' ? () => set({ programStatus: 'all' }) : undefined}>
          <SegmentedControl tabs={STATUS_TABS} value={draft.programStatus} onChange={(programStatus) => set({ programStatus })} ariaLabel="Program status" fullWidth />
          <p className="-mt-1 text-xs text-text-muted">Projects with at least one program in this status.</p>
        </FilterSection>
        <FilterSection icon={Building} tone="amber" title="Delivered by" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={entities} value={draft.entities} onChange={(e) => set({ entities: e })} placeholder="Anyone" searchPlaceholder="Search…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

/** Where a project stands: fill % for its progress line, and a short caption */
function progressOf(p) {
  const today = startOfToday();
  const total = days(p.start, p.end);
  if (p.status === 'completed') return { pct: 100, caption: 'Done' };
  if (p.status === 'upcoming') {
    const n = days(today, p.start) - 1;
    return { pct: 0, caption: n === 1 ? 'Starts tomorrow' : `Starts in ${n} days` };
  }
  const day = days(p.start, today);
  return { pct: Math.min(100, ((day - 0.5) / total) * 100), caption: `Day ${day} of ${total}` };
}

/**
 * List view: every project (all years) in a sortable table, newest first; cards on phones. Same columns as a plain
 * table, with a little more in each cell: a status-tinted folder tile by the name, the type as a soft chip, the
 * duration over a slim progress line with where it stands, and who delivers the programs as stacked initials.
 */
function ProjectTable({ projects, onOpen, onClear }) {
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Project',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (p) => (
          <div className="flex min-w-0 items-center gap-3">
            <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg', TILE[p.status])}>
              <FolderKanban className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{p.name}</p>
              <span className="mt-0.5 inline-flex rounded-md bg-text-muted/10 px-1.5 py-px text-[11px] font-medium text-text-secondary">{p.projectType}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'start',
        header: 'Dates',
        sortable: true,
        accessor: (p) => new Date(p.start),
        cell: (p) => (
          <div>
            <p className="text-[13px] tabular-nums text-text">{range(p.start, p.end)}</p>
            <p className="mt-0.5 text-xs tabular-nums text-text-muted">{plural(days(p.start, p.end), 'day')}</p>
          </div>
        ),
      },
      {
        key: 'progress',
        header: 'Progress',
        sortable: true,
        hideBelow: 'lg',
        accessor: (p) => progressOf(p).pct,
        cell: (p) => {
          const prog = progressOf(p);
          return (
            <div className="w-36">
              <span className="block h-1.5 overflow-hidden rounded-full bg-text-muted/15" aria-hidden="true">
                <span className={cn('block h-full rounded-full', FILL[p.status])} style={{ width: `${prog.pct}%` }} />
              </span>
              <span className="mt-1.5 block text-xs tabular-nums text-text-muted">{prog.caption}</span>
            </div>
          );
        },
      },
      {
        key: 'programs',
        header: 'Programs',
        sortable: true,
        hideBelow: 'md',
        accessor: (p) => p.programs.length,
        cell: (p) => (
          <span className="inline-flex items-center gap-2" title={[...new Set(p.programs.map((x) => x.subEntity))].join(', ')}>
            <AvatarGroup people={p.programs.map((x) => ({ id: x.oppId, name: x.subEntity }))} max={3} size="xs" />
            <span className="text-[13px] tabular-nums text-text-secondary">{p.programs.length}</span>
          </span>
        ),
      },
      { key: 'status', header: 'Status', sortable: true, accessor: (p) => STATUS_ORDER.indexOf(p.status), cell: (p) => <StatusBadge status={p.status} /> },
      {
        key: 'open',
        pin: 'right', // stays in view while the table scrolls sideways
        header: <span className="sr-only">Open</span>,
        align: 'right',
        hideable: false,
        width: 56,
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
    // lg: fills the rest of the card, so the table's footer sits at the bottom when there are few rows
    <div className="border-t border-border-strong max-sm:border-t-0 lg:flex lg:flex-1 lg:flex-col">
      <DataTable
        embedded
        mobileCards
        columns={columns}
        data={projects}
        onRowClick={onOpen}
        defaultSort={{ key: 'start', direction: 'desc' }}
        pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
        caption="Projects"
        emptyState={
          <EmptyState
            compact
            icon={SearchX}
            title="No projects match"
            description="Try loosening the filters."
            action={
              onClear && (
                <Button variant="secondary" onClick={onClear}>
                  Clear filters
                </Button>
              )
            }
          />
        }
      />
    </div>
  );
}

/** Phones (below md): the year's projects as a simple list — name, dates, status + program count; tap for details */
function CompactList({ projects, onOpen }) {
  return (
    // Each project its own card (as the list pages' cards on phones)
    <ul className="flex flex-col gap-3 border-t border-border p-3 max-sm:border-t-0 max-sm:pt-0 sm:p-4 md:hidden">
      {projects.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => onOpen(p)}
            aria-haspopup="dialog"
            className="flex w-full items-center gap-3 rounded-card border border-border-strong bg-surface/70 px-4 py-4 text-left shadow-xs transition-colors hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:bg-surface-secondary/60"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-5 text-text">{p.name}</span>
              <span className="mt-0.5 block text-xs tabular-nums text-text-secondary">
                <span className="whitespace-nowrap">{range(p.start, p.end)}</span>
                {/* Same line on wide screens; its own line (no dot) where the name column is narrower */}
                <span className="block whitespace-nowrap text-text-muted xl:inline">
                  <span className="hidden xl:inline"> · </span>
                  {p.projectType}
                </span>
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
                <StatusBadge status={p.status} />
                {p.programs.length} {p.programs.length === 1 ? 'program' : 'programs'}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Label column width — the month grid, gridlines and today line all start after it */
// Narrower on smaller screens so the months keep room (dates · type may wrap there)
const LABEL_W = 'w-56 lg:w-64 xl:w-80';
const LABEL_PAD = 'left-56 lg:left-64 xl:left-80';

/**
 * The project column stays put while the calendar scrolls sideways (only happens on smaller screens). Once scrolled it
 * gets a solid background — reaching back over the card's left padding — and a soft edge shadow; on hover it takes
 * the row's hover tint (solid, so the bars sliding under it don't show through).
 */
const stickyLabel = (scrolled) =>
  cn(
    'sticky left-5 z-[3] sm:left-6',
    scrolled &&
      'bg-surface shadow-[10px_0_12px_-10px_rgb(var(--ln-shadow-color)/0.35)] before:absolute before:inset-y-0 before:right-full before:w-5 before:bg-inherit sm:before:w-6 dark:bg-surface-secondary',
  );

function Schedule({ projects, scale, onOpen }) {
  const { months, today, todayDate } = scale;
  const [scrolled, setScrolled] = useState(false);
  return (
    // md+ only (phones get CompactList); in between it keeps a readable width and scrolls sideways
    <div className="hidden overflow-x-auto border-t border-border md:block" onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 0)}>
      <div className="relative min-w-[720px] px-5 pb-4 sm:px-6">
        <div className="relative">
          {/* Background layer over the time area: alternating month shading + the "today" line */}
          <div className={cn('pointer-events-none absolute inset-y-0 right-0', LABEL_PAD)} aria-hidden="true">
            {months.map((m, i) => (
              <span key={m.key} className={cn('absolute inset-y-0 border-l border-border-strong/70', i % 2 === 1 && 'bg-text-muted/[0.025]')} style={{ left: `${m.left}%`, width: `${m.width}%` }} />
            ))}
            {today != null && <span className="absolute inset-y-0 w-px bg-primary/50" style={{ left: `${today}%` }} />}
          </div>

          {/* Month scale — three-letter names centred in their columns (the schedule's min width keeps ~37px per month,
              enough for them). No "Today" pill covering a month: the current month's name gets a soft blue pill instead (the
              today line runs down from it). */}
          <div className="relative flex h-11 items-center">
            <div className={cn('flex h-full shrink-0 items-center pr-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted', LABEL_W, stickyLabel(scrolled))}>Project</div>
            <div className="relative h-full flex-1">
              {months.map((m) => {
                const current = today != null && m.key === todayDate.getMonth();
                const name = m.date.toLocaleDateString('en-GB', { month: 'short' }).slice(0, 3); // always 3 letters (en-GB says "Sept")
                return (
                  <span key={m.key} className="absolute inset-y-0 flex items-center justify-center" style={{ left: `${m.left}%`, width: `${m.width}%` }} title={current ? `Today, ${formatDate(todayDate)}` : undefined}>
                    <span
                      className={cn(
                        'rounded-full text-[11px] font-semibold uppercase tracking-[0.06em]',
                        // The current month: a soft brand-tinted pill (slim, so it stays inside its column at the narrowest)
                        current ? 'bg-primary-soft px-1.5 py-0.5 tracking-[0.02em] text-primary-text ring-1 ring-inset ring-primary/20' : 'text-text-secondary',
                      )}
                    >
                      {name}
                    </span>
                  </span>
                );
              })}
              {/* Names the line: a small "Today" tag where the line starts — on the scale's bottom edge, below the month names */}
              {today != null && (
                <span
                  className="absolute bottom-0 z-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-fg shadow-xs"
                  style={{ left: `${today}%` }}
                  title={formatDate(todayDate)}
                >
                  Today
                </span>
              )}
            </div>
          </div>

          {/* Projects */}
          <ul className="relative">
            {projects.map((p) => (
              <ProjectRow key={p.id} project={p} scale={scale} scrolled={scrolled} onOpen={() => onOpen(p)} />
            ))}
          </ul>
        </div>

        {/* Key */}
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-secondary">
          {/* Only the statuses on screen; the swatch is a mini project bar */}
          {STATUS_ORDER.filter((s) => projects.some((p) => p.status === s)).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={cn('h-2.5 w-4 rounded-full ring-1 ring-inset', BAR[s])} aria-hidden="true" />
              {LABEL[s]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project: p, scale, scrolled, onOpen }) {
  const { left, width, before, after } = scale.span(p.start, p.end);
  // Running: how much of the visible bar is behind us (0–100% of the bar)
  const elapsed =
    p.status === 'in-progress' && scale.today != null ? Math.min(100, Math.max(0, ((scale.today - left) / width) * 100)) : p.status === 'completed' || (p.status === 'in-progress' && before) ? 100 : 0;
  // Grows leftwards near the year's end; the elapsed part ends on the today line even when the pill is widened
  // (container units = % of the time area)
  const toEnd = left + width > 85;
  const elapsedWidth = toEnd ? `calc(100% - ${left + width - scale.today}cqw)` : `${scale.today - left}cqw`;
  return (
    <li className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="group flex min-h-16 w-full items-center rounded-lg py-3 text-left transition-colors hover:bg-primary-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus motion-reduce:transition-none"
      >
        {/* Name wraps (never cut off), then dates · type in one quiet line; everything else is in the details drawer */}
        <span
          className={cn(
            // Full row height (incl. the row's padding) so a pinned column's background covers it
            '-my-3 flex min-w-0 shrink-0 items-center gap-2 self-stretch py-3 pl-1 pr-4',
            LABEL_W,
            stickyLabel(scrolled),
            scrolled && 'group-hover:bg-[color-mix(in_oklab,var(--color-primary-soft)_60%,var(--color-surface))]',
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-sm font-semibold leading-5 text-text transition-colors group-hover:text-primary-text">{p.name}</span>
            <span className="mt-0.5 block text-xs tabular-nums text-text-secondary">
              <span className="whitespace-nowrap">{range(p.start, p.end)}</span>
                {/* Same line on wide screens; its own line (no dot) where the name column is narrower */}
                <span className="block whitespace-nowrap text-text-muted xl:inline">
                  <span className="hidden xl:inline"> · </span>
                  {p.projectType}
                </span>
            </span>
          </span>
          <ChevronRight
            className="size-4 shrink-0 -translate-x-1 text-primary-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>

        {/* The bar over the project's dates */}
        <span className="@container relative h-8 flex-1" aria-hidden="true">
          {/* Never narrower than its label (a short project's pill runs a little past its dates; near the year's end it
              grows leftwards instead, so it stays inside December) */}
          <span
            className={cn('absolute inset-y-0 min-w-[5.75rem]', STATUS_TEXT[p.status])}
            style={toEnd ? { right: `${100 - left - width}%`, width: `${width}%` } : { left: `${left}%`, width: `${width}%` }}
          >
            <span
              className={cn(
                'absolute inset-0 overflow-hidden rounded-full ring-1 ring-inset transition-shadow group-hover:shadow-card',
                BAR[p.status],
                // Carries on into another year: square, fading edge on that side
                before && 'rounded-l-none [mask-image:linear-gradient(to_right,transparent,black_1.5rem)]',
                after && 'rounded-r-none [mask-image:linear-gradient(to_left,transparent,black_1.5rem)]',
                before && after && '[mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]',
              )}
            >
              {/* Elapsed part, a touch deeper */}
              {elapsed > 0 && elapsed < 100 && <span className="absolute inset-y-0 left-0 bg-current opacity-[0.10]" style={{ width: elapsedWidth }} />}
            </span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-semibold">
              {p.programs.length} {p.programs.length === 1 ? 'program' : 'programs'}
            </span>
          </span>
        </span>
        <span className="sr-only">
          {LABEL[p.status]}, {p.programs.length} {p.programs.length === 1 ? 'program' : 'programs'}. View details
        </span>
      </button>
    </li>
  );
}

const DETAIL_TITLE_ID = 'project-details-title';
const days = (start, end) => Math.round((new Date(end) - new Date(start)) / DAY) + 1;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Details drawer, per status: soft hero wash, progress fill, program dot
const HERO = {
  'in-progress': 'from-primary/[0.09]',
  upcoming: 'from-info-main/[0.09]',
  completed: 'from-success-main/[0.09]',
};
const STATUS_TEXT = { 'in-progress': 'text-primary-text', upcoming: 'text-info', completed: 'text-success' };
// List view: the soft folder tile by each project's name
const TILE = { 'in-progress': 'bg-primary/10 text-primary-text', upcoming: 'bg-info-main/12 text-info', completed: 'bg-success-main/12 text-success' };
const FILL = { 'in-progress': 'bg-primary/70', upcoming: 'bg-info-main/60', completed: 'bg-success-main/60' };
const DOT = { 'in-progress': 'bg-primary', upcoming: 'bg-info-main/70', completed: 'bg-success-main' };

/** Where the project stands, short: "20 days left", "Last day", "Starts in 14 days", "Completed" */
function remaining(p) {
  const today = startOfToday();
  if (p.status === 'completed') return 'Completed';
  if (p.status === 'upcoming') {
    const n = days(today, p.start) - 1;
    return n === 1 ? 'Starts tomorrow' : `Starts in ${n} days`;
  }
  const left = days(today, p.end) - 1;
  return left === 0 ? 'Last day' : `${plural(left, 'day')} left`;
}

/** "13 Oct – 11 Nov" (years only when they differ, or aren't this project's year) */
function shortRange(start, end, year) {
  const a = new Date(start);
  const b = new Date(end);
  return a.getFullYear() === year && b.getFullYear() === year ? `${formatDate(a, { year: undefined })} – ${formatDate(b, { year: undefined })}` : range(start, end);
}

/**
 * Details drawer body, kept calm: status + name, one quiet line (type · created by), the dates with a slim progress
 * line and how long is left, then the programs — each just its name and one line of dates · type · who delivers it,
 * with a small status dot (status in words for screen readers and on hover).
 */
function ProjectDetails({ project: p, onClose }) {
  const today = startOfToday();
  const total = days(p.start, p.end);
  const done = p.status === 'completed' ? 100 : p.status === 'upcoming' ? 0 : Math.min(100, ((days(p.start, today) - 0.5) / total) * 100);
  const programs = p.programs.slice().sort((a, b) => new Date(a.start) - new Date(b.start));
  const year = yearOf(p.start);
  return (
    <div className="flex min-h-full flex-col">
      {/* Close stays put while the details scroll (a zero-height sticky row floating over the hero) */}
      <div className="sticky top-0 z-10 flex h-0 justify-end px-3.5 sm:px-4.5">
        <IconButton icon={X} label="Close" size="sm" tooltip={false} onClick={onClose} className="mt-4 rounded-full bg-surface/80 shadow-xs ring-1 ring-border/70 backdrop-blur" />
      </div>

      <header className={cn('bg-gradient-to-b to-transparent px-6 pb-8 pt-5', HERO[p.status])}>
        <div className="flex h-8 items-center">
          <StatusBadge status={p.status} />
        </div>
        <h2 id={DETAIL_TITLE_ID} className="mt-4 text-[22px] font-semibold leading-7 tracking-[-0.01em] text-text">
          {p.name}
        </h2>
        <p className="mt-1.5 text-[13px] text-text-secondary">
          {p.projectType} · <span title={formatDateTime(p.createdAt)}>Created by {p.createdBy}</span>
        </p>

        {/* Dates + how long is left, over a slim progress line */}
        <div className="mt-7 flex items-baseline justify-between gap-4 text-[13px]">
          <span className="font-medium tabular-nums text-text">{range(p.start, p.end)}</span>
          <span className={cn('shrink-0 font-semibold', STATUS_TEXT[p.status])}>{remaining(p)}</span>
        </div>
        <div className="relative mt-3 h-1.5 rounded-full bg-text-muted/15" aria-hidden="true">
          <span className={cn('absolute inset-y-0 left-0 rounded-full', FILL[p.status])} style={{ width: `${done}%` }} />
          {p.status === 'in-progress' && (
            <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-primary shadow-xs" style={{ left: `${done}%` }} />
          )}
        </div>
      </header>

      <section className="px-6 pb-8" aria-labelledby="project-programs-title">
        <h3 id="project-programs-title" className="text-sm font-semibold text-text">
          Programs <span className="ml-1 font-medium tabular-nums text-text-muted">{p.programs.length}</span>
        </h3>
        <ul className="mt-5 space-y-5">
          {programs.map((g) => (
            <li key={g.oppId} className="flex gap-3" title={`${LABEL[g.status]} · ${g.entity} · Opportunity #${g.oppId}`}>
              <span className={cn('mt-[7px] size-2 shrink-0 rounded-full', DOT[g.status])} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-5 text-text">{g.program}</p>
                <p className="mt-1 text-[13px] tabular-nums text-text-muted">
                  {shortRange(g.start, g.end, year)} · {g.type} · {g.subEntity}
                </p>
                <span className="sr-only">{LABEL[g.status]}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

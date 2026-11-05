import { useEffect, useMemo, useState } from 'react';
import { History, LayoutGrid, Library, List, Network, Pencil, Plus, SearchX, SlidersHorizontal, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatNumber';
import { STORAGE_KEYS } from '@/config/app';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { programsApi } from '@/services/api';
import { Avatar, Button, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { ResponsiveList } from '@/components/lists/ResponsiveList';
import { ProgramLogo } from './components/ProgramLogo';
import { ProgramCard } from './components/ProgramCard';
import { AddContentButton } from './components/AddContentButton';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { ProgramModal } from './components/ProgramModal';
import { DETAIL_TITLE_ID, ProgramDetails, describeChange } from './components/ProgramDrawer';

const EMPTY_FILTERS = { status: 'all', categories: [], entities: [] };
const rupees = (n) => formatCurrency(n, 'INR');
const firstName = (name = '') => name.split(' ')[0];
// The summary pills filter by these: added in the last 30 days / changed in the last 7 days
const isNew = (p) => Date.now() - new Date(p.createdAt) < 30 * 864e5;
const isChanged = (p) => Date.now() - new Date(p.history[0]?.at ?? p.createdAt) < 7 * 864e5;
const PERIOD = { new: isNew, changed: isChanged };

function applyFilters(list, f, q) {
  return list.filter(
    (p) =>
      (f.status === 'all' || PERIOD[f.status](p)) &&
      (!f.categories.length || f.categories.includes(p.category)) &&
      (!f.entities.length || f.entities.includes(p.entity)) &&
      (!q || [p.name, p.category, p.entityName, p.subName].some((v) => v?.toLowerCase().includes(q))),
  );
}

/**
 * Manage Content: the program list. One frame like All Clients — a toolbar (summary pills that filter: all / new this
 * month / changed this week, search, Filters, Add program) over a sortable table (cards on phones). Each row shows the
 * program with its category, its entity › sub-entity, fee per person and the last change, with "Add content" as the
 * row's main action. A row opens a drawer with the details and the history of changes.
 * Add content opens the program's content page (/content/:id).
 */
export default function ManageContent() {
  const { data, loading, error, reload, setData } = useAsync(() => programsApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isPhone = useIsMobile();
  // Table or cards (remembered); phones always get cards
  const [view, setView] = useLocalStorage(STORAGE_KEYS.contentView, 'table');

  // Last modified first — the table's default sort, so both views list programs in the same order
  const rows = useMemo(
    () => applyFilters(all, filters, q).sort((a, b) => new Date(b.history[0]?.at ?? b.createdAt) - new Date(a.history[0]?.at ?? a.createdAt)),
    [all, filters, q],
  );
  const counts = useMemo(() => ({ all: all.length, new: all.filter(isNew).length, changed: all.filter(isChanged).length }), [all]);
  const entityNames = useMemo(() => Object.fromEntries(all.map((p) => [p.entity, p.entityName])), [all]);

  const chips = [
    ...filters.categories.map((c) => ({ key: `c-${c}`, label: c, clear: { categories: filters.categories.filter((x) => x !== c) } })),
    ...filters.entities.map((e) => ({ key: `e-${e}`, label: entityNames[e] ?? e, clear: { entities: filters.entities.filter((x) => x !== e) } })),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // A saved program replaces its row (or joins the top) without reloading the list
  const upsert = (saved) => setData((list = []) => (list.some((p) => p.id === saved.id) ? list.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...list]));

  // Add / edit program happen in a modal; the details in a drawer. Each keeps its program while closing.
  // From the drawer, the modal replaces it (overlays don't stack) and the drawer comes back when the modal closes.
  const navigate = useNavigate();
  const [form, setForm] = useState({ open: false, program: null, back: false });
  const [detail, setDetail] = useState({ open: false, id: null });
  const add = () => setForm({ open: true, program: null, back: false });
  const edit = (p, back = false) => setForm({ open: true, program: p, back });
  // Add content opens the program's own page (Upload Content / Content Permissions)
  const addContent = (p) => navigate(`/content/${p.id}`);
  const open = (p) => setDetail({ open: true, id: p.id });
  const closeDetail = () => setDetail((d) => ({ ...d, open: false }));
  const fromDrawer = (action) => () => {
    closeDetail();
    action(detailProgram, true);
  };
  const closeModal = (state, setState) => () => {
    setState((m) => ({ ...m, open: false }));
    if (state.back) setDetail((d) => ({ ...d, open: true }));
  };
  const detailProgram = all.find((p) => p.id === detail.id);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Program',
        primary: true,
        sortable: true,
        hideable: false,
        wrap: true,
        // The widest column (names truncate, so without this the table would squeeze it first)
        width: '30%',
        cell: (p) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <ProgramLogo program={p} />
            {/* One line each; a long name ends in "…" and shows in full on hover */}
            {/* In a table a truncated line's max width is also its minimum, so it steps up with the screen */}
            <div className="min-w-[8rem] max-w-[10rem] xl:max-w-[12rem] min-[1440px]:max-w-[13rem]">
              <p className="truncate text-sm font-semibold leading-5 text-text transition-colors row-hover:text-primary-text" title={p.name}>
                {p.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-text-muted">
                {p.category}
                {/* While the Entity column is hidden (narrower screens) the sub-entity rides here */}
                <span className="xl:hidden"> · {p.subName}</span>
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'mapping',
        header: 'Entity › Sub-entity',
        sortable: true,
        wrap: true,
        hideBelow: 'xl',
        accessor: (p) => p.entityName,
        cell: (p) => (
          <div className="min-w-0 max-w-[11rem]">
            <p className="truncate text-[13px] leading-5 text-text" title={p.entityName}>
              {p.entityName}
            </p>
            <p className="truncate text-xs text-text-muted" title={p.subName}>
              › {p.subName}
            </p>
          </div>
        ),
      },
      {
        key: 'fee',
        header: 'Fee / person',
        sortable: true,
        cell: (p) => <span className="text-[13px] font-semibold tabular-nums text-text">{rupees(p.fee)}</span>,
      },
      // Created by + Created on share one column (name, date under it). Columns drop out as the frame narrows —
      // Created first (from 1400px), then Entity (xl), then Last modified (lg) — so Add content and Edit always stay in view.
      // Last modified = the latest history entry (what changed shows on hover)
      {
        key: 'createdAt',
        header: 'Created by / on',
        sortable: true,
        hideBelow: 'wide',
        accessor: (p) => new Date(p.createdAt),
        cell: (p) => (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar name={p.createdBy} size="xs" />
            <div className="min-w-0">
              <p className="max-w-[7rem] truncate text-[13px] leading-5 text-text" title={p.createdBy}>
                {p.createdBy}
              </p>
              <p className="text-xs tabular-nums text-text-muted" title={formatRelative(p.createdAt)}>
                {formatDate(p.createdAt)}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'lastChange',
        header: 'Last modified',
        sortable: true,
        hideBelow: 'lg',
        accessor: (p) => new Date(p.history[0]?.at ?? p.createdAt),
        cell: (p) => {
          const h = p.history[0];
          return (
            <div className="min-w-0" title={`${describeChange(h).title} · ${h.by}`}>
              <p className="text-[13px] leading-5 tabular-nums text-text">{formatDate(h.at)}</p>
              <p className="text-xs text-text-muted">by {firstName(h.by)}</p>
            </div>
          );
        },
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        // No hover arrow here (unlike All Clients): its room goes to Add content + Edit so they always fit
        cell: (p) => (
          <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-1">
            <AddContentButton onClick={() => addContent(p)} />
            <IconButton icon={Pencil} label={`Edit ${p.name}`} size="sm" onClick={() => edit(p)} />
          </span>
        ),
      },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={Library}
        title="No programs yet"
        description="Programs you add will appear here."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add program
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No programs match"
        description="Try a different search or loosen the filters."
        action={
          <Button variant="secondary" onClick={clearAll}>
            Clear search & filters
          </Button>
        }
      />
    );

  return (
    <div className="flex flex-col lg:flex-1">
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        {/* The same toolbar as All Clients: summary pills (each one filters), search, Filters, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Program summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All programs', value: counts.all, title: 'Show all programs', tone: 'blue', filterable: true },
                  { key: 'new', label: 'New this month', value: counts.new, title: 'Added in the last 30 days', tone: 'violet', filterable: true },
                  { key: 'changed', label: 'Changed this week', value: counts.changed, title: 'Edited in the last 7 days', tone: 'green', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search program, category, entity…"
            searchLabel="Search programs"
            // Phones pick New / Changed in the drawer (no pills there), so it counts on the Filters badge
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            leadingActions={
              // Icons-only switch between search and Filters, as on the client Projects tab; hidden on phones (cards only there)
              <SegmentedControl
                size="sm"
                ariaLabel="View"
                className="hidden md:flex"
                value={view}
                onChange={setView}
                className="hidden md:flex"
                tabs={[
                  { value: 'table', label: <span className="sr-only">Table view</span>, icon: List, tooltip: 'Table view' },
                  { value: 'cards', label: <span className="sr-only">Card view</span>, icon: LayoutGrid, tooltip: 'Card view' },
                ]}
              />
            }
            addLabel="Add program"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'programs' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          cards={view === 'cards'}
          gridClassName="lg:grid-cols-3 sm:gap-5"
          columns={columns}
          data={rows}
          renderCard={(p) => <ProgramCard program={p} onOpen={() => open(p)} onEdit={() => edit(p)} onAddContent={() => addContent(p)} />}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={open}
          defaultSort={{ key: 'lastChange', direction: 'desc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Programs"
        />
      </div>

      <Drawer open={detail.open && Boolean(detailProgram)} onClose={closeDetail} header={false} labelledBy={DETAIL_TITLE_ID}>
        {detailProgram && (
          <ProgramDetails key={detailProgram.id} program={detailProgram} onClose={closeDetail} onAddContent={() => addContent(detailProgram)} onEdit={fromDrawer(edit)} />
        )}
      </Drawer>

      <ProgramModal open={form.open} program={form.program} onClose={closeModal(form, setForm)} onSaved={upsert} />

      <ProgramFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} programs={all} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N programs" (live count) */
function ProgramFiltersDrawer({ open, onClose, filters, onApply, programs, search }) {
  // Phones: the All / New this month / Changed this week pills aren't shown there, so the drawer offers them
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(programs, draft, search).length;

  const categories = useMemo(() => [...new Set(programs.map((p) => p.category))].sort().map((c) => ({ value: c, label: c })), [programs]);
  const entities = useMemo(
    () =>
      Object.entries(Object.fromEntries(programs.map((p) => [p.entity, p.entityName])))
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label })),
    [programs],
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter programs"
      description="By category or entity"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_FILTERS, status: showStatus ? 'all' : draft.status })}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching programs' : `Show ${count} ${count === 1 ? 'program' : 'programs'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {showStatus && (
          <FilterSection icon={History} tone="green" title="Recent" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'new', label: 'New this month' },
                { value: 'changed', label: 'Changed this week' },
              ]}
              value={draft.status}
              onChange={(status) => set({ status })}
              ariaLabel="Recent"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Tag} tone="violet" title="Category" onClear={draft.categories.length ? () => set({ categories: [] }) : undefined}>
          <MultiSelect options={categories} value={draft.categories} onChange={(c) => set({ categories: c })} placeholder="Any category" searchPlaceholder="Search categories…" />
        </FilterSection>
        <FilterSection icon={Network} tone="blue" title="Entity" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={entities} value={draft.entities} onChange={(e) => set({ entities: e })} placeholder="Any entity" searchPlaceholder="Search entities…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

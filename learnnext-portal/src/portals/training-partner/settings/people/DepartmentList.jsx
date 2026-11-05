import { useEffect, useMemo, useState } from 'react';
import { Building, CircleDot, Network, SearchX, SlidersHorizontal } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { peopleMastersApi } from '@/services/api';
import { Button, Drawer, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { IconTile } from '@/components/ui/CardHeader';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';

const EMPTY_FILTERS = { status: 'all', level: 'all', parents: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (d) =>
      (f.status === 'all' || d.status === f.status) &&
      (f.level === 'all' || (f.level === 'top' ? !d.parent : Boolean(d.parent))) &&
      (!f.parents.length || f.parents.includes(d.parent)) &&
      (!q || [d.name, d.parent].some((v) => v?.toLowerCase().includes(q))),
  );
}

/** Parent name with a quiet icon, or a faint dash for a top-level department */
function Parent({ name }) {
  return name ? (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-text">
      <Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="truncate">{name}</span>
    </span>
  ) : (
    <span className="text-text-muted/70" aria-label="Top level">
      —
    </span>
  );
}

/**
 * Department master (Settings → People → Department): read-only — synced from the CRM portal, so there's no Add, Edit
 * or Delete (a note under the toolbar says so). The old list's columns — Department, Parent department, Status (the
 * CRM's approval state). Same frame as All Clients: summary pills (All / Approved / Pending / Rejected filter the list),
 * search, a Filters drawer, and a sortable paginated table (cards on phones).
 */
export default function DepartmentList() {
  const { data, loading, error, reload } = useAsync(() => peopleMastersApi.departments(), []);
  const all = useMemo(() => data?.rows ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's Status filter counts as an applied filter there
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(
    () => ({
      all: all.length,
      approved: all.filter((d) => d.status === 'approved').length,
      pending: all.filter((d) => d.status === 'pending').length,
      rejected: all.filter((d) => d.status === 'rejected').length,
    }),
    [all],
  );

  const chips = [
    ...(filters.level !== 'all' ? [{ key: 'level', label: filters.level === 'top' ? 'Top level' : 'Has a parent', clear: { level: 'all' } }] : []),
    ...filters.parents.map((p) => ({ key: `p-${p}`, label: `Under ${p}`, clear: { parents: filters.parents.filter((x) => x !== p) } })),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Department',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (d) => (
          <div className="flex min-w-0 items-center gap-3">
            <IconTile icon={Building} tone="primary" className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{d.name}</p>
              <p className="truncate text-xs text-text-muted">
                {d.designations} {d.designations === 1 ? 'designation' : 'designations'}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'parent', header: 'Parent department', sortable: true, hideBelow: 'md', cell: (d) => <Parent name={d.parent} /> },
      { key: 'status', header: 'Status', sortable: true, cell: (d) => <StatusBadge status={d.status} /> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Building} title="No departments yet" description="Departments appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No departments match"
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
        {/* The same toolbar as All Clients — no Add: the list comes from the CRM */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Department summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All departments', value: counts.all, title: 'Show all departments', tone: 'blue', filterable: true },
                  { key: 'approved', label: 'Approved', value: counts.approved, title: 'Show approved departments', tone: 'green', filterable: true },
                  { key: 'pending', label: 'Pending', value: counts.pending, title: 'Show departments awaiting approval in the CRM', tone: 'violet', filterable: true },
                  { key: 'rejected', label: 'Rejected', value: counts.rejected, title: 'Show rejected departments', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search department…"
            searchLabel="Search departments"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'departments' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="departments" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(d) => (
            <GridCard
              media={<IconTile icon={Building} tone="primary" className="size-14 rounded-2xl" />}
              title={d.name}
              subtitle={`${d.designations} ${d.designations === 1 ? 'designation' : 'designations'}`}
              badges={<StatusBadge status={d.status} />}
              footer={<CardFooterRow lead={<Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{d.parent ? `Under ${d.parent}` : 'Top level'}</CardFooterRow>}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Departments"
        />
      </div>

      <DepartmentFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} departments={all} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N departments" (live count) */
function DepartmentFiltersDrawer({ open, onClose, filters, onApply, departments, counts, search }) {
  // Status only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(departments, draft, search).length;
  const parentOptions = [...new Set(departments.map((d) => d.parent).filter(Boolean))].map((p) => ({
    value: p,
    label: p,
    description: `${departments.filter((d) => d.parent === p).length} under it`,
  }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter departments"
      description="By status, level or parent"
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
            {count === 0 ? 'No matching departments' : `Show ${count} ${count === 1 ? 'department' : 'departments'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {showStatus && (
          <FilterSection icon={CircleDot} tone="amber" title="Status" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All', count: counts.all },
                { value: 'approved', label: 'Approved', count: counts.approved },
                { value: 'pending', label: 'Pending', count: counts.pending },
                { value: 'rejected', label: 'Rejected', count: counts.rejected },
              ]}
              value={draft.status}
              onChange={(status) => set({ status })}
              ariaLabel="Status"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Network} tone="blue" title="Parent department" onClear={draft.level !== 'all' || draft.parents.length ? () => set({ level: 'all', parents: [] }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'top', label: 'Top level' },
              { value: 'child', label: 'Has a parent' },
            ]}
            value={draft.level}
            onChange={(level) => set({ level, parents: level === 'top' ? [] : draft.parents })}
            ariaLabel="Level"
            fullWidth
          />
          {draft.level !== 'top' && (
            <MultiSelect options={parentOptions} value={draft.parents} onChange={(v) => set({ parents: v })} placeholder="Under any parent" searchPlaceholder="Search departments…" />
          )}
        </FilterSection>
      </div>
    </Drawer>
  );
}

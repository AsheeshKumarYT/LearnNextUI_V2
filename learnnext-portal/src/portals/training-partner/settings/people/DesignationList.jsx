import { useEffect, useMemo, useState } from 'react';
import { Building, CircleDot, IdCard, SearchX, SlidersHorizontal, ToggleRight, Waypoints } from 'lucide-react';
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

const EMPTY_FILTERS = { status: 'all', enabled: 'all', departments: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (d) =>
      (f.status === 'all' || d.status === f.status) &&
      (f.enabled === 'all' || (f.enabled === 'yes') === d.enabled) &&
      (!f.departments.length || f.departments.includes(d.department)) &&
      (!q || [d.name, d.department, d.parent].some((v) => v?.toLowerCase().includes(q))),
  );
}

/** Enabled as a small Yes / No badge */
export function EnabledBadge({ enabled }) {
  return <StatusBadge status={enabled ? 'active' : 'inactive'} label={enabled ? 'Yes' : 'No'} />;
}

/** A name with a quiet icon, or a faint dash when empty */
function Named({ icon: Icon, name }) {
  return name ? (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-text">
      <Icon className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="truncate">{name}</span>
    </span>
  ) : (
    <span className="text-text-muted/70">—</span>
  );
}

/**
 * Designation master (Settings → People → Designation): read-only — synced from the CRM portal, so there's no Add, Edit
 * or Delete (a note under the toolbar says so). The old list's columns — Department, Designation, Parent designation,
 * Enable status, Status (the CRM's approval state). Same frame as All Clients: summary pills (All / Approved / Pending /
 * Rejected filter the list), search, a Filters drawer, and a sortable paginated table (cards on phones).
 */
export default function DesignationList() {
  const { data, loading, error, reload } = useAsync(() => peopleMastersApi.designations(), []);
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
    ...(filters.enabled !== 'all' ? [{ key: 'en', label: filters.enabled === 'yes' ? 'Enabled' : 'Disabled', clear: { enabled: 'all' } }] : []),
    ...filters.departments.map((d) => ({ key: `d-${d}`, label: d, clear: { departments: filters.departments.filter((x) => x !== d) } })),
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
        header: 'Designation',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (d) => (
          <div className="flex min-w-0 items-center gap-3">
            <IconTile icon={IdCard} tone="violet" className="size-10" />
            <div className="min-w-0">
              <p className="max-w-[16rem] truncate text-sm font-semibold text-text">{d.name}</p>
              <p className="max-w-[16rem] truncate text-xs text-text-muted lg:hidden">{d.department}</p>
            </div>
          </div>
        ),
      },
      { key: 'department', header: 'Department', sortable: true, hideBelow: 'lg', cell: (d) => <Named icon={Building} name={d.department} /> },
      { key: 'parent', header: 'Parent designation', sortable: true, hideBelow: 'md', cell: (d) => <Named icon={Waypoints} name={d.parent} /> },
      { key: 'enabled', header: 'Enabled', sortable: true, hideBelow: 'xl', accessor: (d) => (d.enabled ? 1 : 0), cell: (d) => <EnabledBadge enabled={d.enabled} /> },
      { key: 'status', header: 'Status', sortable: true, cell: (d) => <StatusBadge status={d.status} /> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={IdCard} title="No designations yet" description="Designations appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No designations match"
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
                ariaLabel="Designation summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All designations', value: counts.all, title: 'Show all designations', tone: 'blue', filterable: true },
                  { key: 'approved', label: 'Approved', value: counts.approved, title: 'Show approved designations', tone: 'green', filterable: true },
                  { key: 'pending', label: 'Pending', value: counts.pending, title: 'Show designations awaiting approval in the CRM', tone: 'violet', filterable: true },
                  { key: 'rejected', label: 'Rejected', value: counts.rejected, title: 'Show rejected designations', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search designation or department…"
            searchLabel="Search designations"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'designations' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="designations" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(d) => (
            <GridCard
              media={<IconTile icon={IdCard} tone="violet" className="size-14 rounded-2xl" />}
              title={d.name}
              subtitle={d.department}
              badges={
                <>
                  <StatusBadge status={d.status} />
                  {!d.enabled && <StatusBadge status="inactive" label="Disabled" />}
                </>
              }
              footer={
                <CardFooterRow lead={<Waypoints className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{d.parent ? `Reports to ${d.parent}` : 'No parent designation'}</CardFooterRow>
              }
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Designations"
        />
      </div>

      <DesignationFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} designations={all} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N designations" (live count) */
function DesignationFiltersDrawer({ open, onClose, filters, onApply, designations, counts, search }) {
  // Status only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(designations, draft, search).length;
  const departmentOptions = [...new Set(designations.map((d) => d.department))]
    .sort()
    .map((d) => ({ value: d, label: d, description: `${designations.filter((x) => x.department === d).length} designations` }));
  const enabledCount = designations.filter((d) => d.enabled).length;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter designations"
      description="By status, department or enabled"
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
            {count === 0 ? 'No matching designations' : `Show ${count} ${count === 1 ? 'designation' : 'designations'}`}
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
        <FilterSection icon={Building} tone="blue" title="Department" onClear={draft.departments.length ? () => set({ departments: [] }) : undefined}>
          <MultiSelect options={departmentOptions} value={draft.departments} onChange={(v) => set({ departments: v })} placeholder="Any department" searchPlaceholder="Search departments…" />
        </FilterSection>
        <FilterSection icon={ToggleRight} tone="green" title="Enabled" onClear={draft.enabled !== 'all' ? () => set({ enabled: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'All', count: designations.length },
              { value: 'yes', label: 'Yes', count: enabledCount },
              { value: 'no', label: 'No', count: designations.length - enabledCount },
            ]}
            value={draft.enabled}
            onChange={(enabled) => set({ enabled })}
            ariaLabel="Enabled"
            fullWidth
          />
        </FilterSection>
      </div>
    </Drawer>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Building2, CircleDot, SearchX, SlidersHorizontal, Unlink, Users } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { sapBpApi } from '@/services/api';
import { Avatar, Button, Drawer, ListToolbar, MultiSelect, SegmentedControl } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';

const EMPTY_FILTERS = { mapping: 'all', entities: [], missingIn: [] };

/** The entity columns in view: the ones picked in the Entity filter, or all of them */
const shownUnits = (units, f) => (f.entities.length ? units.filter((u) => f.entities.includes(u.key)) : units);
const missingCount = (t, units) => units.filter((u) => !t.codes[u.key]).length;

function applyFilters(list, units, f, q) {
  const cols = shownUnits(units, f);
  return list.filter(
    (t) =>
      (f.mapping === 'all' || (f.mapping === 'complete' ? missingCount(t, cols) === 0 : missingCount(t, cols) > 0)) &&
      (!f.missingIn.length || f.missingIn.some((k) => !t.codes[k])) &&
      (!q || t.name.toLowerCase().includes(q) || cols.some((u) => t.codes[u.key]?.toLowerCase().includes(q))),
  );
}

/**
 * SAP BP master (Settings → Finance → SAP BP): every trainer's SAP Business Partner code (alphanumeric) for each
 * entity, as in the old list — Trainer name, then one column per entity. Read-only (the codes come from SAP), so
 * there's no Add. Same frame as All Clients: summary pills (All / Fully mapped / Missing codes filter the list), search
 * (name or code), a Filters drawer, and a sortable, paginated table (cards on phones). The Entity filter narrows the
 * table to those entities' columns, and "mapped / missing" then counts only them. A missing code shows as "Not set".
 */
export default function SapBpList() {
  const { data, loading, error, reload } = useAsync(() => sapBpApi.list(), []);
  const units = useMemo(() => data?.units ?? [], [data]);
  const all = useMemo(() => data?.trainers ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's Mapping filter counts as an applied filter there
  const isPhone = useIsMobile();

  const cols = useMemo(() => shownUnits(units, filters), [units, filters]);
  const rows = useMemo(() => applyFilters(all, units, filters, q), [all, units, filters, q]);
  const counts = useMemo(() => {
    const complete = all.filter((t) => missingCount(t, cols) === 0).length;
    return { all: all.length, complete, missing: all.length - complete };
  }, [all, cols]);

  // The mapping pill shows as pressed (as status does on All Clients); drawer filters show as chips
  const label = (k) => units.find((u) => u.key === k)?.label;
  const chips = [
    ...filters.entities.map((k) => ({ key: `e-${k}`, label: label(k), clear: { entities: filters.entities.filter((x) => x !== k) } })),
    ...filters.missingIn.map((k) => ({ key: `m-${k}`, label: `No ${label(k)} code`, clear: { missingIn: filters.missingIn.filter((x) => x !== k) } })),
  ];
  const filtered = chips.length > 0 || filters.mapping !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // Trainer name, then one column per entity in view (as in the old list)
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Trainer name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (t) => {
          const missing = missingCount(t, cols);
          return (
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={t.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{t.name}</p>
                <p className="truncate text-xs text-text-muted">{missing === 0 ? `All ${cols.length} codes set` : `${cols.length - missing} of ${cols.length} codes set`}</p>
              </div>
            </div>
          );
        },
      },
      ...cols.map((u) => ({
        key: u.key,
        header: u.label,
        sortable: true,
        accessor: (t) => t.codes[u.key] || '',
        cell: (t) =>
          t.codes[u.key] ? (
            <CodeChip code={t.codes[u.key]} />
          ) : (
            <span className="text-xs text-text-muted/80" title={`No ${u.label} code yet`}>
              Not set
            </span>
          ),
      })),
    ],
    [cols],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Users} title="No trainers yet" description="Trainers and their SAP codes appear here once they're synced from SAP." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No trainers match"
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
        {/* The same toolbar as All Clients, without Add (codes come from SAP) */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="SAP BP summary"
                className={className}
                loading={loading}
                value={filters.mapping}
                onChange={(mapping) => setFilters((f) => ({ ...f, mapping }))}
                items={[
                  { key: 'all', label: 'All trainers', value: counts.all, title: 'Show all trainers', tone: 'blue', filterable: true },
                  { key: 'complete', label: 'Fully mapped', value: counts.complete, title: 'Trainers with a code for every entity in view', tone: 'green', filterable: true },
                  { key: 'missing', label: 'Missing codes', value: counts.missing, title: 'Trainers missing at least one code', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search trainer or SAP code…"
            searchLabel="Search trainers"
            filterCount={chips.length + (isPhone && filters.mapping !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'trainers' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        {/* Table from tablet up; on phones the same cards as All Clients, each entity's code listed in the card */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(t) => {
            const missing = missingCount(t, cols);
            return (
              <GridCard
                media={<Avatar name={t.name} size="lg" />}
                title={t.name}
                subtitle={missing === 0 ? `All ${cols.length} codes set` : `${cols.length - missing} of ${cols.length} codes set`}
                footer={
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {cols.map((u) => (
                      <div key={u.key} className="min-w-0">
                        <dt className="truncate text-xs text-text-muted">{u.label}</dt>
                        <dd className="mt-1">{t.codes[u.key] ? <CodeChip code={t.codes[u.key]} /> : <span className="text-xs text-text-muted/80">Not set</span>}</dd>
                      </div>
                    ))}
                  </dl>
                }
              />
            );
          }}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="SAP Business Partner codes"
        />
      </div>

      <SapBpFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} trainers={all} units={units} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N trainers" (live count) */
function SapBpFiltersDrawer({ open, onClose, filters, onApply, trainers, units, search }) {
  // Mapping only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(trainers, units, draft, search).length;

  // Mapping counts follow the entities picked in the draft
  const cols = shownUnits(units, draft);
  const complete = trainers.filter((t) => missingCount(t, cols) === 0).length;
  const entityOptions = units.map((u) => ({ value: u.key, label: u.label, description: `${trainers.filter((t) => t.codes[u.key]).length} of ${trainers.length} trainers have a code` }));
  const missingOptions = units.map((u) => ({ value: u.key, label: u.label, description: `${trainers.filter((t) => !t.codes[u.key]).length} without a code` }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter trainers"
      description="By entity, mapping or a missing code"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_FILTERS, mapping: showStatus ? 'all' : draft.mapping })}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching trainers' : `Show ${count} ${count === 1 ? 'trainer' : 'trainers'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FilterSection icon={Building2} tone="blue" title="Entity" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={entityOptions} value={draft.entities} onChange={(v) => set({ entities: v })} placeholder="All entities" searchPlaceholder="Search entities…" />
        </FilterSection>
        {showStatus && (
          <FilterSection icon={CircleDot} tone="amber" title="Mapping" onClear={draft.mapping !== 'all' ? () => set({ mapping: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All', count: trainers.length },
                { value: 'complete', label: 'Fully mapped', count: complete },
                { value: 'missing', label: 'Missing', count: trainers.length - complete },
              ]}
              value={draft.mapping}
              onChange={(mapping) => set({ mapping })}
              ariaLabel="Mapping"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Unlink} tone="violet" title="Missing a code for" onClear={draft.missingIn.length ? () => set({ missingIn: [] }) : undefined}>
          <MultiSelect options={missingOptions} value={draft.missingIn} onChange={(v) => set({ missingIn: v })} placeholder="Any entity" searchPlaceholder="Search entities…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

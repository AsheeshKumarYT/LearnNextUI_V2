import { useEffect, useMemo, useState } from 'react';
import { Globe, Map, ReceiptText, SearchX, SlidersHorizontal } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { locationsApi } from '@/services/api';
import { Button, Drawer, ListToolbar, MultiSelect, SegmentedControl } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { NotApplicable, PlaceIcon } from './locationShared';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';

const EMPTY_FILTERS = { gst: 'all', countries: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (s) =>
      (f.gst === 'all' || (f.gst === 'with' ? Boolean(s.gst) : !s.gst)) &&
      (!f.countries.length || f.countries.includes(s.country)) &&
      (!q || [s.name, s.country, s.gst].some((v) => v?.toLowerCase().includes(q))),
  );
}

/**
 * State master (Settings → Locations → State): read-only — synced from the CRM portal, so there's no Add or Edit (a note
 * under the toolbar says so). The old list's columns — Country name, State name, GST code ("NA" outside India) — plus
 * how many cities each has. Same frame as All Clients: summary pills (All / With GST code / No GST code filter the
 * list), search, a Filters drawer (country, GST), and a sortable paginated table (cards on phones).
 */
export default function StateList() {
  const { data, loading, error, reload } = useAsync(() => locationsApi.list(), []);
  const all = useMemo(() => data?.states ?? [], [data]);
  const countries = useMemo(() => data?.countries ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's GST code filter counts as an applied filter there
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(() => ({ all: all.length, with: all.filter((s) => s.gst).length, without: all.filter((s) => !s.gst).length }), [all]);

  const chips = filters.countries.map((c) => ({ key: c, label: c, clear: { countries: filters.countries.filter((x) => x !== c) } }));
  const filtered = chips.length > 0 || filters.gst !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'State name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (s) => (
          <div className="flex min-w-0 items-center gap-3">
            <PlaceIcon kind="state" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{s.name}</p>
              <p className="truncate text-xs text-text-muted">
                {s.cities} {s.cities === 1 ? 'city' : 'cities'}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'country',
        header: 'Country name',
        sortable: true,
        cell: (s) => (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-text">
            <Globe className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="truncate">{s.country}</span>
          </span>
        ),
      },
      { key: 'gst', header: 'GST code', sortable: true, cell: (s) => (s.gst ? <CodeChip code={s.gst} /> : <NotApplicable />) },
      { key: 'cities', header: 'Cities', sortable: true, hideBelow: 'md', cell: (s) => <span className="text-[13px] tabular-nums">{s.cities}</span> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Map} title="No states yet" description="States appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No states match"
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
                ariaLabel="State summary"
                className={className}
                loading={loading}
                value={filters.gst}
                onChange={(gst) => setFilters((f) => ({ ...f, gst }))}
                items={[
                  { key: 'all', label: 'All states', value: counts.all, title: 'Show all states', tone: 'blue', filterable: true },
                  { key: 'with', label: 'With GST code', value: counts.with, title: 'States with a GST state code', tone: 'green', filterable: true },
                  { key: 'without', label: 'No GST code', value: counts.without, title: 'States without a GST code (outside India)', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search state, country or GST code…"
            searchLabel="Search states"
            filterCount={chips.length + (isPhone && filters.gst !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'states' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="states" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(s) => (
            <GridCard
              media={<PlaceIcon kind="state" className="size-14 rounded-2xl" />}
              title={s.name}
              subtitle={s.country}
              badges={s.gst ? <CodeChip code={s.gst} /> : <NotApplicable />}
              footer={
                <CardFooterRow lead={<ReceiptText className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>
                  {s.gst ? `GST state code ${s.gst}` : 'No GST code'} · {s.cities} {s.cities === 1 ? 'city' : 'cities'}
                </CardFooterRow>
              }
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'country', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="States"
        />
      </div>

      <StateFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} states={all} countries={countries} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N states" (live count) */
function StateFiltersDrawer({ open, onClose, filters, onApply, states, countries, counts, search }) {
  // GST code only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(states, draft, search).length;
  const countryOptions = countries.filter((c) => c.states > 0).map((c) => ({ value: c.name, label: c.name, description: `${c.states} ${c.states === 1 ? 'state' : 'states'}` }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter states"
      description="By country or GST code"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_FILTERS, gst: showStatus ? 'all' : draft.gst })}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching states' : `Show ${count} ${count === 1 ? 'state' : 'states'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FilterSection icon={Globe} tone="blue" title="Country" onClear={draft.countries.length ? () => set({ countries: [] }) : undefined}>
          <MultiSelect options={countryOptions} value={draft.countries} onChange={(v) => set({ countries: v })} placeholder="Any country" searchPlaceholder="Search countries…" />
        </FilterSection>
        {showStatus && (
          <FilterSection icon={ReceiptText} tone="green" title="GST code" onClear={draft.gst !== 'all' ? () => set({ gst: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All', count: counts.all },
                { value: 'with', label: 'With code', count: counts.with },
                { value: 'without', label: 'NA', count: counts.without },
              ]}
              value={draft.gst}
              onChange={(gst) => set({ gst })}
              ariaLabel="GST code"
              fullWidth
            />
          </FilterSection>
        )}
      </div>
    </Drawer>
  );
}

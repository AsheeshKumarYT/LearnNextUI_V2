import { useEffect, useMemo, useState } from 'react';
import { Globe, Map, MapPin, SearchX, SlidersHorizontal } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { locationsApi } from '@/services/api';
import { Button, Drawer, ListToolbar, MultiSelect } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { PlaceIcon } from './locationShared';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';

const EMPTY_FILTERS = { countries: [], states: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (c) =>
      (!f.countries.length || f.countries.includes(c.country)) &&
      (!f.states.length || f.states.includes(`${c.country}|${c.state}`)) &&
      (!q || [c.name, c.state, c.country].some((v) => v.toLowerCase().includes(q))),
  );
}

/** Place name with a quiet icon, for the State / Country columns */
function Place({ icon: Icon, children }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-text">
      <Icon className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/**
 * City master (Settings → Locations → City): read-only — synced from the CRM portal, so there's no Add or Edit (a note
 * under the toolbar says so). The old list's columns — Country name, State name, City name. Same frame as All Clients:
 * summary pills, search, a Filters drawer (country, state), and a sortable paginated table (cards on phones).
 */
export default function CityList() {
  const { data, loading, error, reload } = useAsync(() => locationsApi.list(), []);
  const all = useMemo(() => data?.cities ?? [], [data]);
  const countries = useMemo(() => data?.countries ?? [], [data]);
  const states = useMemo(() => data?.states ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);

  const chips = [
    ...filters.countries.map((c) => ({ key: `c-${c}`, label: c, clear: { countries: filters.countries.filter((x) => x !== c) } })),
    ...filters.states.map((k) => ({ key: `s-${k}`, label: k.split('|')[1], clear: { states: filters.states.filter((x) => x !== k) } })),
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
        header: 'City name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (c) => (
          <div className="flex min-w-0 items-center gap-3">
            <PlaceIcon kind="city" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{c.name}</p>
              <p className="truncate text-xs text-text-muted md:hidden">
                {c.state} · {c.country}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'state', header: 'State name', sortable: true, hideBelow: 'md', cell: (c) => <Place icon={Map}>{c.state}</Place> },
      { key: 'country', header: 'Country name', sortable: true, hideBelow: 'md', cell: (c) => <Place icon={Globe}>{c.country}</Place> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={MapPin} title="No cities yet" description="Cities appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No cities match"
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
                ariaLabel="City summary"
                className={className}
                loading={loading}
                value="all"
                onChange={clearAll}
                items={[
                  { key: 'all', label: 'All cities', value: all.length, title: 'Show all cities', tone: 'blue', filterable: true },
                  { key: 'countries', label: 'Countries', value: countries.filter((c) => c.cities > 0).length, tone: 'violet' },
                  { key: 'states', label: 'States', value: states.length, tone: 'green' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search city, state or country…"
            searchLabel="Search cities"
            filterCount={chips.length}
            onOpenFilters={() => setFiltersOpen(true)}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'cities' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="cities" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(c) => (
            <GridCard
              media={<PlaceIcon kind="city" className="size-14 rounded-2xl" />}
              title={c.name}
              subtitle={c.state}
              footer={<CardFooterRow lead={<Globe className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{c.country}</CardFooterRow>}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'country', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Cities"
        />
      </div>

      <CityFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} cities={all} countries={countries} states={states} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N cities" (live count) */
function CityFiltersDrawer({ open, onClose, filters, onApply, cities, countries, states, search }) {
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(cities, draft, search).length;

  const countryOptions = countries.filter((c) => c.cities > 0).map((c) => ({ value: c.name, label: c.name, description: `${c.cities} ${c.cities === 1 ? 'city' : 'cities'}` }));
  // States narrow to the picked countries (a state name can repeat across countries, so the key carries both)
  const stateOptions = states.filter((s) => !draft.countries.length || draft.countries.includes(s.country)).map((s) => ({ value: `${s.country}|${s.name}`, label: s.name, description: s.country }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter cities"
      description="By country or state"
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
            {count === 0 ? 'No matching cities' : `Show ${count} ${count === 1 ? 'city' : 'cities'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FilterSection icon={Globe} tone="blue" title="Country" onClear={draft.countries.length ? () => set({ countries: [], states: [] }) : undefined}>
          <MultiSelect
            options={countryOptions}
            value={draft.countries}
            // Dropping a country drops its states from the filter too
            onChange={(v) => set({ countries: v, states: draft.states.filter((k) => !v.length || v.includes(k.split('|')[0])) })}
            placeholder="Any country"
            searchPlaceholder="Search countries…"
          />
        </FilterSection>
        <FilterSection icon={Map} tone="violet" title="State" onClear={draft.states.length ? () => set({ states: [] }) : undefined}>
          <MultiSelect options={stateOptions} value={draft.states} onChange={(v) => set({ states: v })} placeholder="Any state" searchPlaceholder="Search states…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

import { useMemo, useState } from 'react';
import { Globe, Phone, SearchX } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { locationsApi } from '@/services/api';
import { Button, ListToolbar } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { PlaceIcon } from './locationShared';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';

/** Mobile (dialling) code as "+965" with a phone icon */
function DialCode({ dial }) {
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums text-[13px] text-text">
      <Phone className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />+{dial}
    </span>
  );
}

/**
 * Country master (Settings → Locations → Country): read-only — the list is synced from the CRM portal, so there's no
 * Add or Edit (a note under the toolbar says so). The old list's columns — Country name, Country code, Mobile code —
 * plus how many states / cities each has. Same frame as All Clients: summary pills, search, sortable paginated table
 * (cards on phones).
 */
export default function CountryList() {
  const { data, loading, error, reload } = useAsync(() => locationsApi.list(), []);
  const all = useMemo(() => data?.countries ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const rows = useMemo(() => (q ? all.filter((c) => [c.name, c.code, c.dial, `+${c.dial}`].some((v) => v.toLowerCase().includes(q))) : all), [all, q]);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Country name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (c) => (
          <div className="flex min-w-0 items-center gap-3">
            <PlaceIcon kind="country" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{c.name}</p>
              <p className="truncate text-xs text-text-muted">
                {c.states} {c.states === 1 ? 'state' : 'states'} · {c.cities} {c.cities === 1 ? 'city' : 'cities'}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'code', header: 'Country code', sortable: true, cell: (c) => <CodeChip code={c.code} /> },
      { key: 'dial', header: 'Mobile code', sortable: true, accessor: (c) => Number(c.dial), cell: (c) => <DialCode dial={c.dial} /> },
      { key: 'states', header: 'States', sortable: true, hideBelow: 'md', cell: (c) => <span className="text-[13px] tabular-nums">{c.states}</span> },
      { key: 'cities', header: 'Cities', sortable: true, hideBelow: 'lg', cell: (c) => <span className="text-[13px] tabular-nums">{c.cities}</span> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Globe} title="No countries yet" description="Countries appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No countries match"
        description="Try a different search."
        action={
          <Button variant="secondary" onClick={() => setSearch('')}>
            Clear search
          </Button>
        }
      />
    );

  return (
    <div className="flex flex-col lg:flex-1">
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        {/* The same toolbar as All Clients — no Filters or Add: the list comes from the CRM */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Location summary"
                className={className}
                loading={loading}
                value="all"
                onChange={() => setSearch('')}
                items={[
                  { key: 'all', label: 'Countries', value: all.length, title: 'Show all countries', tone: 'blue', filterable: true },
                  { key: 'states', label: 'States', value: data?.states.length ?? 0, tone: 'violet' },
                  { key: 'cities', label: 'Cities', value: data?.cities.length ?? 0, tone: 'green' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search country, code or mobile code…"
            searchLabel="Search countries"
            filtered={!loading && !error && q !== ''}
            result={{ shown: rows.length, total: all.length, noun: 'countries' }}
            onClearAll={() => setSearch('')}
          />
        </div>
        <CrmSyncNote noun="countries" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(c) => (
            <GridCard
              media={<PlaceIcon kind="country" className="size-14 rounded-2xl" />}
              title={c.name}
              subtitle={`${c.states} ${c.states === 1 ? 'state' : 'states'} · ${c.cities} ${c.cities === 1 ? 'city' : 'cities'}`}
              badges={<CodeChip code={c.code} />}
              footer={<DialCode dial={c.dial} />}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Countries"
        />
      </div>
    </div>
  );
}

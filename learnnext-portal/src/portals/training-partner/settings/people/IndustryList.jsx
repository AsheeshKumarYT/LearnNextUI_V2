import { useMemo, useState } from 'react';
import { Factory, SearchX, Users } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { peopleMastersApi } from '@/services/api';
import { Button, ListToolbar } from '@/components/ui';
import { IconTile } from '@/components/ui/CardHeader';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';
import { StatPills } from '@/shared/clients/components/ClientStats';

const clientsLabel = (n) => (n === 0 ? 'No clients yet' : `${n} ${n === 1 ? 'client' : 'clients'}`);

/**
 * Industry type master (Settings → People → Industry type): read-only — synced from the CRM portal, so there's no Add,
 * Edit or Delete (a note under the toolbar says so). The old list's column — Industry type name — plus how many clients
 * are in each. Same frame as All Clients: summary pills (All / In use / Not in use filter the list), search, and a
 * sortable paginated table (cards on phones). Nothing else to filter by, so no Filters drawer.
 */
export default function IndustryList() {
  const { data, loading, error, reload } = useAsync(() => peopleMastersApi.industries(), []);
  const all = useMemo(() => data?.rows ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [usage, setUsage] = useState('all');

  const rows = useMemo(() => all.filter((x) => (usage === 'all' || (usage === 'used') === x.clients > 0) && (!q || x.name.toLowerCase().includes(q))), [all, usage, q]);
  const used = all.filter((x) => x.clients > 0).length;
  const clearAll = () => {
    setUsage('all');
    setSearch('');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Industry type name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (x) => (
          <div className="flex min-w-0 items-center gap-3">
            <IconTile icon={Factory} tone="warning" className="size-10" />
            <p className="truncate text-sm font-semibold text-text">{x.name}</p>
          </div>
        ),
      },
      {
        key: 'clients',
        header: 'Clients',
        sortable: true,
        cell: (x) => (
          <span className={x.clients ? 'inline-flex items-center gap-1.5 text-[13px] tabular-nums text-text' : 'text-xs text-text-muted/80'}>
            {x.clients > 0 && <Users className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}
            {clientsLabel(x.clients)}
          </span>
        ),
      },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Factory} title="No industry types yet" description="Industry types appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No industry types match"
        description="Try a different search."
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
        {/* The same toolbar as All Clients — no Filters or Add: the list comes from the CRM */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            summaryOnPhones
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Industry type summary"
                className={className}
                loading={loading}
                value={usage}
                onChange={setUsage}
                items={[
                  { key: 'all', label: 'All industry types', value: all.length, title: 'Show all industry types', tone: 'blue', filterable: true },
                  { key: 'used', label: 'In use', value: used, title: 'Industry types that have clients', tone: 'green', filterable: true },
                  { key: 'unused', label: 'Not in use', value: all.length - used, title: 'Industry types with no clients yet', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search industry type…"
            searchLabel="Search industry types"
            filtered={!loading && !error && (usage !== 'all' || q !== '')}
            result={{ shown: rows.length, total: all.length, noun: 'industry types' }}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="industry types" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(x) => (
            <GridCard
              media={<IconTile icon={Factory} tone="warning" className="size-14 rounded-2xl" />}
              title={x.name}
              footer={<CardFooterRow lead={<Users className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{clientsLabel(x.clients)}</CardFooterRow>}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Industry types"
        />
      </div>
    </div>
  );
}

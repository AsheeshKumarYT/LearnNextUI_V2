import { useMemo, useState } from 'react';
import { SearchX, UserCog } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { peopleMastersApi } from '@/services/api';
import { Button, ListToolbar } from '@/components/ui';
import { IconTile } from '@/components/ui/CardHeader';
import { EmptyState } from '@/components/feedback';
import { GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CrmSyncNote } from '@/components/lists/CrmSyncNote';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { EnabledBadge } from './DesignationList';

/**
 * Role master (Settings → People → Role): read-only — synced from the CRM portal, so there's no Add, Edit or Delete (a
 * note under the toolbar says so). The old list's columns — Role name, Description, Enable status. Same frame as All
 * Clients: summary pills (All / Enabled / Disabled filter the list), search, and a sortable paginated table (cards on
 * phones). Nothing else to filter by, so no Filters drawer.
 */
export default function RoleList() {
  const { data, loading, error, reload } = useAsync(() => peopleMastersApi.roles(), []);
  const all = useMemo(() => data?.rows ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [enabled, setEnabled] = useState('all');

  const rows = useMemo(
    () => all.filter((r) => (enabled === 'all' || (enabled === 'yes') === r.enabled) && (!q || [r.name, r.description].some((v) => v.toLowerCase().includes(q)))),
    [all, enabled, q],
  );
  const on = all.filter((r) => r.enabled).length;
  const clearAll = () => {
    setEnabled('all');
    setSearch('');
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Role name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (r) => (
          <div className="flex min-w-0 items-center gap-3">
            <IconTile icon={UserCog} tone="info" className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{r.name}</p>
              <p className="max-w-[16rem] truncate text-xs text-text-muted md:hidden">{r.description}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'description',
        header: 'Description',
        hideBelow: 'md',
        cell: (r) => (
          <span className="block max-w-[28rem] truncate text-[13px] text-text-secondary" title={r.description}>
            {r.description}
          </span>
        ),
      },
      { key: 'enabled', header: 'Enabled', sortable: true, accessor: (r) => (r.enabled ? 1 : 0), cell: (r) => <EnabledBadge enabled={r.enabled} /> },
    ],
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={UserCog} title="No roles yet" description="Roles appear here once they're synced from the CRM portal." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No roles match"
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
                ariaLabel="Role summary"
                className={className}
                loading={loading}
                value={enabled}
                onChange={setEnabled}
                items={[
                  { key: 'all', label: 'All roles', value: all.length, title: 'Show all roles', tone: 'blue', filterable: true },
                  { key: 'yes', label: 'Enabled', value: on, title: 'Show enabled roles', tone: 'green', filterable: true },
                  { key: 'no', label: 'Disabled', value: all.length - on, title: 'Show disabled roles', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search role or description…"
            searchLabel="Search roles"
            filtered={!loading && !error && (enabled !== 'all' || q !== '')}
            result={{ shown: rows.length, total: all.length, noun: 'roles' }}
            onClearAll={clearAll}
          />
        </div>
        <CrmSyncNote noun="roles" syncedAt={data?.syncedAt} />

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(r) => (
            <GridCard
              media={<IconTile icon={UserCog} tone="info" className="size-14 rounded-2xl" />}
              title={r.name}
              badges={<EnabledBadge enabled={r.enabled} />}
              footer={<p className="text-text-secondary">{r.description}</p>}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Roles"
        />
      </div>
    </div>
  );
}

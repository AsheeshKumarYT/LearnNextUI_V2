import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Network, Pencil, Plus, SearchX, UserRound } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, IconButton, ListToolbar, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { partnersApi } from '@/services/api';

/**
 * Super Admin → Manage Clients: the training-partner companies on LearnNext. Same frame as All Clients (summary
 * pills, search, Add client over a sortable table; cards on phones). A row opens the client, whose Sub clients tab
 * lists its own clients. Added by hand — no CRM.
 */
export default function SuperClients() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => partnersApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [status, setStatus] = useState('all');

  const rows = useMemo(
    () => all.filter((p) => (status === 'all' || p.status === status) && (!q || [p.name, p.code, p.city, p.contactName, p.mobile].some((v) => v?.toLowerCase().includes(q)))),
    [all, status, q],
  );
  const counts = useMemo(
    () => ({
      all: all.length,
      active: all.filter((p) => p.status === 'active').length,
      inactive: all.filter((p) => p.status === 'inactive').length,
      subs: all.reduce((n, p) => n + p.subClients, 0),
    }),
    [all],
  );
  const filtered = status !== 'all' || q !== '';
  const clearAll = () => {
    setStatus('all');
    setSearch('');
  };
  const open = (p) => navigate(`/clients/${p.id}`);
  const edit = (p) => navigate(`/clients/${p.id}/edit`);
  const add = () => navigate('/clients/new');

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Company',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (p) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <ClientLogo client={p} />
            <div className="min-w-0">
              <p className="block max-w-[18rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={p.name}>
                {p.name}
              </p>
              <p className="truncate text-xs text-text-muted">
                {p.industry} · {p.city}
              </p>
            </div>
          </div>
        ),
      },
      { key: 'code', header: 'Code', sortable: true, cell: (p) => <CodeChip code={p.code} /> },
      {
        key: 'subClients',
        header: 'Sub clients',
        sortable: true,
        cell: (p) => (
          <span className="inline-flex items-center gap-1.5 text-[13px] tabular-nums text-text">
            <Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            {p.subClients}
          </span>
        ),
      },
      {
        key: 'contactName',
        header: 'Contact person',
        sortable: true,
        hideBelow: 'lg',
        cell: (p) => (
          <div className="min-w-0">
            <p className="truncate text-[13px] text-text">{p.contactName || '—'}</p>
            {p.mobile && <p className="truncate text-xs tabular-nums text-text-muted">+91 {p.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>}
          </div>
        ),
      },
      {
        key: 'createdAt',
        header: 'Added on',
        sortable: true,
        hideBelow: '2xl',
        accessor: (p) => new Date(p.createdAt),
        cell: (p) => (
          <span className="text-[13px] tabular-nums" title={`${formatRelative(p.createdAt)} · by ${p.createdBy}`}>
            {formatDate(p.createdAt)}
          </span>
        ),
      },
      { key: 'status', header: 'Status', sortable: true, hideBelow: 'sm', cell: (p) => <StatusBadge status={p.status} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 96,
        cell: (p) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center">
              <IconButton icon={Pencil} label={`Edit ${p.name}`} size="sm" onClick={() => edit(p)} />
            </span>
            <span
              className="inline-flex size-7 -translate-x-1.5 items-center justify-center rounded-full bg-primary-soft text-primary-text opacity-0 transition-[opacity,transform] duration-300 ease-out row-hover:translate-x-0 row-hover:opacity-100"
              aria-hidden="true"
            >
              <ArrowRight className="size-3.5" />
            </span>
          </span>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={Building2}
        title="No clients yet"
        description="Add the training partners that use LearnNext."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add client
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No clients match"
        description="Try a different search or status."
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
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            summaryOnPhones
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Client summary"
                className={className}
                loading={loading}
                value={status}
                onChange={setStatus}
                items={[
                  { key: 'all', label: 'All clients', value: counts.all, title: 'Show all clients', tone: 'blue', filterable: true },
                  { key: 'active', label: 'Active', value: counts.active, title: 'Show active clients', tone: 'green', filterable: true },
                  { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show inactive clients', tone: 'slate', filterable: true },
                  { key: 'subs', label: 'Sub clients', value: counts.subs, title: 'Their clients, in total', tone: 'violet' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name, code, city, contact…"
            searchLabel="Search clients"
            addLabel="Add client"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'clients' }}
            onClearAll={clearAll}
          />
        </div>

        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(p) => (
            <GridCard
              media={<ClientLogo client={p} size="lg" />}
              title={p.name}
              subtitle={`${p.industry} · ${p.city}`}
              badges={
                <>
                  <CodeChip code={p.code} />
                  <StatusBadge status={p.status} />
                </>
              }
              actions={<IconButton icon={Pencil} label={`Edit ${p.name}`} size="sm" onClick={() => edit(p)} />}
              footer={
                <CardFooterRow lead={<Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />} date={p.createdAt}>
                  {p.subClients} sub {p.subClients === 1 ? 'client' : 'clients'}
                  {p.contactName && (
                    <>
                      {' · '}
                      <UserRound className="mb-0.5 inline size-3 text-text-muted" aria-hidden="true" /> {p.contactName}
                    </>
                  )}
                </CardFooterRow>
              }
              onOpen={() => open(p)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={open}
          defaultSort={{ key: 'createdAt', direction: 'desc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Clients"
        />
      </div>
    </div>
  );
}

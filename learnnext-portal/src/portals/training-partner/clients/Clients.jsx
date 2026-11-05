import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, SearchX } from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { clientsApi } from '@/services/api';
import { Button, DataTable, ListToolbar, Pagination } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/feedback';
import { ClientStats } from '@/shared/clients/components/ClientStats';
import { ClientGrid } from './components/ClientGrid';
import { ClientFiltersDrawer } from './components/ClientFiltersDrawer';
import { clientColumns } from '@/shared/clients/components/clientColumns';
import { EMPTY_FILTERS, activeChips, clearFilter, filterClients } from './components/clientFilters';

const GRID_PAGE = 12;

/**
 * All Clients: summary strip (Active / Inactive double as status filters) + quick search in one toolbar,
 * a Filters drawer with removable chips, sortable table (cards on phones).
 */
export default function Clients() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => clientsApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 200);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Table from tablet up; phones get cards — a table's columns are too cramped there
  const view = useIsMobile() ? 'grid' : 'list';
  const [gridPage, setGridPage] = useState(1);

  const rows = useMemo(() => filterClients(all, filters, q), [all, filters, q]);
  const stats = useMemo(() => {
    const since = addDays(new Date(), -30);
    return {
      total: all.length,
      active: all.filter((c) => c.status === 'active').length,
      inactive: all.filter((c) => c.status === 'inactive').length,
      recent: all.filter((c) => new Date(c.createdAt) >= since).length,
    };
  }, [all]);

  const chips = activeChips(filters);
  const filtered = chips.length > 0 || filters.status !== 'all' || q.trim() !== '';
  const setStatus = (status) => setFilters((f) => ({ ...f, status }));
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  useEffect(() => setGridPage(1), [rows.length]);
  const gridPageCount = Math.max(1, Math.ceil(rows.length / GRID_PAGE));
  const gridRows = rows.slice((gridPage - 1) * GRID_PAGE, gridPage * GRID_PAGE);

  // Opens the client in the Add client form, pre-filled (Edit client)
  const columns = useMemo(() => clientColumns({ onEdit: (c) => navigate(`/clients/${c.id}/edit`) }), [navigate]);
  const onEdit = (c) => navigate(`/clients/${c.id}/edit`);

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Building2} title="No clients yet" description="Clients you add will appear here." />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No clients match"
        description="Try a different search or loosen the filters."
        action={
          <Button variant="secondary" onClick={clearAll}>
            Clear search & filters
          </Button>
        }
      />
    );

  const toolbar = (
    <ListToolbar
      renderSummary={(className) => <ClientStats clients={all} stats={stats} status={filters.status} onStatusChange={setStatus} loading={loading} className={className} />}
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search name, code or mobile…"
      searchLabel="Search clients"
      filterCount={chips.length}
      onOpenFilters={() => setFiltersOpen(true)}
      addLabel="Add client"
      onAdd={() => navigate('/clients/new')}
      filtered={!loading && !error && filtered}
      result={{ shown: rows.length, total: all.length, noun: 'clients' }}
      chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => clearFilter(f, chip.key)) }))}
      onClearAll={clearAll}
    />
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      {/* One frame: summary + search/filters toolbar, then the table (cards on phones). Fills the page height (lg+), the
          footer at its bottom when there are few rows — as on the other list pages */}
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">{toolbar}</div>
        {view === 'list' ? (
          <DataTable
            embedded
            stickyHeader
            columns={columns}
            onRowClick={(c) => navigate(`/clients/${c.id}`)}
            data={rows}
            loading={loading}
            error={error}
            onRetry={reload}
            defaultSort={{ key: 'createdAt', direction: 'desc' }}
            pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
            emptyState={emptyState}
            mobileCards
            caption="Clients"
          />
        ) : error ? (
          <ErrorState compact title="Couldn’t load clients" description={error.message} onRetry={reload} />
        ) : !loading && rows.length === 0 ? (
          emptyState
        ) : (
          <>
            <ClientGrid clients={gridRows} loading={loading} onEdit={onEdit} />
            {!loading && rows.length > GRID_PAGE && (
              <Pagination
                className={cn('border-t border-border-strong px-4 py-2.5 sm:px-5 lg:mt-auto')}
                page={gridPage}
                pageCount={gridPageCount}
                total={rows.length}
                pageSize={GRID_PAGE}
                pageSizeOptions={[GRID_PAGE]}
                onPageChange={setGridPage}
              />
            )}
          </>
        )}
      </div>

      <ClientFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} clients={all} search={q} />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2, CircleDot, FileBadge, MapPin, Network, Pencil, Plus, SearchX, SlidersHorizontal, Trash2 } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { entitiesApi } from '@/services/api';
import { Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { EntityModal } from './EntityModal';

const EMPTY_FILTERS = { status: 'all', parents: [], states: [], constitution: 'all' };
const TOP_LEVEL = '__top';

function applyFilters(list, f, q) {
  return list.filter(
    (e) =>
      (f.status === 'all' || e.status === f.status) &&
      (!f.parents.length || f.parents.includes(e.parent ?? TOP_LEVEL)) &&
      (!f.states.length || f.states.includes(e.address.state)) &&
      (f.constitution === 'all' || e.cinType === f.constitution) &&
      (!q || [e.name, e.invoicePrefix, e.pan, e.gstin, e.cin, e.address.city, e.address.state].some((v) => v?.toLowerCase().includes(q))),
  );
}

/**
 * Entity master (Settings → Finance → Entity): the legal entities that bill programs. One frame like All Clients:
 * a toolbar (summary pills as on All Clients, search, Filters, Add entity) over a sortable, paginated table (cards on
 * phones) with the old list's columns: Entity name (with logo), Parent entity, Created on, Invoice initial, plus Status,
 * and Edit / Delete. Filters (status, parent entity, state, CIN / LLP) live in a drawer and show as removable chips.
 * A row opens the entity's edit form.
 */
export default function EntityList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => entitiesApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);
  const byId = useMemo(() => Object.fromEntries(all.map((e) => [e.id, e])), [all]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's Status filter counts as an applied filter there
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(() => {
    const since = Date.now() - 30 * 864e5;
    return {
      all: all.length,
      active: all.filter((e) => e.status === 'active').length,
      inactive: all.filter((e) => e.status === 'inactive').length,
      recent: all.filter((e) => new Date(e.createdAt) >= since).length,
    };
  }, [all]);

  const chips = [
    ...filters.parents.map((p) => ({ key: `p-${p}`, label: p === TOP_LEVEL ? 'Top-level' : `Under ${byId[p]?.name ?? '—'}`, clear: { parents: filters.parents.filter((x) => x !== p) } })),
    ...filters.states.map((s) => ({ key: `s-${s}`, label: s, clear: { states: filters.states.filter((x) => x !== s) } })),
    ...(filters.constitution !== 'all' ? [{ key: 'c', label: filters.constitution, clear: { constitution: 'all' } }] : []),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // Add / edit happen in a modal over the list; entity stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, entity: null });
  const add = () => setModal({ open: true, entity: null });
  const edit = (e) => setModal({ open: true, entity: entitiesApi.get(e.id) });

  // Delete asks first; an entity that others sit under can't be deleted until they're moved
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const children = (e) => all.filter((x) => x.parent === e.id && x.id !== e.id); // (a top entity lists itself as parent)
  const askDelete = (e) => {
    const kids = children(e);
    if (kids.length) {
      toast.error('Can’t delete this entity yet', { description: `${kids.length} ${kids.length === 1 ? 'entity sits' : 'entities sit'} under it — change their parent first.` });
      return;
    }
    setToDelete(e);
  };
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await entitiesApi.remove(toDelete.id);
      toast.success('Entity deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the entity', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  // Columns as in the old list — Entity name (with its logo), Parent entity, Created on, Invoice initial — plus Status
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Entity name',
        primary: true,
        sortable: true,
        hideable: false,
        // Same cell as All Clients: logo / monogram tile, name, a quiet second line (city · state), and the slim
        // accent bar that grows on the left edge on row hover
        cell: (e) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <ClientLogo client={{ name: e.name, code: e.invoicePrefix, logo: e.logo }} />
            <div className="min-w-0">
              <p className="block max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={e.name}>
                {e.name}
              </p>
              <p className="truncate text-xs text-text-muted">
                {e.address.city} · {e.address.state}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'parent',
        header: 'Parent entity',
        sortable: true,
        hideBelow: 'xl',
        accessor: (e) => byId[e.parent]?.name ?? '',
        cell: (e) =>
          e.parent ? (
            <span className="inline-flex max-w-[12rem] items-center gap-1.5 text-[13px] text-text" title={byId[e.parent]?.name}>
              <Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
              <span className="truncate">{byId[e.parent]?.name ?? '—'}</span>
            </span>
          ) : (
            <span className="text-text-muted/70" aria-label="No parent">
              —
            </span>
          ),
      },
      {
        key: 'createdAt',
        header: 'Created on',
        sortable: true,
        // Only on extra-wide screens, so Edit / Delete never get pushed out of view
        hideBelow: '2xl',
        accessor: (e) => new Date(e.createdAt),
        cell: (e) => (
          <span className="text-[13px] tabular-nums" title={`${formatRelative(e.createdAt)} · by ${e.createdBy}`}>
            {formatDate(e.createdAt)}
          </span>
        ),
      },
      { key: 'invoicePrefix', header: 'Invoice initial', sortable: true, cell: (e) => <CodeChip code={e.invoicePrefix} /> },
      { key: 'status', header: 'Status', sortable: true, hideBelow: 'sm', cell: (e) => <StatusBadge status={e.status} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 120,
        cell: (e) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
              <IconButton icon={Pencil} label={`Edit ${e.name}`} size="sm" onClick={() => edit(e)} />
              <IconButton icon={Trash2} label={`Delete ${e.name}`} size="sm" onClick={() => askDelete(e)} className="hover:bg-danger-soft hover:text-danger" />
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
    [byId, all],
  );
  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={Building2}
        title="No entities yet"
        description="Add the legal entities that bill programs."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add entity
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No entities match"
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
        {/* The same toolbar as All Clients: summary pills (All / Active / Inactive filter by status), search, Filters, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Entity summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All entities', value: counts.all, title: 'Show all entities', tone: 'blue', filterable: true },
                  { key: 'active', label: 'Active', value: counts.active, title: 'Show active entities', tone: 'green', filterable: true },
                  { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show inactive entities', tone: 'slate', filterable: true },
                  { key: 'new', label: 'New this month', value: counts.recent, title: 'Added in the last 30 days', tone: 'violet' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name, PAN, GSTIN, city…"
            searchLabel="Search entities"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add entity"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'entities' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(e) => (
            <GridCard
              media={<ClientLogo client={{ name: e.name, code: e.invoicePrefix, logo: e.logo }} size="lg" />}
              title={e.name}
              subtitle={`${e.address.city} · ${e.address.state}`}
              badges={
                <>
                  <CodeChip code={e.invoicePrefix} />
                  <StatusBadge status={e.status} />
                </>
              }
              actions={
                <>
                  <IconButton icon={Pencil} label={`Edit ${e.name}`} size="sm" onClick={() => edit(e)} />
                  <IconButton icon={Trash2} label={`Delete ${e.name}`} size="sm" onClick={() => askDelete(e)} className="hover:bg-danger-soft hover:text-danger" />
                </>
              }
              footer={
                <CardFooterRow lead={<Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />} date={e.createdAt}>
                  {byId[e.parent]?.name ?? 'No parent'}
                </CardFooterRow>
              }
              onOpen={() => edit(e)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Entities"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this entity?"
        description={toDelete ? `${toDelete.name} (${toDelete.invoicePrefix}) will be removed. Invoices already raised keep their details.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />

      <EntityModal open={modal.open} entity={modal.entity} entities={all} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />

      <EntityFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} entities={all} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N entities" (live count) */
function EntityFiltersDrawer({ open, onClose, filters, onApply, entities, counts, search }) {
  // Status only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(entities, draft, search).length;

  const parents = useMemo(() => {
    const ids = [...new Set(entities.map((e) => e.parent).filter(Boolean))];
    return [
      ...(entities.some((e) => !e.parent) ? [{ value: TOP_LEVEL, label: 'Top-level (no parent)' }] : []),
      ...ids.map((id) => ({ value: id, label: entities.find((e) => e.id === id)?.name ?? id })),
    ];
  }, [entities]);
  const states = useMemo(() => [...new Set(entities.map((e) => e.address.state))].sort().map((s) => ({ value: s, label: s })), [entities]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter entities"
      description="By status, parent, state or registration type"
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
            {count === 0 ? 'No matching entities' : `Show ${count} ${count === 1 ? 'entity' : 'entities'}`}
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
                { value: 'active', label: 'Active', count: counts.active },
                { value: 'inactive', label: 'Inactive', count: counts.inactive },
              ]}
              value={draft.status}
              onChange={(status) => set({ status })}
              ariaLabel="Status"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Network} tone="blue" title="Parent entity" onClear={draft.parents.length ? () => set({ parents: [] }) : undefined}>
          <MultiSelect options={parents} value={draft.parents} onChange={(p) => set({ parents: p })} placeholder="Any parent" searchPlaceholder="Search entities…" />
        </FilterSection>
        <FilterSection icon={MapPin} tone="violet" title="State" onClear={draft.states.length ? () => set({ states: [] }) : undefined}>
          <MultiSelect options={states} value={draft.states} onChange={(s) => set({ states: s })} placeholder="Any state" searchPlaceholder="Search states…" />
        </FilterSection>
        <FilterSection icon={FileBadge} tone="green" title="Registration type" onClear={draft.constitution !== 'all' ? () => set({ constitution: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'CIN', label: 'CIN (company)' },
              { value: 'LLPIN', label: 'LLPIN (LLP)' },
            ]}
            value={draft.constitution}
            onChange={(constitution) => set({ constitution })}
            ariaLabel="Registration type"
            fullWidth
          />
        </FilterSection>
      </div>
    </Drawer>
  );
}

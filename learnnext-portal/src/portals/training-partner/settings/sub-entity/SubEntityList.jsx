import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2, CircleDot, Network, Pencil, Plus, SearchX, SlidersHorizontal, Trash2 } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { entitiesApi, subEntitiesApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { SubEntityModal } from './SubEntityModal';

const EMPTY_FILTERS = { status: 'all', entities: [] };

function applyFilters(list, f, q, byId) {
  return list.filter(
    (s) =>
      (f.status === 'all' || s.status === f.status) &&
      (!f.entities.length || f.entities.includes(s.entity)) &&
      (!q || [s.name, byId[s.entity]?.name, byId[s.entity]?.invoicePrefix].some((v) => v?.toLowerCase().includes(q))),
  );
}

/**
 * Sub-entity master (Settings → Finance → Sub-entity): the units under each entity. Same frame as All Clients and the
 * Entity list: summary pills + search, Filters and Add sub-entity, over a sortable, paginated table (cards on phones)
 * with the old list's columns — Sub-entity name (with its optional logo), Entity, Created on — plus Status, and
 * Edit / Delete. Add / edit happen in a small modal; a row opens it.
 */
export default function SubEntityList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => Promise.all([subEntitiesApi.list(), entitiesApi.list()]), []);
  const all = useMemo(() => data?.[0] ?? [], [data]);
  const entities = useMemo(() => data?.[1] ?? [], [data]);
  const byId = useMemo(() => Object.fromEntries(entities.map((e) => [e.id, e])), [entities]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's Status filter counts as an applied filter there
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q, byId), [all, filters, q, byId]);
  const counts = useMemo(() => {
    const since = Date.now() - 30 * 864e5;
    return {
      all: all.length,
      active: all.filter((s) => s.status === 'active').length,
      inactive: all.filter((s) => s.status === 'inactive').length,
      recent: all.filter((s) => new Date(s.createdAt) >= since).length,
    };
  }, [all]);

  // Status shows as the pressed pill (as on All Clients); drawer filters show as chips
  const chips = filters.entities.map((id) => ({ key: `e-${id}`, label: byId[id]?.name ?? '—', clear: { entities: filters.entities.filter((x) => x !== id) } }));
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // Add / edit happen in a modal over the list; `sub` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, sub: null });
  const add = () => setModal({ open: true, sub: null });
  const edit = (s) => setModal({ open: true, sub: subEntitiesApi.get(s.id) });

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await subEntitiesApi.remove(toDelete.id);
      toast.success('Sub-entity deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the sub-entity', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  // Columns as in the old list — Sub-entity name (with its logo), Entity, Created on — plus Status
  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Sub-entity name',
        primary: true,
        sortable: true,
        hideable: false,
        // Same cell as All Clients / Entity: logo (monogram when there's none), name, and the slim accent bar on row hover.
        // On narrow screens (no Entity column) the entity shows as the second line.
        cell: (s) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <ClientLogo client={{ name: s.name, logo: s.logo }} />
            <div className="min-w-0">
              <p className="block max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={s.name}>
                {s.name}
              </p>
              <p className="truncate text-xs text-text-muted md:hidden">{byId[s.entity]?.name ?? '—'}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'entity',
        header: 'Entity',
        sortable: true,
        hideBelow: 'md',
        accessor: (s) => byId[s.entity]?.name ?? '',
        cell: (s) => (
          <span className="inline-flex max-w-[14rem] items-center gap-1.5 text-[13px] text-text" title={byId[s.entity]?.name}>
            <Building2 className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="truncate">{byId[s.entity]?.name ?? '—'}</span>
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: 'Created on',
        sortable: true,
        // Only on extra-wide screens, so Edit / Delete never get pushed out of view
        hideBelow: '2xl',
        accessor: (s) => new Date(s.createdAt),
        cell: (s) => (
          <span className="text-[13px] tabular-nums" title={`${formatRelative(s.createdAt)} · by ${s.createdBy}`}>
            {formatDate(s.createdAt)}
          </span>
        ),
      },
      { key: 'status', header: 'Status', sortable: true, hideBelow: 'sm', cell: (s) => <StatusBadge status={s.status} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 120,
        cell: (s) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
              <IconButton icon={Pencil} label={`Edit ${s.name}`} size="sm" onClick={() => edit(s)} />
              <IconButton icon={Trash2} label={`Delete ${s.name}`} size="sm" onClick={() => setToDelete(s)} className="hover:bg-danger-soft hover:text-danger" />
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
     
    [byId],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={Network}
        title="No sub-entities yet"
        description="Add the units that sit under your entities."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add sub-entity
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No sub-entities match"
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
                ariaLabel="Sub-entity summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All sub-entities', value: counts.all, title: 'Show all sub-entities', tone: 'blue', filterable: true },
                  { key: 'active', label: 'Active', value: counts.active, title: 'Show active sub-entities', tone: 'green', filterable: true },
                  { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show inactive sub-entities', tone: 'slate', filterable: true },
                  { key: 'new', label: 'New this month', value: counts.recent, title: 'Added in the last 30 days', tone: 'violet' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search sub-entity or entity…"
            searchLabel="Search sub-entities"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add sub-entity"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'sub-entities' }}
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
          renderCard={(s) => (
            <GridCard
              media={<ClientLogo client={{ name: s.name, logo: s.logo }} size="lg" />}
              title={s.name}
              subtitle={byId[s.entity]?.name ?? '—'}
              badges={<StatusBadge status={s.status} />}
              actions={
                <>
                  <IconButton icon={Pencil} label={`Edit ${s.name}`} size="sm" onClick={() => edit(s)} />
                  <IconButton icon={Trash2} label={`Delete ${s.name}`} size="sm" onClick={() => setToDelete(s)} className="hover:bg-danger-soft hover:text-danger" />
                </>
              }
              footer={
                <CardFooterRow lead={<Avatar name={s.createdBy} size="xs" />} date={s.createdAt}>
                  {s.createdBy}
                </CardFooterRow>
              }
              onOpen={() => edit(s)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Sub-entities"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this sub-entity?"
        description={toDelete ? `${toDelete.name} (under ${byId[toDelete.entity]?.name ?? '—'}) will be removed.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />

      <SubEntityModal open={modal.open} sub={modal.sub} entities={entities} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />

      <SubEntityFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} subs={all} entities={entities} byId={byId} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N sub-entities" (live count) */
function SubEntityFiltersDrawer({ open, onClose, filters, onApply, subs, entities, byId, counts, search }) {
  // Status only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(subs, draft, search, byId).length;

  // Only entities that have sub-entities, with how many each has
  const entityOptions = useMemo(
    () =>
      entities
        .map((e) => ({ value: e.id, label: e.name, description: `${subs.filter((s) => s.entity === e.id).length} sub-entities` }))
        .filter((o) => subs.some((s) => s.entity === o.value))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [entities, subs],
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter sub-entities"
      description="By status or entity"
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
            {count === 0 ? 'No matching sub-entities' : `Show ${count} ${count === 1 ? 'sub-entity' : 'sub-entities'}`}
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
        <FilterSection icon={Building2} tone="blue" title="Entity" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={entityOptions} value={draft.entities} onChange={(v) => set({ entities: v })} placeholder="Any entity" searchPlaceholder="Search entities…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

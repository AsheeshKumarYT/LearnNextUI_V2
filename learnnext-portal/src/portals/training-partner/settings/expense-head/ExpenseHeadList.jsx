import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2, CircleDot, Network, Pencil, Plus, ReceiptText, SearchX, SlidersHorizontal, Trash2 } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { entitiesApi, expenseHeadsApi, subEntitiesApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { ExpenseHeadIcon } from './expenseHeadMeta';
import { ExpenseHeadModal } from './ExpenseHeadModal';

const EMPTY_FILTERS = { status: 'all', heads: [], entities: [], subs: [] };

function applyFilters(list, f, q, names) {
  return list.filter(
    (x) =>
      (f.status === 'all' || x.status === f.status) &&
      (!f.heads.length || f.heads.includes(x.head)) &&
      (!f.entities.length || f.entities.includes(x.entity)) &&
      (!f.subs.length || f.subs.includes(x.sub)) &&
      (!q || [x.head, x.glCode, names.entity[x.entity], names.sub[x.sub]].some((v) => v?.toLowerCase().includes(q))),
  );
}

/**
 * Expense head master (Settings → Finance → Expense head): the GL code each kind of expense books to, per sub-entity.
 * Same frame as All Clients and the other Finance masters: summary pills + search, Filters and Add expense head, over a
 * sortable, paginated table (cards on phones) with the old list's columns — Expense head, Entity, Sub-entity, GL code —
 * plus Status, and Edit / Delete. Add / edit happen in a small modal; a row opens it.
 */
export default function ExpenseHeadList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => Promise.all([expenseHeadsApi.list(), entitiesApi.list(), subEntitiesApi.list()]), []);
  const all = useMemo(() => data?.[0] ?? [], [data]);
  const entities = useMemo(() => data?.[1] ?? [], [data]);
  const subs = useMemo(() => data?.[2] ?? [], [data]);
  const names = useMemo(() => ({ entity: Object.fromEntries(entities.map((e) => [e.id, e.name])), sub: Object.fromEntries(subs.map((s) => [s.id, s.name])) }), [entities, subs]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Phones have no pills, so the drawer's Status filter counts as an applied filter there
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q, names), [all, filters, q, names]);
  const counts = useMemo(() => {
    const since = Date.now() - 30 * 864e5;
    return {
      all: all.length,
      active: all.filter((x) => x.status === 'active').length,
      inactive: all.filter((x) => x.status === 'inactive').length,
      recent: all.filter((x) => new Date(x.createdAt) >= since).length,
    };
  }, [all]);

  // Status shows as the pressed pill (as on All Clients); drawer filters show as chips
  const chips = [
    ...filters.heads.map((h) => ({ key: `h-${h}`, label: h, clear: { heads: filters.heads.filter((x) => x !== h) } })),
    ...filters.entities.map((id) => ({ key: `e-${id}`, label: names.entity[id] ?? '—', clear: { entities: filters.entities.filter((x) => x !== id) } })),
    ...filters.subs.map((id) => ({ key: `s-${id}`, label: names.sub[id] ?? '—', clear: { subs: filters.subs.filter((x) => x !== id) } })),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // Add / edit happen in a modal over the list; `row` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, row: null });
  const add = () => setModal({ open: true, row: null });
  const edit = (x) => setModal({ open: true, row: expenseHeadsApi.get(x.id) });

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await expenseHeadsApi.remove(toDelete.id);
      toast.success('Expense head deleted', { description: `${toDelete.head} · ${names.sub[toDelete.sub] ?? ''}` });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the expense head', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  // Columns as in the old list — Expense head, Entity, Sub-entity, GL code — plus Status
  const columns = useMemo(
    () => [
      {
        key: 'head',
        header: 'Expense head',
        primary: true,
        sortable: true,
        hideable: false,
        // Same cell shape as the other masters: icon tile, name, a quiet second line (the sub-entity on narrow screens,
        // the comment otherwise), and the slim accent bar on row hover
        cell: (x) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <ExpenseHeadIcon head={x.head} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{x.head}</p>
              <p className="truncate text-xs text-text-muted md:hidden">{names.sub[x.sub] ?? '—'}</p>
              {x.comment && (
                <p className="hidden max-w-[10rem] truncate text-xs text-text-muted md:block" title={x.comment}>
                  {x.comment}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'entity',
        header: 'Entity',
        sortable: true,
        hideBelow: 'xl',
        accessor: (x) => names.entity[x.entity] ?? '',
        cell: (x) => (
          <span className="inline-flex max-w-[10rem] items-center gap-1.5 text-[13px] text-text" title={names.entity[x.entity]}>
            <Building2 className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="truncate">{names.entity[x.entity] ?? '—'}</span>
          </span>
        ),
      },
      {
        key: 'sub',
        header: 'Sub-entity',
        sortable: true,
        hideBelow: 'md',
        accessor: (x) => names.sub[x.sub] ?? '',
        cell: (x) => (
          <span className="inline-flex max-w-[10rem] items-center gap-1.5 text-[13px] text-text" title={`${names.sub[x.sub] ?? '} · ${names.entity[x.entity] ?? '}`}>
            <Network className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <span className="truncate">{names.sub[x.sub] ?? '—'}</span>
          </span>
        ),
      },
      { key: 'glCode', header: 'GL code', sortable: true, cell: (x) => <CodeChip code={x.glCode} /> },
      {
        key: 'createdAt',
        header: 'Created on',
        sortable: true,
        // Only on extra-wide screens, so Edit / Delete never get pushed out of view
        hideBelow: '2xl',
        accessor: (x) => new Date(x.createdAt),
        cell: (x) => (
          <span className="text-[13px] tabular-nums" title={`${formatRelative(x.createdAt)} · by ${x.createdBy}`}>
            {formatDate(x.createdAt)}
          </span>
        ),
      },
      { key: 'status', header: 'Status', sortable: true, hideBelow: 'lg', cell: (x) => <StatusBadge status={x.status} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 120,
        cell: (x) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
              <IconButton icon={Pencil} label={`Edit ${x.head} for ${names.sub[x.sub] ?? ''}`} size="sm" onClick={() => edit(x)} />
              <IconButton icon={Trash2} label={`Delete ${x.head} for ${names.sub[x.sub] ?? ''}`} size="sm" onClick={() => setToDelete(x)} className="hover:bg-danger-soft hover:text-danger" />
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
     
    [names],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={ReceiptText}
        title="No expense heads yet"
        description="Add the GL code each kind of expense books to."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add expense head
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No expense heads match"
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
                ariaLabel="Expense head summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All expense heads', value: counts.all, title: 'Show all expense heads', tone: 'blue', filterable: true },
                  { key: 'active', label: 'Active', value: counts.active, title: 'Show active expense heads', tone: 'green', filterable: true },
                  { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show inactive expense heads', tone: 'slate', filterable: true },
                  { key: 'new', label: 'New this month', value: counts.recent, title: 'Added in the last 30 days', tone: 'violet' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search head, entity or GL code…"
            searchLabel="Search expense heads"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add expense head"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'expense heads' }}
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
          renderCard={(x) => (
            <GridCard
              media={<ExpenseHeadIcon head={x.head} className="size-14 rounded-2xl" />}
              title={x.head}
              subtitle={`${names.sub[x.sub] ?? '—'} · ${names.entity[x.entity] ?? '—'}`}
              badges={
                <>
                  <CodeChip code={x.glCode} />
                  <StatusBadge status={x.status} />
                </>
              }
              actions={
                <>
                  <IconButton icon={Pencil} label={`Edit ${x.head} for ${names.sub[x.sub] ?? ''}`} size="sm" onClick={() => edit(x)} />
                  <IconButton icon={Trash2} label={`Delete ${x.head} for ${names.sub[x.sub] ?? ''}`} size="sm" onClick={() => setToDelete(x)} className="hover:bg-danger-soft hover:text-danger" />
                </>
              }
              footer={
                <CardFooterRow lead={<Avatar name={x.createdBy} size="xs" />} date={x.createdAt}>
                  {x.createdBy}
                </CardFooterRow>
              }
              onOpen={() => edit(x)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'createdAt', direction: 'desc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Expense heads"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this expense head?"
        description={toDelete ? `${toDelete.head} for ${names.sub[toDelete.sub] ?? '—'} (GL ${toDelete.glCode}) will be removed.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />

      <ExpenseHeadModal open={modal.open} row={modal.row} entities={entities} subs={subs} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />

      <ExpenseHeadFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
        rows={all}
        entities={entities}
        subs={subs}
        names={names}
        counts={counts}
        search={q}
      />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N expense heads" (live count) */
function ExpenseHeadFiltersDrawer({ open, onClose, filters, onApply, rows, entities, subs, names, counts, search }) {
  // Status only on phones — the summary pills cover it on larger screens (as on All Clients)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(rows, draft, search, names).length;

  const n = (pred) => rows.filter(pred).length;
  const headOptions = expenseHeadsApi.types().map((h) => ({ value: h, label: h, description: `${n((x) => x.head === h)} sub-entities` }));
  const entityOptions = entities.filter((e) => rows.some((x) => x.entity === e.id)).map((e) => ({ value: e.id, label: e.name, description: `${n((x) => x.entity === e.id)} expense heads` }));
  // Sub-entities narrow to the picked entities
  const subOptions = subs
    .filter((s) => rows.some((x) => x.sub === s.id) && (!draft.entities.length || draft.entities.includes(s.entity)))
    .map((s) => ({ value: s.id, label: s.name, description: names.entity[s.entity] }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter expense heads"
      description="By status, expense head, entity or sub-entity"
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
            {count === 0 ? 'No matching expense heads' : `Show ${count} ${count === 1 ? 'expense head' : 'expense heads'}`}
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
        <FilterSection icon={ReceiptText} tone="green" title="Expense head" onClear={draft.heads.length ? () => set({ heads: [] }) : undefined}>
          <MultiSelect options={headOptions} value={draft.heads} onChange={(v) => set({ heads: v })} placeholder="Any expense head" searchPlaceholder="Search expense heads…" />
        </FilterSection>
        <FilterSection icon={Building2} tone="blue" title="Entity" onClear={draft.entities.length ? () => set({ entities: [], subs: [] }) : undefined}>
          <MultiSelect
            options={entityOptions}
            value={draft.entities}
            // Dropping an entity drops its sub-entities from the filter too
            onChange={(v) => set({ entities: v, subs: draft.subs.filter((id) => !v.length || v.includes(subs.find((s) => s.id === id)?.entity)) })}
            placeholder="Any entity"
            searchPlaceholder="Search entities…"
          />
        </FilterSection>
        <FilterSection icon={Network} tone="violet" title="Sub-entity" onClear={draft.subs.length ? () => set({ subs: [] }) : undefined}>
          <MultiSelect options={subOptions} value={draft.subs} onChange={(v) => set({ subs: v })} placeholder="Any sub-entity" searchPlaceholder="Search sub-entities…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

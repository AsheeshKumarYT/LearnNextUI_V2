import { useMemo, useState } from 'react';
import { ArrowRight, Blocks, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { modulesApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, IconButton, ListToolbar } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { EnabledBadge } from '../people/DesignationList';
import { ModuleIcon, moduleMeta } from './moduleMeta';
import { ModuleModal } from './ModuleModal';

/**
 * Modules master (Settings → Others → Modules): the parts of the program journey — for now Pre, During and Post. The old
 * list's columns — Module name, Created on, Enable status, Edit / Delete — plus who created it. Same frame as the other
 * masters: summary pills (All / Enabled / Disabled filter the list), search and Add module over a sortable table (cards
 * on phones), in journey order by default. Add / edit in a small modal (a row opens it).
 */
export default function ModuleList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => modulesApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [state, setState] = useState('all');

  const rows = useMemo(() => all.filter((x) => (state === 'all' || (state === 'on') === x.enabled) && (!q || x.name.toLowerCase().includes(q))), [all, state, q]);
  const on = all.filter((x) => x.enabled).length;
  const clearAll = () => {
    setState('all');
    setSearch('');
  };

  // Add / edit happen in a modal over the list; `row` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, row: null });
  const add = () => setModal({ open: true, row: null });
  const edit = (x) => setModal({ open: true, row: x });

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await modulesApi.remove(toDelete.id);
      toast.success('Module deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the module', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const actions = (x) => (
    <>
      <IconButton icon={Pencil} label={`Edit ${x.name}`} size="sm" onClick={() => edit(x)} />
      <IconButton icon={Trash2} label={`Delete ${x.name}`} size="sm" onClick={() => setToDelete(x)} className="hover:bg-danger-soft hover:text-danger" />
    </>
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Module name',
        primary: true,
        sortable: true,
        hideable: false,
        // Icon tile (Pre / During / Post each have their own), name + when it happens, slim accent bar on row hover
        cell: (x) => {
          const { hint } = moduleMeta(x.name);
          return (
            <div className="relative flex min-w-0 items-center gap-3">
              <span
                className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
                aria-hidden="true"
              />
              <ModuleIcon name={x.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{x.name}</p>
                {hint && <p className="truncate text-xs text-text-muted">{hint}</p>}
              </div>
            </div>
          );
        },
      },
      {
        key: 'createdBy',
        header: 'Created by',
        sortable: true,
        cell: (x) => (
          <span className="inline-flex min-w-0 items-center gap-2 text-[13px] text-text">
            <Avatar name={x.createdBy} size="xs" />
            <span className="truncate">{x.createdBy}</span>
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: 'Created on',
        sortable: true,
        accessor: (x) => new Date(x.createdAt),
        cell: (x) => (
          <span className="text-[13px] tabular-nums" title={formatRelative(x.createdAt)}>
            {formatDate(x.createdAt)}
          </span>
        ),
      },
      { key: 'enabled', header: 'Enable status', sortable: true, accessor: (x) => (x.enabled ? 1 : 0), cell: (x) => <EnabledBadge enabled={x.enabled} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 120,
        cell: (x) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
              {actions(x)}
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
        icon={Blocks}
        title="No modules yet"
        description="Add the parts of the program journey, like Pre, During and Post."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add module
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No modules match"
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
        {/* The same toolbar as All Clients: summary pills (All / Enabled / Disabled), search, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            summaryOnPhones
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Module summary"
                className={className}
                loading={loading}
                value={state}
                onChange={setState}
                items={[
                  { key: 'all', label: 'All modules', value: all.length, title: 'Show all modules', tone: 'blue', filterable: true },
                  { key: 'on', label: 'Enabled', value: on, title: 'Show enabled modules', tone: 'green', filterable: true },
                  { key: 'off', label: 'Disabled', value: all.length - on, title: 'Show disabled modules', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search module…"
            searchLabel="Search modules"
            addLabel="Add module"
            onAdd={add}
            filtered={!loading && !error && (state !== 'all' || q !== '')}
            result={{ shown: rows.length, total: all.length, noun: 'modules' }}
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
              media={<ModuleIcon name={x.name} className="size-14 rounded-2xl" />}
              title={x.name}
              subtitle={moduleMeta(x.name).hint ?? undefined}
              badges={<EnabledBadge enabled={x.enabled} />}
              actions={actions(x)}
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
          // Journey order (Pre → During → Post) = the order they were created
          defaultSort={{ key: 'createdAt', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Modules"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this module?"
        description={toDelete ? `${toDelete.name} will be removed from the program journey.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />

      <ModuleModal open={modal.open} row={modal.row} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
    </div>
  );
}

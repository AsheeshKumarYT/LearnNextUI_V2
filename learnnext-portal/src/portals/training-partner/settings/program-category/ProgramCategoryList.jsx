import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, FolderTree, Library, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import { formatDate, formatRelative } from '@/utils/formatDate';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { programCategoriesApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, IconButton, ListToolbar } from '@/components/ui';
import { IconTile } from '@/components/ui/CardHeader';
import { Popover } from '@/components/ui/Popover';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { ProgramCategoryModal } from './ProgramCategoryModal';

const programsLabel = (n) => (n === 0 ? 'Not used yet' : `${n} ${n === 1 ? 'program' : 'programs'}`);

/** "N programs" as a quiet button: click to see the program names in a small panel under it */
function ProgramsPeek({ category }) {
  return (
    <Popover
      placement="bottom-start"
      className="w-72 p-0"
      trigger={
        <button
          type="button"
          aria-label={`${programsLabel(category.programs)} in ${category.name} — show names`}
          className="group/peek inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 text-[13px] tabular-nums text-text transition-colors hover:bg-primary-soft/60 hover:text-primary-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus aria-expanded:bg-primary-soft/60 aria-expanded:text-primary-text"
        >
          <Library className="size-3.5 shrink-0 text-text-muted group-hover/peek:text-primary-text" aria-hidden="true" />
          {programsLabel(category.programs)}
          <ChevronDown className="size-3.5 text-text-muted transition-transform group-aria-expanded/peek:rotate-180" aria-hidden="true" />
        </button>
      }
    >
      <div className="border-b border-border px-3.5 py-2.5">
        <p className="text-xs font-semibold text-text">Programs in {category.name}</p>
      </div>
      <ul className="max-h-64 overflow-y-auto py-1.5">
        {category.programNames.map((name) => (
          <li key={name} className="flex items-center gap-2.5 px-3.5 py-1.5 text-[13px] text-text">
            <span className="size-1.5 shrink-0 rounded-full bg-success-main/70" aria-hidden="true" />
            <span className="min-w-0 truncate" title={name}>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

/**
 * Program Category master (Settings → Others → Program Category): the categories programs are filed under (the
 * "Program category" select in Manage Content). The old list's columns — Category name, Created on, Edit / Delete —
 * plus how many programs use each and who created it. Same frame as All Clients and the other masters: summary pills
 * (All / In use / Not in use filter the list), search and Add category over a sortable, paginated table (cards on phones).
 * Add / edit in a small modal (a row opens it). A category in use can't be deleted — its programs must move first.
 */
export default function ProgramCategoryList() {
  const toast = useToast();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => programCategoriesApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [usage, setUsage] = useState('all');

  const rows = useMemo(() => all.filter((x) => (usage === 'all' || (usage === 'used') === x.programs > 0) && (!q || x.name.toLowerCase().includes(q))), [all, usage, q]);
  const used = all.filter((x) => x.programs > 0).length;
  const clearAll = () => {
    setUsage('all');
    setSearch('');
  };

  // Add / edit happen in a modal over the list; `row` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, row: null });
  const add = () => setModal({ open: true, row: null });
  const edit = (x) => setModal({ open: true, row: x });

  const [toDelete, setToDelete] = useState(null);
  const inUse = toDelete?.programs > 0;
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await programCategoriesApi.remove(toDelete.id);
      toast.success('Category deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the category', { description: err.message });
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
        header: 'Category name',
        primary: true,
        sortable: true,
        hideable: false,
        // Same cell shape as the other masters: icon tile, name (programs underneath on narrow screens), and the slim
        // accent bar on row hover
        cell: (x) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <IconTile icon={FolderTree} tone="success" className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text">{x.name}</p>
              <p className="truncate text-xs text-text-muted md:hidden">{programsLabel(x.programs)}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'programs',
        header: 'Programs',
        sortable: true,
        cell: (x) =>
          x.programs ? (
            <span data-row-action onClick={(ev) => ev.stopPropagation()}>
              <ProgramsPeek category={x} />
            </span>
          ) : (
            <span className="text-xs text-text-muted/80">{programsLabel(0)}</span>
          ),
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
        icon={FolderTree}
        title="No program categories yet"
        description="Add the groups programs are filed under."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add category
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No categories match"
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
        {/* The same toolbar as All Clients: summary pills (All / In use / Not in use), search, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            summaryOnPhones
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Program category summary"
                className={className}
                loading={loading}
                value={usage}
                onChange={setUsage}
                items={[
                  { key: 'all', label: 'All categories', value: all.length, title: 'Show all categories', tone: 'blue', filterable: true },
                  { key: 'used', label: 'In use', value: used, title: 'Categories that have programs', tone: 'green', filterable: true },
                  { key: 'unused', label: 'Not in use', value: all.length - used, title: 'Categories with no programs yet', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search category…"
            searchLabel="Search program categories"
            addLabel="Add category"
            onAdd={add}
            filtered={!loading && !error && (usage !== 'all' || q !== '')}
            result={{ shown: rows.length, total: all.length, noun: 'categories' }}
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
              media={<IconTile icon={FolderTree} tone="success" className="size-14 rounded-2xl" />}
              title={x.name}
              subtitle={programsLabel(x.programs)}
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
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Program categories"
        />
      </div>

      {/* A category with programs can't go: instead of a Delete that would fail, say why and offer the way to move them */}
      {inUse ? (
        <ConfirmDialog
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={() => navigate('/content')}
          title={`${toDelete.name} can’t be deleted yet`}
          description={`${programsLabel(toDelete.programs)} ${toDelete.programs === 1 ? 'is' : 'are'} in this category. Move ${toDelete.programs === 1 ? 'it' : 'them'} to another category in Manage Content first.`}
          confirmLabel="Go to Manage Content"
          cancelLabel="Close"
          tone="info"
        />
      ) : (
        <ConfirmDialog
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          title="Delete this category?"
          description={toDelete ? `${toDelete.name} will be removed. No programs use it.` : ''}
          confirmLabel="Delete"
          tone="danger"
        />
      )}

      <ProgramCategoryModal open={modal.open} row={modal.row} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
    </div>
  );
}

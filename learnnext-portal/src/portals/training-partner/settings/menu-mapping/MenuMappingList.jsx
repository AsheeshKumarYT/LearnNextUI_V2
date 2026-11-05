import { useMemo, useState } from 'react';
import { ArrowRight, ChevronRight, Link2, PanelsTopLeft, Pencil, Plus, SearchX, ShieldCheck, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { menusApi } from '@/services/api';
import { Button, ConfirmDialog, IconButton, ListToolbar } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { menuIcon } from './menuIcons';
import { MenuModal } from './MenuModal';
import { toTree } from './menuTree';

const subLabel = (n) => `${n} sub-${n === 1 ? 'menu' : 'menus'}`;

/**
 * Menu Mapping & Access (Settings → Others): the admin portal's menu — which pages it shows, under which parent, in what
 * order. Picked from previews: "Menu tree table". Same frame as the other masters (pills All / Top-level / Sub-menus,
 * search, Add menu), but the table is the menu itself: sub-menus sit indented under their parent with a connector line,
 * in priority order, and parents fold open / closed. Columns follow the old list: Menu, Module (only Admin for now),
 * Page name, Page URL, Priority, Edit / Delete. Add / edit in a modal with an icon picker and a live preview to set the order.
 */
export default function MenuMappingList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => menusApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);
  const tree = useMemo(() => toTree(all), [all]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [level, setLevel] = useState('all');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const toggle = (id) =>
    setCollapsed((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Searching / filtering shows the matches (sub-menus say which parent they're under); otherwise the folded tree
  const filtering = level !== 'all' || q !== '';
  const rows = useMemo(() => {
    if (!filtering) return tree.filter((m) => m.depth === 0 || !collapsed.has(m.parent));
    return tree.filter(
      (m) => (level === 'all' || (level === 'top') === (m.depth === 0)) && (!q || [m.name, m.pageName, m.url, m.parentName, m.module].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [tree, filtering, level, q, collapsed]);
  const counts = { all: all.length, top: all.filter((m) => !m.parent).length, sub: all.filter((m) => m.parent).length };
  const clearAll = () => {
    setLevel('all');
    setSearch('');
  };

  // Add / edit happen in a modal over the list; `row` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, row: null });
  const add = () => setModal({ open: true, row: null });
  const edit = (m) => setModal({ open: true, row: all.find((x) => x.id === m.id) ?? m });

  const [toDelete, setToDelete] = useState(null);
  const kids = toDelete ? all.filter((m) => m.parent === toDelete.id).length : 0;
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await menusApi.remove(toDelete.id);
      toast.success('Menu deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the menu', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const actions = (m) => (
    <>
      <IconButton icon={Pencil} label={`Edit ${m.name}`} size="sm" onClick={() => edit(m)} />
      <IconButton icon={Trash2} label={`Delete ${m.name}`} size="sm" onClick={() => setToDelete(m)} className="hover:bg-danger-soft hover:text-danger" />
    </>
  );

  const columns = [
    {
      key: 'name',
      header: 'Menu',
      primary: true,
      hideable: false,
      cell: (m) => {
        const Icon = menuIcon(m.icon);
        const nested = m.depth === 1 && !filtering;
        return (
          <div className={cn('relative flex min-w-0 items-center gap-2.5', nested && 'pl-9')}>
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            {/* Tree connector for a sub-menu: the parent's line running down, with an elbow into this row */}
            {nested && (
              <span aria-hidden="true">
                <span className={cn('absolute left-3 top-[-1.25rem] w-px bg-border-strong', m.last ? 'h-[calc(50%+1.25rem)]' : '-bottom-5')} />
                <span className="absolute left-3 top-1/2 h-px w-4 bg-border-strong" />
              </span>
            )}
            {/* Parents fold their sub-menus open / closed (not while searching — matches are listed flat) */}
            {m.depth === 0 && !filtering && (
              <span data-row-action onClick={(e) => e.stopPropagation()} className="-ml-1 inline-flex w-6 shrink-0 justify-center">
                {m.childCount > 0 && (
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-expanded={!collapsed.has(m.id)}
                    aria-label={`${collapsed.has(m.id) ? 'Show' : 'Hide'} ${m.name}’s sub-menus`}
                    className="inline-flex size-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
                  >
                    <ChevronRight className={cn('size-4 transition-transform duration-200', !collapsed.has(m.id) && 'rotate-90')} aria-hidden="true" />
                  </button>
                )}
              </span>
            )}
            {m.depth === 0 ? (
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
            ) : (
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-text-secondary ring-1 ring-inset ring-border">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <p className={cn('truncate text-sm text-text transition-colors row-hover:text-primary-text', m.depth === 0 ? 'font-semibold' : 'font-medium')}>{m.name}</p>
              {m.depth === 0 && m.childCount > 0 && <p className="truncate text-xs text-text-muted">{subLabel(m.childCount)}</p>}
              {m.depth === 1 && filtering && <p className="truncate text-xs text-text-muted">under {m.parentName}</p>}
            </div>
          </div>
        );
      },
    },
    // Which portal the menu belongs to (only Admin for now)
    {
      key: 'module',
      header: 'Module',
      cell: (m) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] text-text">
          <ShieldCheck className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
          {m.module}
        </span>
      ),
    },
    { key: 'pageName', header: 'Page name', cell: (m) => <span className="block max-w-[14rem] truncate text-[13px] text-text">{m.pageName}</span> },
    {
      key: 'url',
      header: 'Page URL',
      cell: (m) => (
        <span
          className="inline-flex h-6 max-w-[18rem] items-center truncate rounded-md bg-surface-sunken px-2 font-mono text-xs text-text-secondary ring-1 ring-inset ring-border"
          title={m.url}
        >
          <span className="truncate">{m.url}</span>
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      align: 'center',
      width: 90,
      // Its place among its siblings — a small number, quieter for sub-menus
      cell: (m) => (
        <span
          className={cn(
            'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
            m.depth === 0 ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-secondary ring-1 ring-inset ring-border',
          )}
          title={m.depth === 0 ? `Position ${m.priority} in the menu` : `Position ${m.priority} under ${m.parentName}`}
        >
          {m.priority}
        </span>
      ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      hideable: false,
      width: 120,
      cell: (m) => (
        <span className="inline-flex items-center gap-1">
          <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
            {actions(m)}
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
  ];

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={PanelsTopLeft}
        title="No menus yet"
        description="Add the pages the Training Partner menu shows."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add menu
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No menus match"
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
        {/* The same toolbar as All Clients: summary pills (All / Top-level / Sub-menus), search, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            summaryOnPhones
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Menu summary"
                className={className}
                loading={loading}
                value={level}
                onChange={setLevel}
                items={[
                  { key: 'all', label: 'All menus', value: counts.all, title: 'Show the whole menu', tone: 'blue', filterable: true },
                  { key: 'top', label: 'Top-level', value: counts.top, title: 'Show top-level menus only', tone: 'violet', filterable: true },
                  { key: 'sub', label: 'Sub-menus', value: counts.sub, title: 'Show sub-menus only', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search menu, page or URL…"
            searchLabel="Search menus"
            addLabel="Add menu"
            onAdd={add}
            filtered={!loading && !error && filtering}
            result={{ shown: rows.length, total: all.length, noun: 'menus' }}
            onClearAll={clearAll}
          />
        </div>

        {/* The menu as a tree table from tablet up (menu order — no column sorting); cards on phones */}
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(m) => {
            const Icon = menuIcon(m.icon);
            return (
              <GridCard
                media={
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                }
                title={m.name}
                subtitle={m.depth === 1 ? `Under ${m.parentName} · #${m.priority}` : `${m.childCount ? subLabel(m.childCount) : 'Top-level'} · #${m.priority}`}
                actions={actions(m)}
                footer={<CardFooterRow lead={<Link2 className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{m.url}</CardFooterRow>}
                onOpen={() => edit(m)}
              />
            );
          }}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          pagination={{ pageSize: 50, pageSizeOptions: [20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Training Partner menu"
        />
      </div>

      {/* A menu with sub-menus can't go: say why instead of a Delete that would fail */}
      {kids > 0 ? (
        <ConfirmDialog
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={() => setToDelete(null)}
          title={`${toDelete.name} can’t be deleted yet`}
          description={`It has ${subLabel(kids)}. Move them under another menu or delete them first.`}
          confirmLabel="OK"
          cancelLabel="Close"
          tone="info"
        />
      ) : (
        <ConfirmDialog
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          onConfirm={confirmDelete}
          loading={deleting}
          title="Delete this menu?"
          description={toDelete ? `${toDelete.name} (${toDelete.url}) will be removed from the Training Partner menu.` : ''}
          confirmLabel="Delete"
          tone="danger"
        />
      )}

      <MenuModal open={modal.open} row={modal.row} menus={all} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
    </div>
  );
}

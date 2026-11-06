import { useEffect, useMemo, useState } from 'react';
import { AppWindow, ArrowRight, CircleDot, KeyRound, Pencil, Phone, SearchX, ShieldCheck, SlidersHorizontal, Trash2, UserRoundCog, UsersRound } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usersApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { UserModal } from './UserModal';
import { PasswordModal } from './PasswordModal';

const EMPTY_FILTERS = { status: 'all', roles: [], application: 'all', admin: 'all', gender: 'all' };

function applyFilters(list, f, q) {
  return list.filter(
    (u) =>
      (f.status === 'all' || u.status === f.status) &&
      (!f.roles.length || f.roles.includes(u.role)) &&
      (f.application === 'all' || u.application === f.application) &&
      (f.admin === 'all' || u.isAdmin === (f.admin === 'yes')) &&
      (f.gender === 'all' || u.gender === f.gender) &&
      (!q || [u.name, u.username, u.email, u.mobile, u.role, u.designation].some((v) => v?.toLowerCase().includes(q))),
  );
}

const muted = <span className="text-text-muted/70">—</span>;

/**
 * Manage Users (Settings → Users & Access): everyone who can sign in. The same frame as All Clients — summary pills,
 * search, Filters and Add user over a sortable, paginated table (cards on phones) — with the old list's columns: Full
 * name, Username, Role, Gender, Email, Mobile number, plus Status. Row actions: Change password (the old "Manage
 * Password"), Edit, Delete. Add / Edit open a 3-step modal; a row opens Edit.
 */
export default function UsersList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => usersApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isPhone = useIsMobile();

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(
    () => ({
      all: all.length,
      active: all.filter((u) => u.status === 'active').length,
      inactive: all.filter((u) => u.status === 'inactive').length,
      admins: all.filter((u) => u.isAdmin).length,
    }),
    [all],
  );

  const chips = [
    ...filters.roles.map((r) => ({ key: `r-${r}`, label: r, clear: { roles: filters.roles.filter((x) => x !== r) } })),
    ...(filters.application !== 'all' ? [{ key: 'app', label: filters.application, clear: { application: 'all' } }] : []),
    ...(filters.admin !== 'all' ? [{ key: 'adm', label: filters.admin === 'yes' ? 'Admin rights' : 'No admin rights', clear: { admin: 'all' } }] : []),
    ...(filters.gender !== 'all' ? [{ key: 'g', label: filters.gender, clear: { gender: 'all' } }] : []),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const [modal, setModal] = useState({ open: false, user: null });
  const add = () => setModal({ open: true, user: null });
  const edit = (u) => setModal({ open: true, user: usersApi.get(u.id) });
  const [pwUser, setPwUser] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const reports = (u) => all.filter((x) => x.parent === u.id).length;
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await usersApi.remove(toDelete.id);
      toast.success('User deleted', { description: `${toDelete.name} can no longer sign in.` });
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error('Couldn’t delete the user', { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const actions = (u) => (
    <>
      <IconButton icon={KeyRound} label={`Change password for ${u.name}`} size="sm" onClick={() => setPwUser(u)} />
      <IconButton icon={Pencil} label={`Edit ${u.name}`} size="sm" onClick={() => edit(u)} />
      <IconButton icon={Trash2} label={`Delete ${u.name}`} size="sm" onClick={() => setToDelete(u)} className="hover:bg-danger-soft hover:text-danger" />
    </>
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Full name',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (u) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <Avatar src={u.photo} name={u.name} size="md" />
            <div className="min-w-0">
              <p className="flex max-w-[15rem] items-center gap-1.5 text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={u.name}>
                <span className="truncate">{u.name}</span>
                {u.isAdmin && <ShieldCheck className="size-3.5 shrink-0 text-primary-text" aria-label="Admin rights" />}
              </p>
              <p className="truncate text-xs text-text-muted">{u.designation || u.application}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'username',
        header: 'Username',
        sortable: true,
        cell: (u) => (
          <span className="block max-w-[14rem] truncate text-[13px] text-text" title={u.username}>
            {u.username}
          </span>
        ),
      },
      { key: 'role', header: 'Role', sortable: true, cell: (u) => <span className="text-[13px] text-text">{u.role}</span> },
      { key: 'gender', header: 'Gender', sortable: true, hideBelow: '2xl', cell: (u) => (u.gender ? <span className="text-[13px]">{u.gender}</span> : muted) },
      {
        key: 'email',
        header: 'Email',
        sortable: true,
        hideBelow: 'xl',
        cell: (u) => (
          <span className="block max-w-[15rem] truncate text-[13px]" title={u.email}>
            {u.email}
          </span>
        ),
      },
      { key: 'mobile', header: 'Mobile number', sortable: true, hideBelow: 'lg', cell: (u) => (u.mobile ? <span className="text-[13px] tabular-nums">{u.mobile}</span> : muted) },
      { key: 'status', header: 'Status', sortable: true, hideBelow: 'sm', cell: (u) => <StatusBadge status={u.status} /> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 150,
        cell: (u) => (
          <span className="inline-flex items-center gap-1">
            <span data-row-action onClick={(ev) => ev.stopPropagation()} className="inline-flex items-center gap-0.5">
              {actions(u)}
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
    [all],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={UsersRound} title="No users yet" description="Add the people who can sign in." action={<Button onClick={add}>Add user</Button>} />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No users match"
        description="Try a different search or loosen the filters."
        action={
          <Button variant="secondary" onClick={clearAll}>
            Clear search & filters
          </Button>
        }
      />
    );

  const n = toDelete ? reports(toDelete) : 0;

  return (
    <div className="flex flex-col lg:flex-1">
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="User summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All users', value: counts.all, title: 'Show all users', tone: 'blue', filterable: true },
                  { key: 'active', label: 'Active', value: counts.active, title: 'Show users who can sign in', tone: 'green', filterable: true },
                  { key: 'inactive', label: 'Inactive', value: counts.inactive, title: 'Show users who can’t sign in', tone: 'slate', filterable: true },
                  { key: 'admins', label: 'Admin rights', value: counts.admins, title: 'Users who can manage other users', tone: 'violet' },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name, username, email, mobile…"
            searchLabel="Search users"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add user"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'users' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(u) => (
            <GridCard
              media={<Avatar src={u.photo} name={u.name} size="lg" />}
              title={u.name}
              subtitle={`${u.role} · ${u.username}`}
              badges={<StatusBadge status={u.status} />}
              actions={actions(u)}
              footer={
                <CardFooterRow lead={<Phone className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />} date={u.createdAt}>
                  {u.mobile || 'No mobile number'}
                </CardFooterRow>
              }
              onOpen={() => edit(u)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Users"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this user?"
        description={
          toDelete
            ? `${toDelete.name} (${toDelete.username}) will no longer be able to sign in.${n ? ` ${n} ${n === 1 ? 'person reports' : 'people report'} to them and will have no parent user.` : ''}`
            : ''
        }
        confirmLabel="Delete"
        tone="danger"
      />

      <UserModal open={modal.open} user={modal.user} users={all} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
      <PasswordModal user={pwUser} onClose={() => setPwUser(null)} />

      <UserFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} users={all} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N users" (live count) */
function UserFiltersDrawer({ open, onClose, filters, onApply, users, counts, search }) {
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(users, draft, search).length;
  const roles = useMemo(() => [...new Set(users.map((u) => u.role))].sort().map((r) => ({ value: r, label: r })), [users]);
  const { applications, genders } = useMemo(() => usersApi.lookups(), []);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter users"
      description="By role, application, admin rights or gender"
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
            {count === 0 ? 'No matching users' : `Show ${count} ${count === 1 ? 'user' : 'users'}`}
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
        <FilterSection icon={UserRoundCog} tone="blue" title="Role" onClear={draft.roles.length ? () => set({ roles: [] }) : undefined}>
          <MultiSelect options={roles} value={draft.roles} onChange={(r) => set({ roles: r })} placeholder="Any role" searchPlaceholder="Search roles…" />
        </FilterSection>
        <FilterSection icon={AppWindow} tone="violet" title="Application" onClear={draft.application !== 'all' ? () => set({ application: 'all' }) : undefined}>
          <SegmentedControl tabs={[{ value: 'all', label: 'All' }, ...applications.map((a) => ({ value: a, label: a }))]} value={draft.application} onChange={(application) => set({ application })} ariaLabel="Application" fullWidth />
        </FilterSection>
        <FilterSection icon={ShieldCheck} tone="green" title="Admin rights" onClear={draft.admin !== 'all' ? () => set({ admin: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            value={draft.admin}
            onChange={(admin) => set({ admin })}
            ariaLabel="Admin rights"
            fullWidth
          />
        </FilterSection>
        <FilterSection icon={UsersRound} tone="amber" title="Gender" onClear={draft.gender !== 'all' ? () => set({ gender: 'all' }) : undefined}>
          <SegmentedControl tabs={[{ value: 'all', label: 'All' }, ...genders.map((g) => ({ value: g, label: g }))]} value={draft.gender} onChange={(gender) => set({ gender })} ariaLabel="Gender" fullWidth />
        </FilterSection>
      </div>
    </Drawer>
  );
}

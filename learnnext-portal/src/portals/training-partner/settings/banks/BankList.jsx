import { useEffect, useMemo, useState } from 'react';
import { CircleDot, Landmark, Pencil, SearchX, SlidersHorizontal, Trash2, UserRound, WalletCards } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { bankInitials, banksApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, Drawer, FormField, IconButton, Input, ListToolbar, Modal, MultiSelect, SegmentedControl, StatusBadge, Switch } from '@/components/ui';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { StatPills } from '@/shared/clients/components/ClientStats';

const EMPTY_FILTERS = { status: 'all', accounts: 'all', addedBy: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (b) =>
      (f.status === 'all' || (f.status === 'enabled') === b.enabled) &&
      (f.accounts === 'all' || (f.accounts === 'yes') === b.accounts > 0) &&
      (!f.addedBy.length || f.addedBy.includes(b.addedBy)) &&
      (!q || b.name.toLowerCase().includes(q)),
  );
}

const BankTile = ({ bank, size }) => <ClientLogo client={{ name: bank.name, code: bank.name }} initials={bankInitials(bank.name)} size={size} />;
const accountsLabel = (n) => (n ? `${n} house ${n === 1 ? 'account' : 'accounts'}` : 'No accounts');

/**
 * Bank master (Settings → Banks → Bank master): the banks offered when adding a house bank account. Same frame as
 * All Clients: pills All banks / Enabled / Disabled, search, Filters (has house accounts, added by), Add bank, then a table (cards on phones) — Bank (tile +
 * name), House accounts, Status, Added by, Added on, Edit / Delete. A disabled bank stays on existing accounts but isn't
 * offered for new ones. A bank that house accounts use can't be deleted. A row opens Edit.
 */
export default function BankList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => banksApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isPhone = useIsMobile();
  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(() => ({ all: all.length, enabled: all.filter((b) => b.enabled).length, disabled: all.filter((b) => !b.enabled).length }), [all]);
  const chips = [
    ...(filters.accounts !== 'all' ? [{ key: 'acc', label: filters.accounts === 'yes' ? 'Has house accounts' : 'No house accounts', clear: { accounts: 'all' } }] : []),
    ...filters.addedBy.map((p) => ({ key: `by-${p}`, label: `Added by ${p}`, clear: { addedBy: filters.addedBy.filter((x) => x !== p) } })),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const [modal, setModal] = useState({ open: false, bank: null });
  const add = () => setModal({ open: true, bank: null });
  const edit = (b) => setModal({ open: true, bank: b });

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const askDelete = (b) => {
    if (b.accounts) {
      toast.error('Can’t delete this bank', { description: `${accountsLabel(b.accounts)} ${b.accounts === 1 ? 'uses' : 'use'} it — disable it instead.` });
      return;
    }
    setToDelete(b);
  };
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await banksApi.remove(toDelete.id);
      toast.success('Bank deleted', { description: toDelete.name });
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error('Couldn’t delete the bank', { description: e.message });
    } finally {
      setDeleting(false);
    }
  };

  const actions = (b) => (
    <>
      <IconButton icon={Pencil} label={`Edit ${b.name}`} size="sm" onClick={() => edit(b)} />
      <IconButton icon={Trash2} label={`Delete ${b.name}`} size="sm" onClick={() => askDelete(b)} className="hover:bg-danger-soft hover:text-danger" />
    </>
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Bank',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (b) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <BankTile bank={b} />
            <span className="max-w-[22rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={b.name}>
              {b.name}
            </span>
          </div>
        ),
      },
      {
        key: 'accounts',
        header: 'House accounts',
        sortable: true,
        cell: (b) =>
          b.accounts ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-text">
              <WalletCards className="size-3.5 text-text-muted" aria-hidden="true" />
              {accountsLabel(b.accounts)}
            </span>
          ) : (
            <span className="text-[13px] text-text-muted">No accounts</span>
          ),
      },
      { key: 'enabled', header: 'Status', sortable: true, cell: (b) => <StatusBadge status={b.enabled ? 'enabled' : 'disabled'} /> },
      {
        key: 'addedBy',
        header: 'Added by',
        sortable: true,
        hideBelow: 'lg',
        cell: (b) => (
          <span className="inline-flex items-center gap-2 text-[13px] text-text">
            <Avatar name={b.addedBy} size="sm" className="!size-6 !text-[10px]" />
            {b.addedBy}
          </span>
        ),
      },
      { key: 'addedOn', header: 'Added on', sortable: true, hideBelow: 'lg', accessor: (b) => new Date(b.addedOn), cell: (b) => <span className="text-[13px] tabular-nums">{formatDate(b.addedOn)}</span> },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 96,
        cell: (b) => (
          <span data-row-action onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5">
            {actions(b)}
          </span>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={Landmark} title="No banks yet" description="Add the banks your entities hold accounts with." action={<Button onClick={add}>Add bank</Button>} />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No banks match"
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
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Bank summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={(status) => setFilters((f) => ({ ...f, status }))}
                items={[
                  { key: 'all', label: 'All banks', value: counts.all, title: 'Show all banks', tone: 'blue', filterable: true },
                  { key: 'enabled', label: 'Enabled', value: counts.enabled, title: 'Banks offered in house bank forms', tone: 'green', filterable: true },
                  { key: 'disabled', label: 'Disabled', value: counts.disabled, title: 'Banks not offered for new accounts', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search bank…"
            searchLabel="Search banks"
            filterCount={chips.length + (isPhone && filters.status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add bank"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'banks' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(b) => (
            <GridCard
              media={<BankTile bank={b} size="lg" />}
              title={b.name}
              subtitle={accountsLabel(b.accounts)}
              badges={<StatusBadge status={b.enabled ? 'enabled' : 'disabled'} />}
              actions={actions(b)}
              footer={<CardFooterRow date={b.addedOn}>{`Added by ${b.addedBy}`}</CardFooterRow>}
              onOpen={() => edit(b)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Banks"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this bank?"
        description={toDelete ? `${toDelete.name} will be removed from the list.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />

      <BankModal open={modal.open} bank={modal.bank} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
      <BankFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} banks={all} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): has house accounts, added by — plus Status on phones (pills cover it elsewhere) */
function BankFilters({ open, onClose, filters, onApply, banks, counts, search }) {
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(banks, draft, search).length;
  const people = useMemo(() => [...new Set(banks.map((b) => b.addedBy))].sort().map((p) => ({ value: p, label: p })), [banks]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter banks"
      description="By house accounts or who added them"
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
            {count === 0 ? 'No matching banks' : `Show ${count} ${count === 1 ? 'bank' : 'banks'}`}
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
                { value: 'enabled', label: 'Enabled', count: counts.enabled },
                { value: 'disabled', label: 'Disabled', count: counts.disabled },
              ]}
              value={draft.status}
              onChange={(status) => set({ status })}
              ariaLabel="Status"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={WalletCards} tone="blue" title="House accounts" onClear={draft.accounts !== 'all' ? () => set({ accounts: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'yes', label: 'Has accounts' },
              { value: 'no', label: 'None' },
            ]}
            value={draft.accounts}
            onChange={(accounts) => set({ accounts })}
            ariaLabel="House accounts"
            fullWidth
          />
        </FilterSection>
        <FilterSection icon={UserRound} tone="violet" title="Added by" onClear={draft.addedBy.length ? () => set({ addedBy: [] }) : undefined}>
          <MultiSelect options={people} value={draft.addedBy} onChange={(addedBy) => set({ addedBy })} placeholder="Anyone" searchPlaceholder="Search people…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

/**
 * Add / edit a bank: Bank name (required, unique) and an Enabled switch ("Shown in house bank forms"). "Required" shows
 * after Save; a duplicate name as soon as the field is left.
 */
function BankModal({ open, bank, onClose, onSaved }) {
  const editing = Boolean(bank);
  const toast = useToast();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [touched, setTouched] = useState(false);
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(bank?.name ?? '');
      setEnabled(bank?.enabled ?? true);
      setTouched(false);
      setTried(false);
      setSaving(false);
    }
  }, [open, bank]);

  const trimmed = name.trim();
  const problem = !trimmed ? 'Enter the bank’s name' : banksApi.nameTaken(trimmed, bank?.id) ? 'This bank is already in the list' : '';
  const error = tried || (touched && trimmed) ? problem || undefined : undefined;

  const save = async () => {
    setTried(true);
    if (problem) return;
    setSaving(true);
    try {
      const saved = editing ? await banksApi.update(bank.id, { name: trimmed, enabled }) : await banksApi.create({ name: trimmed, enabled }, user?.name ?? 'You');
      toast.success(editing ? 'Bank updated' : 'Bank added', { description: saved.name });
      onSaved?.();
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the bank' : 'Couldn’t add the bank', { description: e.message });
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      icon={Landmark}
      title={editing ? 'Edit bank' : 'Add bank'}
      description={editing ? bank.name : 'Used for house bank accounts.'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            {editing ? 'Save changes' : 'Save bank'}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <FormField label="Bank name" required error={error}>
          <Input autoFocus placeholder="e.g. State Bank of India" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
        </FormField>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/60 px-4 py-3 dark:bg-surface-secondary/40">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text">Enabled</p>
            <p className="mt-0.5 text-xs text-text-muted">Shown in house bank forms</p>
          </div>
          <Switch checked={enabled} onChange={setEnabled} aria-label="Enabled" />
        </div>
        {editing && !enabled && bank.accounts > 0 && (
          <p className="-mt-2 text-xs text-text-muted">{accountsLabel(bank.accounts)} keep this bank; it just won’t be offered for new accounts.</p>
        )}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}

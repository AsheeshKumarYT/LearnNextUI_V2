import { useEffect, useMemo, useState } from 'react';
import { Building2, FileText, Landmark, Pencil, SearchX, SlidersHorizontal, Star, Trash2, UserRound, WalletCards } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { bankInitials, houseBanksApi } from '@/services/api';
import { Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { ClientLogo } from '@/shared/clients/components/ClientLogo';
import { CodeChip } from '@/shared/clients/components/clientColumns';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { HouseBankModal, last4 } from './HouseBankModal';

const EMPTY_FILTERS = { type: 'all', entities: [], banks: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (a) =>
      (f.type === 'all' || (f.type === 'primary') === a.primary) &&
      (!f.entities.length || f.entities.includes(a.entity)) &&
      (!f.banks.length || f.banks.includes(a.bank)) &&
      (!q || [a.bankName, a.accountNo, a.ifsc, a.holder, a.entityName, a.branchName, a.branchCode].some((v) => v?.toLowerCase().includes(q))),
  );
}

const BankTile = ({ name, size }) => <ClientLogo client={{ name, code: name }} initials={bankInitials(name)} size={size} />;
const PrimaryMark = () => (
  <span className="inline-flex items-center gap-0.5 font-semibold text-warning">
    <Star className="size-3 fill-current" aria-hidden="true" />
    Primary
  </span>
);

/**
 * House bank master (Settings → Banks → House bank master): the accounts each entity receives payments in. Same frame
 * as All Clients: pills All accounts / Primary / Secondary, search (bank, account, IFSC…), Filters (entity, bank), Add
 * account; then a table (cards on phones) — Account (bank tile, name, last 4 digits, ★ Primary), Entity & holder, IFSC,
 * Branch (name + code), Cheque (View), Edit / Delete. A row opens Edit.
 */
export default function HouseBankList() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => houseBanksApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isPhone = useIsMobile();
  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(() => ({ all: all.length, primary: all.filter((a) => a.primary).length, secondary: all.filter((a) => !a.primary).length }), [all]);

  const names = useMemo(() => {
    const entities = {};
    const banks = {};
    all.forEach((a) => {
      entities[a.entity] = a.entityName;
      banks[a.bank] = a.bankName;
    });
    return { entities, banks };
  }, [all]);
  const chips = [
    ...filters.entities.map((e) => ({ key: `e-${e}`, label: names.entities[e] ?? e, clear: { entities: filters.entities.filter((x) => x !== e) } })),
    ...filters.banks.map((b) => ({ key: `b-${b}`, label: names.banks[b] ?? b, clear: { banks: filters.banks.filter((x) => x !== b) } })),
  ];
  const filtered = chips.length > 0 || filters.type !== 'all' || q !== '';
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  const [modal, setModal] = useState({ open: false, account: null });
  const add = () => setModal({ open: true, account: null });
  const edit = (a) => setModal({ open: true, account: a });
  const [cheque, setCheque] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await houseBanksApi.remove(toDelete.id);
      toast.success('Account deleted', { description: `${toDelete.bankName} ${last4(toDelete.accountNo)}` });
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error('Couldn’t delete the account', { description: e.message });
    } finally {
      setDeleting(false);
    }
  };

  const actions = (a) => (
    <>
      <IconButton icon={Pencil} label={`Edit ${a.bankName} ${last4(a.accountNo)}`} size="sm" onClick={() => edit(a)} />
      <IconButton icon={Trash2} label={`Delete ${a.bankName} ${last4(a.accountNo)}`} size="sm" onClick={() => setToDelete(a)} className="hover:bg-danger-soft hover:text-danger" />
    </>
  );
  const viewCheque = (a) => (
    <Button variant="secondary" size="sm" leftIcon={FileText} onClick={() => setCheque(a.cheque)} className="[&_svg]:text-danger">
      View
    </Button>
  );

  const columns = useMemo(
    () => [
      {
        key: 'bankName',
        header: 'Account',
        primary: true,
        sortable: true,
        hideable: false,
        cell: (a) => (
          <div className="relative flex min-w-0 items-center gap-3">
            <span
              className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
              aria-hidden="true"
            />
            <BankTile name={a.bankName} />
            <div className="min-w-0">
              <p className="max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={a.bankName}>
                {a.bankName}
              </p>
              <p className="flex items-center gap-2 text-xs tabular-nums text-text-muted">
                <span title={`Account no. ${a.accountNo}`}>{last4(a.accountNo)}</span>
                {a.primary && <PrimaryMark />}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'entityName',
        header: 'Entity & holder',
        sortable: true,
        cell: (a) => (
          <div className="min-w-0 max-w-[16rem] text-[13px]">
            <p className="flex items-center gap-1.5 text-text" title={a.entityName}>
              <Building2 className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
              <span className="truncate">{a.entityName}</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-text-muted" title={a.holder}>
              <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{a.holder}</span>
            </p>
          </div>
        ),
      },
      { key: 'ifsc', header: 'IFSC', sortable: true, cell: (a) => <CodeChip code={a.ifsc} /> },
      {
        key: 'branchName',
        header: 'Branch',
        sortable: true,
        hideBelow: 'lg',
        cell: (a) => (
          <div className="min-w-0 max-w-[15rem] text-[13px]">
            <p className="truncate text-text" title={a.branchName}>
              {a.branchName}
            </p>
            <p className="mt-0.5 text-text-muted">Code {a.branchCode}</p>
          </div>
        ),
      },
      {
        key: 'cheque',
        header: 'Cheque',
        hideBelow: 'lg',
        cell: (a) => (
          <span data-row-action onClick={(e) => e.stopPropagation()}>
            {viewCheque(a)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: <span className="sr-only">Actions</span>,
        align: 'right',
        hideable: false,
        width: 96,
        cell: (a) => (
          <span data-row-action onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5">
            {actions(a)}
          </span>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all],
  );

  const emptyState =
    all.length === 0 ? (
      <EmptyState compact icon={WalletCards} title="No house bank accounts yet" description="Add the accounts your entities receive payments in." action={<Button onClick={add}>Add account</Button>} />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No accounts match"
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
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Account summary"
                className={className}
                loading={loading}
                value={filters.type}
                onChange={(type) => setFilters((f) => ({ ...f, type }))}
                items={[
                  { key: 'all', label: 'All accounts', value: counts.all, title: 'Show all accounts', tone: 'blue', filterable: true },
                  { key: 'primary', label: 'Primary', value: counts.primary, title: 'Each entity’s default account', tone: 'green', filterable: true },
                  { key: 'secondary', label: 'Secondary', value: counts.secondary, title: 'Other accounts', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search bank, account, IFSC"
            searchLabel="Search house bank accounts"
            filterCount={chips.length + (isPhone && filters.type !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add account"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'accounts' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          renderCard={(a) => (
            <GridCard
              media={<BankTile name={a.bankName} size="lg" />}
              title={a.bankName}
              subtitle={a.entityName}
              badges={
                <>
                  <CodeChip code={a.ifsc} />
                  <span className="text-xs tabular-nums text-text-muted">{last4(a.accountNo)}</span>
                  {a.primary && (
                    <span className="text-xs">
                      <PrimaryMark />
                    </span>
                  )}
                </>
              }
              actions={actions(a)}
              footer={<CardFooterRow lead={<Landmark className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>{`${a.branchName} · Code ${a.branchCode}`}</CardFooterRow>}
              onOpen={() => edit(a)}
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          onRowClick={edit}
          defaultSort={{ key: 'bankName', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="House bank accounts"
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this account?"
        description={
          toDelete
            ? `${toDelete.bankName} ${last4(toDelete.accountNo)} will be removed from ${toDelete.entityName}.${toDelete.primary ? ' It’s the entity’s primary account — choose a new primary afterwards.' : ''}`
            : ''
        }
        confirmLabel="Delete"
        tone="danger"
      />

      <HouseBankModal open={modal.open} account={modal.account} accounts={all} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />
      <FilePreviewModal file={cheque} onClose={() => setCheque(null)} />
      <HouseBankFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} accounts={all} names={names} counts={counts} search={q} />
    </div>
  );
}

/** Filters panel (same pattern as All Clients): entity and bank, plus Primary / Secondary on phones */
function HouseBankFilters({ open, onClose, filters, onApply, accounts, names, counts, search }) {
  const showType = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(accounts, draft, search).length;
  const opts = (map) =>
    Object.entries(map)
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter accounts"
      description="By entity or bank"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft({ ...EMPTY_FILTERS, type: showType ? 'all' : draft.type })}>
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching accounts' : `Show ${count} ${count === 1 ? 'account' : 'accounts'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {showType && (
          <FilterSection icon={Star} tone="amber" title="Type" onClear={draft.type !== 'all' ? () => set({ type: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All', count: counts.all },
                { value: 'primary', label: 'Primary', count: counts.primary },
                { value: 'secondary', label: 'Secondary', count: counts.secondary },
              ]}
              value={draft.type}
              onChange={(type) => set({ type })}
              ariaLabel="Account type"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Building2} tone="blue" title="Entity" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={opts(names.entities)} value={draft.entities} onChange={(entities) => set({ entities })} placeholder="Any entity" searchPlaceholder="Search entities…" />
        </FilterSection>
        <FilterSection icon={Landmark} tone="violet" title="Bank" onClear={draft.banks.length ? () => set({ banks: [] }) : undefined}>
          <MultiSelect options={opts(names.banks)} value={draft.banks} onChange={(banks) => set({ banks })} placeholder="Any bank" searchPlaceholder="Search banks…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, CalendarDays, CheckCircle2, Columns3, Inbox, List, MessageSquareText, Paperclip, Reply, RotateCcw, SearchX, SlidersHorizontal, Tags, UserRound } from 'lucide-react';
import { formatDate, formatRelative, formatTime } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useToast } from '@/hooks/useToast';
import { Avatar, Button, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { FROM_LABEL, TicketChatDrawer } from './TicketChatDrawer';
import { TicketDetailsModal } from './TicketDetailsModal';
import { TicketBoard } from './TicketBoard';
import { awaitingReply, lastMessage, supportActions, ticketFiles, useTickets } from './supportStore';

// The Filters drawer's choices (status lives in the summary pills, the text in search)
const EMPTY_FILTERS = { from: 'all', categories: [], companies: [], repliedBy: [], within: 'any' };
const WITHIN = [
  { value: 'any', label: 'Any time', hours: Infinity },
  { value: '24h', label: '24 hours', hours: 24 },
  { value: '7d', label: '7 days', hours: 24 * 7 },
  { value: '30d', label: '30 days', hours: 24 * 30 },
];
const NO_REPLY = '__none__';
/** Admins who replied on a ticket */
const repliers = (t) => [...new Set(t.messages.filter((m) => m.by === 'admin').map((m) => m.author))];

function applyFilters(list, f, q) {
  const within = WITHIN.find((w) => w.value === f.within)?.hours ?? Infinity;
  return list.filter((t) => {
    const r = repliers(t);
    return (
      (f.from === 'all' || t.from === f.from) &&
      (!f.categories.length || f.categories.includes(t.category)) &&
      (!f.companies.length || f.companies.includes(t.org)) &&
      (!f.repliedBy.length || f.repliedBy.some((a) => (a === NO_REPLY ? r.length === 0 : r.includes(a)))) &&
      (within === Infinity || Date.now() - new Date(t.createdAt).getTime() <= within * 36e5) &&
      (!q || [t.number, t.name, t.subject, t.category, t.subCategory, t.org].some((v) => v?.toLowerCase().includes(q)))
    );
  });
}

/**
 * Support desk — tickets raised by participants (from the client programs) and by facilitators, answered here.
 * The same list as All Clients: summary pills (All / Open / Awaiting reply / Closed — one-click filters), search and
 * a Filters drawer (raised by, category, client company, replied by, raised within) with removable chips; the table
 * (cards on phones) — or, with the Table ⇄ Board toggle, a board of three lanes (Awaiting reply · Waiting on them ·
 * Closed). Clicking a ticket opens its details (description, attachments, who / when); the chat icon — or
 * Open chat in the details — opens the conversation to reply. Close / Reopen sit on the row, in the details and the chat.
 */
export default function SupportDesk() {
  const all = useTickets();
  const { user } = useAuth();
  const toast = useToast();
  const me = user?.name ?? 'Training Partner';

  const [view, setView] = useState('table'); // 'table' | 'board' (phones always get the cards — no switch there)
  const mobile = useIsMobile();
  const [status, setStatus] = useState('all');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 200).trim().toLowerCase();
  // Row click → the ticket's details; the chat icon (or Open chat in the details) → its chat
  const [detailsId, setDetailsId] = useState(null);
  const [openId, setOpenId] = useState(null);
  // Opened from the header's global search (/support?ticket=…): show that ticket's details, then tidy the address
  const [params, setParams] = useSearchParams();
  const linked = params.get('ticket');
  useEffect(() => {
    if (!linked) return;
    if (all.some((t) => t.id === linked)) setDetailsId(linked);
    setParams({}, { replace: true });
  }, [linked, all, setParams]);
  const details = all.find((t) => t.id === detailsId) ?? null;
  const ticket = all.find((t) => t.id === openId) ?? null;

  // Filters + search first; the pills count within that, and pick the status
  const pool = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const counts = useMemo(
    () => ({
      all: pool.length,
      open: pool.filter((t) => t.status === 'open').length,
      awaiting: pool.filter(awaitingReply).length,
      closed: pool.filter((t) => t.status === 'closed').length,
    }),
    [pool],
  );
  const rows = useMemo(() => pool.filter((t) => status === 'all' || (status === 'awaiting' ? awaitingReply(t) : t.status === status)), [pool, status]);

  // Removable chips for what the Filters drawer has set
  const chips = [
    ...(filters.from !== 'all' ? [{ key: 'from', label: `${FROM_LABEL[filters.from]}s`, clear: { from: 'all' } }] : []),
    ...filters.categories.map((c) => ({ key: `c-${c}`, label: c, clear: { categories: filters.categories.filter((x) => x !== c) } })),
    ...filters.companies.map((c) => ({ key: `o-${c}`, label: c, clear: { companies: filters.companies.filter((x) => x !== c) } })),
    ...filters.repliedBy.map((a) => ({ key: `r-${a}`, label: a === NO_REPLY ? 'No reply yet' : `Replied by ${a}`, clear: { repliedBy: filters.repliedBy.filter((x) => x !== a) } })),
    ...(filters.within !== 'any' ? [{ key: 'within', label: `Last ${WITHIN.find((w) => w.value === filters.within).label}`, clear: { within: 'any' } }] : []),
  ];

  const close = (t) => {
    supportActions.close(t.id, me);
    toast.success('Ticket closed', { description: `${t.number} · ${t.name}` });
  };
  const reopen = (t) => {
    supportActions.reopen(t.id);
    toast.success('Ticket reopened', { description: `${t.number} · ${t.name}` });
  };

  const columns = [
    {
      key: 'subject',
      header: 'Ticket',
      primary: true,
      sortable: true,
      hideable: false,
      // Row hover as on All Clients: a slim accent bar on the left edge, the subject turns blue
      cell: (t) => (
        <div className="relative min-w-0">
          <span
            className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
            aria-hidden="true"
          />
          <p className="max-w-[16rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={t.subject}>
            {t.subject}
          </p>
          <p className="flex items-center gap-2 text-xs tabular-nums text-text-muted">
            {t.number}
            {/* Files they attached */}
            {ticketFiles(t, 'user').length > 0 && (
              <span className="inline-flex items-center gap-0.5" title="Files attached">
                <Paperclip className="size-3" aria-hidden="true" />
                {ticketFiles(t, 'user').length}
              </span>
            )}
          </p>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Raised by',
      sortable: true,
      cell: (t) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={t.name} src={t.photo} size="sm" />
          <div className="min-w-0">
            <p className="max-w-[12rem] truncate text-sm font-medium text-text">{t.name}</p>
            <p className="max-w-[12rem] truncate text-xs text-text-muted" title={t.org}>
              {FROM_LABEL[t.from]}
              {t.org && ` · ${t.org}`}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      hideBelow: 'wide', // (phone cards only — the table shows every column)
      // One calm line (the sub-category on hover and in the details) — two-line cells everywhere read as congested
      cell: (t) => (
        <p className="max-w-[12rem] truncate text-sm text-text-secondary" title={`${t.category} › ${t.subCategory}`}>
          {t.category}
        </p>
      ),
    },
    {
      key: 'last',
      header: 'Last reply',
      sortable: true,
      accessor: (t) => lastMessage(t).at,
      hideBelow: 'lg',
      // One line: waiting on us → a soft amber "Awaiting reply · 2h"; otherwise who spoke last · when
      cell: (t) => {
        const m = lastMessage(t);
        return awaitingReply(t) ? (
          <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
            <span className="size-1.5 rounded-full bg-chart-3" aria-hidden="true" />
            <span className="font-medium text-warning">Awaiting reply</span>
            <span className="text-text-muted">· {formatRelative(m.at).replace(' ago', '')}</span>
          </p>
        ) : (
          <p className="max-w-[13rem] truncate text-sm text-text-secondary">
            {m.by === 'admin' ? m.author : t.name}
            <span className="text-text-muted"> · {formatRelative(m.at).replace(' ago', '')}</span>
          </p>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      hideBelow: '2xl', // (phone cards only)
      // Just the date (the time on hover)
      cell: (t) => (
        <span className="text-sm text-text-secondary" title={`${formatDate(t.createdAt)}, ${formatTime(t.createdAt)}`}>
          {formatDate(t.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      hideable: false,
      // data-row-action + stopPropagation (as on All Clients): the buttons don't open the row
      cell: (t) => (
        <span data-row-action className="inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <IconButton icon={MessageSquareText} label={`Open chat — ${t.number}`} size="sm" onClick={() => setOpenId(t.id)} />
          {t.status === 'open' ? (
            <IconButton icon={CheckCircle2} label={`Close ticket — ${t.number}`} size="sm" onClick={() => close(t)} />
          ) : (
            <IconButton icon={RotateCcw} label={`Reopen ticket — ${t.number}`} size="sm" onClick={() => reopen(t)} />
          )}
        </span>
      ),
    },
  ];

  const filtered = status !== 'all' || chips.length > 0 || q !== '';
  const clearAll = () => {
    setStatus('all');
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };
  const emptyState = filtered ? (
    <EmptyState
      compact
      icon={SearchX}
      title="No tickets match"
      description="Try a different search or loosen the filters."
      action={
        <Button variant="secondary" onClick={clearAll}>
          Clear search & filters
        </Button>
      }
    />
  ) : (
    <EmptyState compact icon={Inbox} title="No tickets yet" description="Tickets raised by participants and facilitators will appear here." />
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        {/* The same toolbar as All Clients: status pills (one-click filters), who raised it, search */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Ticket summary"
                className={className}
                value={status}
                onChange={setStatus}
                items={[
                  { key: 'all', label: 'All', value: counts.all, title: 'Show all tickets', tone: 'blue', filterable: true },
                  { key: 'open', label: 'Open', value: counts.open, title: 'Show open tickets', tone: 'green', filterable: true },
                  { key: 'awaiting', label: 'Awaiting reply', value: counts.awaiting, title: 'Open tickets where the last word is theirs', tone: 'amber', filterable: true, attention: counts.awaiting > 0 },
                  { key: 'closed', label: 'Closed', value: counts.closed, title: 'Show closed tickets', tone: 'slate', filterable: true },
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search ticket, name, subject…"
            searchLabel="Search tickets"
            // Phones pick the status in the drawer (no pills there), so it counts on the Filters badge
            filterCount={chips.length + (mobile && status !== 'all' ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            leadingActions={
              // Table ⇄ Board (icons only, the app's usual toggle — as on Manage Content); not on phones, which always get the cards
              <SegmentedControl
                size="sm"
                ariaLabel="View"
                className="hidden md:flex"
                value={view}
                onChange={setView}
                tabs={[
                  { value: 'table', label: <span className="sr-only">Table view</span>, icon: List, tooltip: 'Table view' },
                  { value: 'board', label: <span className="sr-only">Board view</span>, icon: Columns3, tooltip: 'Board view' },
                ]}
              />
            }
            filtered={filtered}
            result={{ shown: rows.length, total: all.length, noun: 'tickets' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        {view === 'board' && !mobile ? (
          rows.length ? (
            <TicketBoard tickets={rows} onOpen={(t) => setDetailsId(t.id)} onChat={(t) => setOpenId(t.id)} onCloseTicket={close} onReopen={reopen} />
          ) : (
            emptyState
          )
        ) : (
        <ResponsiveList
          embedded
          stickyHeader
          columns={columns}
          data={rows}
          onRowClick={(t) => setDetailsId(t.id)}
          defaultSort={{ key: 'last', direction: 'desc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Support tickets"
          renderCard={(t) => (
            <GridCard
              media={<Avatar name={t.name} src={t.photo} size="lg" />}
              title={t.subject}
              subtitle={`${t.number} · ${t.name}`}
              badges={<StatusBadge status={t.status} />}
              onOpen={() => setDetailsId(t.id)}
              actions={<IconButton icon={MessageSquareText} label={`Open chat — ${t.number}`} size="sm" onClick={() => setOpenId(t.id)} />}
              // Same build as the other list cards (All Clients, Facilitators): facts under a dashed line — who they are, and
              // where the conversation stands with when it was raised
              footer={
                <div className="flex flex-col gap-2.5">
                  <CardFooterRow lead={<Building2 className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />}>
                    {FROM_LABEL[t.from]}
                    {t.org && ` · ${t.org}`}
                  </CardFooterRow>
                  <CardFooterRow
                    lead={<Reply className={awaitingReply(t) ? 'size-3.5 shrink-0 text-warning' : 'size-3.5 shrink-0 text-text-muted'} aria-hidden="true" />}
                    date={t.createdAt}
                  >
                    {awaitingReply(t) ? (
                      <span className="font-medium text-warning">Awaiting reply · {formatRelative(lastMessage(t).at).replace(' ago', '')}</span>
                    ) : (
                      `${lastMessage(t).by === 'admin' ? lastMessage(t).author : t.name} · ${formatRelative(lastMessage(t).at).replace(' ago', '')}`
                    )}
                  </CardFooterRow>
                </div>
              }
            />
          )}
        />
        )}
      </div>

      <TicketDetailsModal
        ticket={details}
        onClose={() => setDetailsId(null)}
        onOpenChat={(t) => {
          setDetailsId(null);
          setOpenId(t.id);
        }}
      />
      <TicketChatDrawer ticket={ticket} onClose={() => setOpenId(null)} />
      <TicketFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(f, s) => {
          setFilters(f);
          setStatus(s);
        }}
        all={all}
        search={q}
        status={status}
        showStatus={mobile}
      />
    </div>
  );
}

/** Filters panel (same pattern as All Clients / Facilitators): edits a draft, applied with "Show N tickets" (live count) */
// Phones only: the status pills aren't shown there, so the drawer offers Status (as All Clients' drawer does)
const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'awaiting', label: 'Awaiting' },
  { value: 'closed', label: 'Closed' },
];

function TicketFiltersDrawer({ open, onClose, filters, onApply, all, search, status, showStatus }) {
  const [draft, setDraft] = useState(filters);
  const [draftStatus, setDraftStatus] = useState(status);
  useEffect(() => {
    if (open) {
      setDraft(filters);
      setDraftStatus(status);
    }
  }, [open, filters, status]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const st = showStatus ? draftStatus : status;
  const count = applyFilters(all, draft, search).filter((t) => st === 'all' || (st === 'awaiting' ? awaitingReply(t) : t.status === st)).length;

  // Options from the tickets themselves, each with how many tickets it has
  const optionsFor = (values) =>
    [...new Set(values.filter(Boolean))].sort().map((v) => ({ value: v, label: v, description: `${values.filter((x) => x === v).length} tickets` }));
  const categoryOptions = useMemo(() => optionsFor(all.map((t) => t.category)), [all]);
  const companyOptions = useMemo(() => optionsFor(all.map((t) => t.org)), [all]);
  const replierOptions = useMemo(() => {
    const names = all.flatMap(repliers);
    return [{ value: NO_REPLY, label: 'No reply yet', description: `${all.filter((t) => repliers(t).length === 0).length} tickets` }, ...optionsFor(names)];
  }, [all]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter tickets"
      description="By who raised it, category, company, reply or date"
      icon={SlidersHorizontal}
      bodyClassName="bg-surface-sunken/60 dark:bg-surface-sunken/30"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(EMPTY_FILTERS);
              if (showStatus) setDraftStatus('all');
            }}
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              onApply(draft, st);
              onClose();
            }}
            disabled={count === 0}
          >
            {count === 0 ? 'No matching tickets' : `Show ${count} ${count === 1 ? 'ticket' : 'tickets'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {showStatus && (
          <FilterSection icon={CheckCircle2} tone="green" title="Status" onClear={draftStatus !== 'all' ? () => setDraftStatus('all') : undefined}>
            <SegmentedControl tabs={STATUS_TABS} value={draftStatus} onChange={setDraftStatus} ariaLabel="Status" fullWidth />
          </FilterSection>
        )}
        <FilterSection icon={UserRound} tone="violet" title="Raised by" onClear={draft.from !== 'all' ? () => set({ from: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[
              { value: 'all', label: 'Everyone' },
              { value: 'participant', label: 'Participants' },
              { value: 'facilitator', label: 'Facilitators' },
            ]}
            value={draft.from}
            onChange={(from) => set({ from, ...(from === 'facilitator' && { companies: [] }) })}
            ariaLabel="Raised by"
            fullWidth
          />
        </FilterSection>
        <FilterSection icon={Tags} tone="blue" title="Category" onClear={draft.categories.length ? () => set({ categories: [] }) : undefined}>
          <MultiSelect options={categoryOptions} value={draft.categories} onChange={(v) => set({ categories: v })} placeholder="Any category" searchPlaceholder="Search categories…" />
        </FilterSection>
        {/* Companies are the participants' — hidden when only facilitators are wanted */}
        {draft.from !== 'facilitator' && (
          <FilterSection icon={Building2} tone="green" title="Client company" onClear={draft.companies.length ? () => set({ companies: [] }) : undefined}>
            <MultiSelect options={companyOptions} value={draft.companies} onChange={(v) => set({ companies: v })} placeholder="Any company" searchPlaceholder="Search companies…" />
          </FilterSection>
        )}
        <FilterSection icon={Reply} tone="blue" title="Replied by" onClear={draft.repliedBy.length ? () => set({ repliedBy: [] }) : undefined}>
          <MultiSelect options={replierOptions} value={draft.repliedBy} onChange={(v) => set({ repliedBy: v })} placeholder="Anyone" searchPlaceholder="Search people…" />
        </FilterSection>
        <FilterSection icon={CalendarDays} tone="amber" title="Raised within" onClear={draft.within !== 'any' ? () => set({ within: 'any' }) : undefined}>
          <SegmentedControl tabs={WITHIN.map(({ value, label }) => ({ value, label }))} value={draft.within} onChange={(within) => set({ within })} ariaLabel="Raised within" fullWidth />
        </FilterSection>
      </div>
    </Drawer>
  );
}

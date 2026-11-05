import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, CheckCircle2, Clock, Eye, FileClock, FileSignature, Landmark, MapPin, Pencil, PencilLine, Plus, SearchX, Send, ShieldCheck, SlidersHorizontal, Star, UserRound, Users, WalletCards, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { useIsMobile, useMediaQuery } from '@/hooks/useMediaQuery';
import { facilitatorsApi } from '@/services/api';
import { Avatar, Button, ConfirmDialog, Drawer, IconButton, ListToolbar, MultiSelect, SegmentedControl, StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { CardFooterRow, GridCard, ResponsiveList } from '@/components/lists/ResponsiveList';
import { FilterSection } from '@/portals/training-partner/clients/components/FilterSection';
import { StatPills } from '@/shared/clients/components/ClientStats';
import { FacilitatorModal } from './components/FacilitatorModal';
import { PaymentSetupModal } from './components/PaymentSetupModal';
import { STATUS, STATUS_ORDER, TYPES, TYPE_LABEL, daysSince, dayWord, stageOf, waitingSince } from './components/facilitatorMeta';

const EMPTY_FILTERS = { status: 'all', entities: [], type: 'all', states: [] };

function applyFilters(list, f, q) {
  return list.filter(
    (x) =>
      (f.status === 'all' || stageOf(x) === f.status) &&
      (f.type === 'all' || x.type === f.type) &&
      (!f.entities.length || x.entities.some((e) => f.entities.includes(e))) &&
      (!f.states.length || f.states.includes(x.address.state)) &&
      (!q || [x.name, x.email, x.mobile, x.address.city, x.address.state].some((v) => v?.toLowerCase().includes(q))),
  );
}

const ago = (iso) => {
  const d = daysSince(iso);
  return d === 0 ? 'today' : `${dayWord(d)} ago`;
};

/**
 * Facilitators — picked from previews: "Columns follow the status". The All Clients frame: status pills (All / Active /
 * KYC pending / Payment setup / Expired — the two pending ones breathe softly while anyone waits), search, Filters
 * (entity, type, state) and Add facilitator. The table only shows what makes sense for the pill that's on, so it always
 * fits and has no empty cells:
 *   All / Expired → experience · programs · rating · status (or when it ended)
 *   Active        → experience · programs · rating · agreement
 *   KYC pending   → mobile · onboarding for · link sent · reminders
 *   Payment setup pending → mobile · location · payment setup (ready to set up / waiting for them / rejected + reason)
 * On a pending step a slim line above the table says how many wait (and the oldest); KYC pending adds Resend KYC to all.
 * Rows: the action that fits the status — Resend KYC, Verify (→ the Verify KYC page), Set up payment / View / Revise
 * (→ the payment setup modal: agreement, fees, travel & stay, sent to the facilitator to approve or reject), Send
 * agreement renewal — plus Edit. Cards on phones.
 */
export default function Facilitators() {
  const toast = useToast();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => facilitatorsApi.list(), []);
  const all = useMemo(() => data ?? [], [data]);
  const lookups = useMemo(() => facilitatorsApi.lookups(), []);
  const entityName = useMemo(() => Object.fromEntries(lookups.entities.map((e) => [e.id, e.name])), [lookups]);

  const [search, setSearch] = useState('');
  const q = useDebounce(search, 150).trim().toLowerCase();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Opened from the header's global search (/facilitators?q=…): show everyone, searched to that person, then tidy the address
  const [params, setParams] = useSearchParams();
  const linked = params.get('q');
  useEffect(() => {
    if (linked == null) return;
    setFilters(EMPTY_FILTERS);
    setSearch(linked);
    setParams({}, { replace: true });
  }, [linked, setParams]);

  const rows = useMemo(() => applyFilters(all, filters, q), [all, filters, q]);
  const byStatus = useMemo(() => Object.fromEntries(STATUS_ORDER.map((s) => [s, all.filter((f) => stageOf(f) === s)])), [all]);

  const chips = [
    ...filters.entities.map((id) => ({ key: `e-${id}`, label: entityName[id] ?? '—', clear: { entities: filters.entities.filter((x) => x !== id) } })),
    ...(filters.type !== 'all' ? [{ key: 'type', label: TYPE_LABEL[filters.type], clear: { type: 'all' } }] : []),
    ...filters.states.map((s) => ({ key: `s-${s}`, label: s, clear: { states: filters.states.filter((x) => x !== s) } })),
  ];
  const filtered = chips.length > 0 || filters.status !== 'all' || q !== '';
  const setStatus = (status) => setFilters((f) => ({ ...f, status }));
  const isPhone = useIsMobile();
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch('');
  };

  // Add / edit in a modal over the list; `facilitator` stays set while it closes so the content doesn't flash
  const [modal, setModal] = useState({ open: false, facilitator: null });
  const add = () => setModal({ open: true, facilitator: null });
  const edit = (f) => setModal({ open: true, facilitator: facilitatorsApi.get(f.id) });
  // Payment setup (Payment setup pending rows): set up, view or revise — in its own 3-step modal
  const [payment, setPayment] = useState({ open: false, facilitator: null });
  const openPayment = (f) => setPayment({ open: true, facilitator: facilitatorsApi.get(f.id) });
  // What a row (table) or card (phones) opens: Approval pending → Verify KYC; Payment setup pending → the payment setup;
  // Active → their details page. Others don't open anything (Edit is the pencil)
  const canOpen = (f) => ['review', 'payment', 'active'].includes(stageOf(f));
  const openRow = (f) => {
    const stage = stageOf(f);
    if (stage === 'payment') openPayment(f);
    else navigate(stage === 'active' ? `/facilitators/${f.id}` : `/facilitators/${f.id}/verify`);
  };

  // Sends (one row or everyone waiting) — toast + reload
  const [busy, setBusy] = useState(null); // a row id, or 'bulk'
  const send = async (key, fn, ok, who) => {
    setBusy(key);
    try {
      await fn();
      toast.success(ok, { description: who });
      reload();
    } catch (e) {
      toast.error('Couldn’t send it', { description: e.message });
    } finally {
      setBusy(null);
    }
  };
  const ACTION = {
    // Approval pending: verify the submitted KYC on its own page (a labelled button, not just an icon)
    review: { icon: ShieldCheck, label: 'Verify KYC', button: 'Verify', go: (f) => navigate(`/facilitators/${f.id}/verify`) },
    kyc: { icon: Send, label: 'Resend KYC', go: (f) => send(f.id, () => facilitatorsApi.resendKyc([f.id]), 'KYC link sent again', `${f.name} · ${f.email}`) },
    // Payment setup pending: set it up / view what's with the facilitator / revise what they rejected (a labelled button)
    payment: (f) => {
      const state = f.paymentSetup?.state;
      if (state === 'sent') return { icon: Eye, label: 'View payment setup', button: 'View', tone: 'plain', go: openPayment };
      if (state === 'rejected') return { icon: PencilLine, label: 'Revise payment setup', button: 'Revise', tone: 'danger', go: openPayment };
      return { icon: WalletCards, label: 'Set up payment', button: 'Set up payment', tone: 'primary', go: openPayment };
    },
    expired: { icon: FileSignature, label: 'Send agreement renewal', go: (f) => send(f.id, () => facilitatorsApi.sendRenewal(f.id), 'Agreement renewal sent', `${f.name} · ${f.email}`) },
  };
  const actionFor = (f) => {
    const a = ACTION[stageOf(f)];
    return typeof a === 'function' ? a(f) : a;
  };
  const [confirmBulk, setConfirmBulk] = useState(false);
  const bulk = filters.status === 'kyc' ? 'kyc' : null;
  const waitStage = ['kyc', 'review', 'payment'].includes(filters.status) ? filters.status : null;
  const runBulk = async () => {
    const ids = byStatus[bulk].map((f) => f.id);
    const n = ids.length;
    await send(
      'bulk',
      () => facilitatorsApi.resendKyc(ids),
      'KYC links sent again',
      `${n} facilitator${n === 1 ? '' : 's'}`,
    );
    setConfirmBulk(false);
  };

  const columns = useMemo(() => {
    const view = filters.status;
    const name = {
      key: 'name',
      header: 'Facilitator',
      primary: true,
      sortable: true,
      hideable: false,
      // Avatar, name + email. Row hover as on All Clients (row-hover: off while on an action button): a slim accent bar
      // grows on the left edge and the name turns blue. Only Approval pending rows open something (Verify KYC) for now.
      cell: (f) => (
        <div className="relative flex min-w-0 items-center gap-3">
          <span
            className="pointer-events-none absolute -inset-y-4 -left-5 w-[3px] origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 ease-out row-hover:scale-y-75 sm:-left-6"
            aria-hidden="true"
          />
          <Avatar name={f.name} src={f.photo} size="md" />
          <div className="min-w-0">
            <p className="flex min-w-0 items-center gap-1.5">
              <span className="block max-w-[13rem] truncate text-sm font-semibold text-text transition-colors row-hover:text-primary-text" title={f.name}>
                {f.name}
              </span>
              {f.type !== 'facilitator' && <TypeTag type={f.type} />}
            </p>
            <p className="max-w-[15rem] truncate text-xs text-text-muted" title={f.email}>
              {f.email}
            </p>
          </div>
        </div>
      ),
    };
    const location = {
      key: 'location',
      header: 'Location',
      sortable: true,
      hideBelow: 'lg',
      accessor: (f) => `${f.address.city}, ${f.address.state}`,
      cell: (f) => (
        <div className="min-w-0 text-[13px]">
          <p className="truncate text-text">{f.address.city}</p>
          <p className="truncate text-xs text-text-muted">{f.address.state}</p>
        </div>
      ),
    };
    const experience = {
      key: 'experience',
      header: 'Experience',
      sortable: true,
      hideBelow: 'md',
      accessor: (f) => f.experience ?? -1,
      cell: (f) =>
        f.experience != null ? (
          <div className="text-[13px] tabular-nums">
            <p className="text-text">{f.experience} yrs</p>
            <p className="text-xs text-text-muted">{f.trainings ? `${f.trainings} trainings` : 'No trainings yet'}</p>
          </div>
        ) : (
          <Dash />
        ),
    };
    const programs = { key: 'certifications', header: 'Programs / certifications', hideBelow: 'wide', cell: (f) => (f.certifications.length ? <TagList items={f.certifications} /> : <Dash />) };
    const rating = {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      hideBelow: '2xl',
      accessor: (f) => f.rating?.score ?? -1,
      cell: (f) =>
        f.rating ? (
          <span className="inline-flex items-center gap-1 text-[13px] tabular-nums" title={`${f.rating.score} out of 5 from ${f.rating.count} ratings`}>
            <Star className="size-3.5 fill-chart-3 text-chart-3" aria-hidden="true" />
            <span className="font-semibold text-text">{f.rating.score.toFixed(1)}</span>
            <span className="text-xs text-text-muted">({f.rating.count})</span>
          </span>
        ) : (
          <Dash />
        ),
    };
    const status = {
      key: 'status',
      header: 'Status',
      sortable: true,
      hideBelow: 'sm',
      accessor: (f) => STATUS_ORDER.indexOf(f.status),
      cell: (f) => <StatusCell f={f} />,
    };
    const agreement = {
      key: 'agreement',
      header: view === 'expired' ? 'Agreement ended' : 'Agreement',
      sortable: true,
      hideBelow: 'sm',
      accessor: (f) => new Date(f.agreementEnd),
      cell: (f) => <AgreementCell f={f} />,
    };
    const mobile = { key: 'mobile', header: 'Mobile', hideBelow: 'md', cell: (f) => <span className="text-[13px] tabular-nums text-text">{f.mobile.replace(/(\d{5})(\d+)/, '$1 $2')}</span> };
    const entities = {
      key: 'entities',
      header: 'Onboarding for',
      hideBelow: 'xl',
      cell: (f) => <TagList items={f.entities.map((id) => entityName[id] ?? '—')} />,
    };
    const waited = (label, iso) => ({
      key: 'waited',
      header: label,
      sortable: true,
      hideBelow: 'sm',
      accessor: (f) => new Date(iso(f)),
      cell: (f) => {
        const d = daysSince(iso(f));
        return (
          <div className="text-[13px] tabular-nums">
            <p className={cn(d >= 7 ? 'font-medium text-warning' : 'text-text')}>{ago(iso(f))}</p>
            <p className="text-xs text-text-muted">{formatDate(iso(f))}</p>
          </div>
        );
      },
    });
    // Approval pending: when they submitted, highlighted — they're waiting on us
    const submitted = {
      key: 'waited',
      header: 'Submitted',
      sortable: true,
      hideBelow: 'sm',
      accessor: (f) => new Date(f.kycSubmittedAt),
      cell: (f) => (
        <div className="text-[13px] tabular-nums">
          <p className="inline-flex items-center gap-1.5 font-medium text-chart-4">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Waiting for approval
          </p>
          <p className="text-xs text-text-muted">
            Submitted {ago(f.kycSubmittedAt)} · {formatDate(f.kycSubmittedAt)}
          </p>
        </div>
      ),
    };
    // Payment setup pending: where their payment setup is — still to set up, with the facilitator, or rejected (their reason)
    const paymentState = {
      key: 'waited',
      header: 'Payment setup',
      sortable: true,
      hideBelow: 'sm',
      accessor: (f) => new Date(f.paymentSetup?.sentAt ?? f.kycDoneAt),
      cell: (f) => <PaymentStateCell f={f} />,
    };
    const reminders = {
      key: 'reminders',
      header: 'Reminders',
      sortable: true,
      hideBelow: 'lg',
      accessor: (f) => f.kycReminders,
      cell: (f) => <span className="text-[13px] tabular-nums text-text-secondary">{/* A lowercase x on the text baseline — a centred "×" read like a close (✕) icon */}
          {f.kycReminders ? `Resent ${f.kycReminders}x` : 'Not yet'}</span>,
    };
    const actions = {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      hideable: false,
      width: 150,
      // data-row-action + stopPropagation (as on All Clients): the buttons don't trigger the row, and the row's hover
      // look switches off while the pointer is on them
      cell: (f) => (
        <span data-row-action className="inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <RowActions f={f} action={actionFor(f)} busy={busy === f.id || busy === 'bulk'} onEdit={() => edit(f)} />
        </span>
      ),
    };

    // KYC has one more column (Reminders), so its entities wait for extra-wide screens to keep Edit in view
    if (view === 'kyc') return [name, mobile, location, { ...entities, hideBelow: '2xl' }, waited('Link sent', (f) => f.kycSentAt), reminders, actions];
    // The Verify button makes actions wider, so entities wait for 1400px+ here
    if (view === 'review') return [name, mobile, location, { ...entities, hideBelow: 'wide' }, submitted, actions];
    // Set up payment is a wider button and the payment state needs room, so Onboarding for is left out here (no sideways scroll)
    if (view === 'payment') return [name, mobile, location, paymentState, { ...actions, width: 190 }];
    if (view === 'active' || view === 'expired') return [name, location, experience, programs, rating, agreement, actions];
    return [name, location, experience, programs, rating, status, actions];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, busy, entityName]);

  const emptyState =
    all.length === 0 ? (
      <EmptyState
        compact
        icon={Users}
        title="No facilitators yet"
        description="Add a facilitator and we’ll send them a KYC link."
        action={
          <Button leftIcon={Plus} onClick={add}>
            Add facilitator
          </Button>
        }
      />
    ) : (
      <EmptyState
        compact
        icon={SearchX}
        title="No facilitators match"
        description="Try a different search or loosen the filters."
        action={
          <Button variant="secondary" onClick={clearAll}>
            Clear search & filters
          </Button>
        }
      />
    );

  return (
    <div className="flex flex-col gap-4 lg:flex-1">
      {/* The onboarding journey in its own container above the list: KYC pending → Approval pending → Payment setup, with counts; a step filters the table */}
      <OnboardingSteps value={filters.status} counts={byStatus} loading={loading} onChange={(s) => setStatus(filters.status === s ? 'all' : s)} />

      <div className="ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col">
        {/* The same toolbar as All Clients: status pills (one-click filters; the pending ones breathe), search, Filters, Add */}
        <div className="border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5">
          <ListToolbar
            renderSummary={(className) => (
              <StatPills
                ariaLabel="Facilitator summary"
                className={className}
                loading={loading}
                value={filters.status}
                onChange={setStatus}
                items={[
                  { key: 'all', label: 'All', value: all.length, title: 'Show all facilitators', tone: 'blue', filterable: true },
                  // The three onboarding stages live in the stepper line below, not here
                  ...['active', 'expired'].map((s) => ({
                    key: s,
                    label: s === 'expired' ? 'Expired' : STATUS[s].label,
                    value: byStatus[s]?.length ?? 0,
                    title: `Show ${STATUS[s].label.toLowerCase()}`,
                    tone: STATUS[s].tone,
                    filterable: true,
                  })),
                ]}
              />
            )}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name, email, mobile or city…"
            searchLabel="Search facilitators"
            // Phones pick Active / Expired in the drawer (no pills there), so it counts on the Filters badge
            filterCount={chips.length + (isPhone && ['active', 'expired'].includes(filters.status) ? 1 : 0)}
            onOpenFilters={() => setFiltersOpen(true)}
            addLabel="Add facilitator"
            onAdd={add}
            filtered={!loading && !error && filtered}
            result={{ shown: rows.length, total: all.length, noun: 'facilitators' }}
            chips={chips.map((chip) => ({ ...chip, onRemove: () => setFilters((f) => ({ ...f, ...chip.clear })) }))}
            onClearAll={clearAll}
          />
        </div>

        {/* On an onboarding step: how many wait, the oldest, and the bulk action (none for approval yet) */}
        {waitStage && !loading && byStatus[waitStage].length > 0 && (
          <WaitingLine status={waitStage} people={byStatus[waitStage]} busy={busy === 'bulk'} onSend={waitStage === 'kyc' ? () => setConfirmBulk(true) : null} />
        )}

        {/* Table from tablet up; on phones the same cards as All Clients */}
        <ResponsiveList
          key={filters.status}
          embedded
          stickyHeader
          // Every row gets All Clients' hover look. Approval pending → Verify KYC; Payment setup pending → the payment
          // setup; Active → their details page (others: Edit is the pencil)
          onRowClick={openRow}
          rowClickable={canOpen}
          columns={columns}
          data={rows}
          // Phones: the same rows as cards, opening the same things (the whole card is tappable)
          renderCard={(f) => (
            <GridCard
              onOpen={canOpen(f) ? () => openRow(f) : undefined}
              media={<Avatar name={f.name} src={f.photo} size="lg" />}
              title={f.name}
              subtitle={f.email}
              badges={
                <>
                  <StatusBadge status={STATUS[stageOf(f)].badge} />
                  {f.type !== 'facilitator' && <TypeTag type={f.type} />}
                </>
              }
              actions={<RowActions f={f} action={actionFor(f)} busy={busy === f.id || busy === 'bulk'} onEdit={() => edit(f)} />}
              footer={
                <CardFooterRow lead={<MapPin className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />} date={f.createdAt}>
                  {f.address.city}, {f.address.state}
                </CardFooterRow>
              }
            />
          )}
          loading={loading}
          error={error}
          onRetry={reload}
          defaultSort={waitStage ? { key: 'waited', direction: 'asc' } : { key: 'name', direction: 'asc' }}
          pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50, 'all'] }}
          emptyState={emptyState}
          caption="Facilitators"
        />
      </div>

      <PaymentSetupModal open={payment.open} facilitator={payment.facilitator} onClose={() => setPayment((m) => ({ ...m, open: false }))} onSent={reload} />

      <FacilitatorModal open={modal.open} facilitator={modal.facilitator} onClose={() => setModal((m) => ({ ...m, open: false }))} onSaved={reload} />

      <ConfirmDialog
        open={confirmBulk}
        onClose={() => setConfirmBulk(false)}
        onConfirm={runBulk}
        loading={busy === 'bulk'}
        title="Resend KYC to everyone pending?"
        description={`${byStatus.kyc?.length ?? 0} facilitators will get their KYC link again by email.`}
        confirmLabel="Resend KYC"
      />

      <FacilitatorFiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} onApply={setFilters} all={all} entities={lookups.entities} search={q} />
    </div>
  );
}

// The onboarding steps, in order: icon, a short hint, and the tints (resting / hover / selected) — static class names
const STEPS = [
  { key: 'kyc', label: 'KYC pending', short: 'KYC', hint: 'Link sent, not finished', icon: FileClock, iconTone: 'text-warning', rest: 'bg-chart-3/[0.09] hover:bg-chart-3/[0.15]', on: 'bg-chart-3/[0.09]', line: 'var(--ln-chart-3)', solid: 'max-sm:shadow-[inset_0_0_0_999px_color-mix(in_srgb,var(--ln-chart-3)_13%,transparent)]' },
  {
    key: 'review',
    label: 'Approval pending',
    short: 'Approval',
    hint: 'Submitted, waiting for you',
    icon: ShieldCheck,
    iconTone: 'text-chart-4',
    rest: 'bg-chart-4/[0.08] hover:bg-chart-4/[0.14]',
    on: 'bg-chart-4/[0.08]',
    line: 'var(--ln-chart-4)',
    solid: 'max-sm:shadow-[inset_0_0_0_999px_color-mix(in_srgb,var(--ln-chart-4)_20%,transparent)]',
  },
  { key: 'payment', label: 'Payment setup', short: 'Payment', hint: 'Agreement & fees to set up', icon: Landmark, iconTone: 'text-info', rest: 'bg-info/[0.07] hover:bg-info/[0.13]', on: 'bg-info/[0.07]', line: 'var(--ln-info)', solid: 'max-sm:shadow-[inset_0_0_0_999px_color-mix(in_srgb,var(--ln-info)_20%,transparent)]' },
];
// Segment shapes from sm up: a point on the right; a notch on the left where the previous one points in
const ARROW = [
  'sm:[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%)]',
  'sm:[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%,18px_50%)]',
  'sm:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,18px_50%)]',
];

/**
 * The onboarding journey above the list — picked from previews: "Arrow ribbon" (the same shape as the Upload Content
 * journey). Three joined arrow segments, each softly tinted in its colour: an icon, the stage and a short hint, and a big
 * count. Each segment is a button: deeper tint on hover; while it's on it keeps its tint and gets an outline in its colour (it filters the table; again = show
 * everyone). Stacks on phones.
 */
/**
 * The selected step's outline: an SVG drawn exactly along the segment's edge (arrow point, notch, rounded outer ends),
 * sized to the button: a soft 1.5px line (its colour at 40%) just inside the edge, with corners on the same circle as the block.
 */
function StepOutline({ index, last, color }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const arrows = useMediaQuery('(min-width: 640px)');
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return undefined;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  let d = '';
  if (size) {
    const { w, h } = size;
    const a = 18; // arrow depth (matches ARROW)
    const r = 12; // the outer ends' rounding (rounded-xl)
    if (!arrows) {
      // Phones: a rounded block (not clipped) — the line is drawn half a line in so it sits inside the edge
      const o = 0.75;
      const arc = (x, y) => `A${r - o},${r - o} 0 0 1 ${x},${y}`;
      d = `M${r},${o} H${w - r} ${arc(w - o, r)} V${h - r} ${arc(w - r, h - o)} H${r} ${arc(o, h - r)} V${r} ${arc(r, o)} Z`;
    } else {
      // Arrows: the line runs exactly along the segment's edge and the segment's own clip cuts off its outer half, so the
      // same 1.5px shows everywhere — even into the point and the notch's corners, where an inset line thinned out
      const arc = (x, y) => `A${r},${r} 0 0 1 ${x},${y}`;
      if (index === 0) d = `M${r},0 H${w - a} L${w},${h / 2} L${w - a},${h} H${r} ${arc(0, h - r)} V${r} ${arc(r, 0)} Z`;
      else if (index === last) d = `M0,0 H${w - r} ${arc(w, r)} V${h - r} ${arc(w - r, h)} H0 L${a},${h / 2} Z`;
      else d = `M0,0 H${w - a} L${w},${h / 2} L${w - a},${h} H0 L${a},${h / 2} Z`;
    }
  }
  return (
    <svg ref={ref} className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
      {d && <path d={d} fill="none" stroke={color} strokeOpacity={0.4} strokeWidth={arrows ? 3 : 1.5} strokeLinejoin="miter" strokeMiterlimit={10} />}
    </svg>
  );
}
function OnboardingSteps({ value, counts, loading, onChange }) {
  const total = STEPS.reduce((n, s) => n + (counts[s.key]?.length ?? 0), 0);
  const selected = STEPS.find((s) => s.key === value);
  return (
    // Its own container (same frame as the list): a small heading, then the ribbon
    <section aria-labelledby="onboarding-title" className="ln-flat-mobile rounded-card border border-glass-border p-3 shadow-card glass max-sm:pb-1 max-sm:pt-1 sm:px-4 sm:pb-4 sm:pt-3.5">
      {/* The click cue (picked from previews: "Hint in the heading"): a quiet "Pick a step…" after the count; once a step is
          picked it becomes a "Show everyone" link that clears it */}
      {/* Phones: one short line — "Onboarding · 14 on their way in" (the "Pick a step…" hint hides; "Show everyone" stays) */}
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-1 max-sm:mb-2.5 max-sm:px-0">
        <h2 id="onboarding-title" className="flex items-baseline gap-2 text-[13px] font-semibold text-text">
          Onboarding
          <span className="text-xs font-normal text-text-muted">
            {loading ? '' : (
              <>
                {total}
                <span className="max-sm:hidden"> facilitator{total === 1 ? '' : 's'}</span> on their way in
              </>
            )}
          </span>
        </h2>
        {!loading && (
          <span className={cn('text-xs text-text-muted', !selected && 'max-sm:hidden')}>
            <span className="mr-2 text-text-muted/60" aria-hidden="true">
              ·
            </span>
            {selected ? (
              <button
                type="button"
                onClick={() => onChange(selected.key)}
                className="cursor-pointer rounded font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Show everyone
              </button>
            ) : (
              'Pick a step to see who’s there'
            )}
          </span>
        )}
      </div>
      <ol className="hidden grid-cols-3 gap-1 sm:grid" aria-label="Onboarding steps">
        {STEPS.map((s, i) => {
          const n = counts[s.key]?.length ?? 0;
          const on = value === s.key;
          return (
            <li key={s.key} className="min-w-0">
              <button
                type="button"
                onClick={() => onChange(s.key)}
                aria-pressed={on}
                title={on ? 'Show everyone' : `Show ${s.label.toLowerCase()}`}
                className={cn(
                  'group/step relative flex h-16 w-full min-w-0 cursor-pointer items-center gap-3 overflow-hidden text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
                  i === 0 ? 'pl-4 pr-4 sm:pr-8' : i === STEPS.length - 1 ? 'pl-4 pr-4 sm:pl-8' : 'pl-4 pr-4 sm:pl-8 sm:pr-8',
                  'rounded-xl sm:rounded-none',
                  i === 0 && 'sm:rounded-l-xl',
                  i === STEPS.length - 1 && 'sm:rounded-r-xl',
                  ARROW[i],
                  on ? s.on : s.rest,
                  // Phones (no white panel behind): a solid surface with the step's tint laid over it, and a hairline edge
                  'max-sm:bg-surface max-sm:ring-1 max-sm:ring-inset max-sm:ring-border-strong',
                  s.solid,
                )}
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface/80 shadow-xs" aria-hidden="true">
                  <s.icon className={cn('size-[18px]', s.iconTone)} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-text">{s.label}</span>
                  <span className="block truncate text-xs text-text-secondary">{s.hint}</span>
                </span>
                <span className="shrink-0 text-2xl font-bold tabular-nums text-text">{loading ? '–' : n}</span>                {on && <StepOutline index={i} last={STEPS.length - 1} color={s.line} />}
              </button>            </li>
          );
        })}
      </ol>
      {/* Phones: a progress journey (picked from previews: "Progress journey") — one white card, the three steps as
          circles in their colour joined by a line, the count inside each, the short name under. Tap filters the list (as
          above); the picked circle fills with its colour. (Tiles, tinted tiles and stacked rows were rejected.) */}
      <div className="relative rounded-2xl bg-surface px-3 pb-3.5 pt-4 shadow-xs ring-1 ring-border-strong sm:hidden">
        {/* The joining line, from the first circle's centre to the last's */}
        <span className="absolute left-[16.67%] right-[16.67%] top-[2.5rem] h-0.5 rounded-full bg-border-strong" aria-hidden="true" />
        <ol className="relative grid grid-cols-3" aria-label="Onboarding steps">
          {STEPS.map((s) => {
            const n = counts[s.key]?.length ?? 0;
            const on = value === s.key;
            return (
              <li key={s.key} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onChange(s.key)}
                  aria-pressed={on}
                  aria-label={`${s.label}: ${loading ? '' : n}`}
                  title={on ? 'Show everyone' : `Show ${s.label.toLowerCase()}`}
                  className="group flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <span
                    // A solid circle (so the joining line never shows through): the surface with the step's tint laid over it — no
                    // outline by default; picked = a 2px ring in its colour + a touch more tint (no fill, no glow — that was too loud)
                    className="inline-flex size-12 items-center justify-center rounded-full bg-surface text-lg font-bold tabular-nums text-text"
                    style={
                      on
                        ? { boxShadow: `inset 0 0 0 2px ${s.line}, inset 0 0 0 999px color-mix(in srgb, ${s.line} 18%, transparent)` }
                        : { boxShadow: `inset 0 0 0 999px color-mix(in srgb, ${s.line} 14%, transparent)` }
                    }
                  >
                    {loading ? '–' : n}
                  </span>
                  <span className={cn('flex items-center gap-1 text-xs font-semibold', on ? 'text-text' : 'text-text-secondary')}>
                    <s.icon className={cn('size-3.5', s.iconTone)} aria-hidden="true" />
                    {s.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

    </section>
  );
}
// The waiting line per stage: icon, wash and how it's worded
const WAIT = {
  kyc: { icon: FileClock, wash: 'bg-chart-3/[0.07]', iconTone: 'text-warning', what: (n) => (n === 1 ? 'hasn’t finished KYC' : 'haven’t finished KYC'), since: 'link sent' },
  review: {
    icon: ShieldCheck,
    wash: 'bg-chart-4/[0.08]',
    iconTone: 'text-chart-4',
    what: (n) => `${n === 1 ? 'has' : 'have'} submitted KYC and ${n === 1 ? 'is' : 'are'} waiting for approval`,
    since: 'submitted',
  },
  payment: { icon: Landmark, wash: 'bg-info/[0.06]', iconTone: 'text-info', what: (n) => `${n === 1 ? 'needs' : 'need'} a payment setup or  waiting on it`, since: 'KYC done' },
};

/** The slim line on a pending pill: "9 haven't finished KYC · oldest link sent 7 days ago" + the bulk action (if any) */
function WaitingLine({ status, people, busy, onSend }) {
  const w = WAIT[status];
  const n = people.length;
  const oldest = Math.max(...people.map((f) => daysSince(waitingSince(f))));
  return (
    // Phones: a rounded strip inside the page margins, one short line + a compact button (the full sentence was cramped)
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-strong px-4 py-2.5 animate-fade-in max-sm:mx-3 max-sm:mt-2 max-sm:flex-nowrap max-sm:rounded-xl max-sm:border-0 max-sm:px-3 max-sm:py-2 sm:px-5', w.wash)}>
      <w.icon className={cn('size-4 shrink-0', w.iconTone)} aria-hidden="true" />
      <p className="min-w-0 flex-1 text-[13px] text-text-secondary">
        <span className="font-semibold tabular-nums text-text">{n}</span> <span className="max-sm:hidden">{w.what(n)}</span>
        <span className="sm:hidden">waiting</span>
        <span className="text-text-muted">
          {' '}
          · oldest <span className="max-sm:hidden">{w.since} </span>
          {oldest === 0 ? 'today' : <span>{dayWord(oldest)}<span className="max-sm:hidden"> ago</span></span>}
        </span>
      </p>
      {onSend && (
        <Button variant="secondary" size="sm" leftIcon={Send} onClick={onSend} loading={busy} className="shrink-0">
          <span className="max-sm:hidden">Resend KYC to all</span>
          <span className="sm:hidden">Resend all</span>
        </Button>
      )}
    </div>
  );
}
/** Edit, plus the action that fits the status (Resend KYC / Remind about payment setup / Send agreement renewal) */
function RowActions({ f, action, busy, onEdit }) {
  return (
    <>
      {action?.button ? (
        // A labelled button, so the next step is obvious: Verify in the stage's violet; payment setup in blue (set up),
        // plain (view) or red (revise a rejected one)
        <Button
          variant="secondary"
          size="sm"
          leftIcon={action.icon}
          onClick={() => action.go(f)}
          aria-label={`${action.label} — ${f.name}`}
          className={cn(
            'mr-1',
            !action.tone && 'border-chart-4/40 text-chart-4 hover:bg-chart-4/10',
            action.tone === 'primary' && 'border-primary/40 text-primary-text hover:bg-primary-soft',
            action.tone === 'danger' && 'border-danger/35 text-danger hover:bg-danger-soft',
          )}
        >
          {action.button}
        </Button>
      ) : (
        action && <IconButton icon={action.icon} label={`${action.label} — ${f.name}`} size="sm" onClick={() => action.go(f)} disabled={busy} className="hover:bg-primary-soft hover:text-primary-text" />
      )}
      <IconButton icon={Pencil} label={`Edit ${f.name}`} size="sm" onClick={onEdit} />
    </>
  );
}

/**
 * Payment setup pending: where their payment setup stands — "Ready to set up" (since KYC was done; amber after a week),
 * "Waiting for <name>" (sent, with when), or "Rejected by <name>" with the start of their reason.
 */
function PaymentStateCell({ f }) {
  const p = f.paymentSetup;
  const first = f.name.split(' ')[0];
  if (p?.state === 'sent') {
    return (
      <div className="text-[13px]">
        <p className="inline-flex items-center gap-1.5 font-medium text-info">
          <Clock className="size-3.5" aria-hidden="true" />
          Waiting for {first}
        </p>
        <p className="text-xs tabular-nums text-text-muted">
          {p.round > 1 ? `Round ${p.round} · resent` : 'Sent'} {ago(p.sentAt)} · {formatDate(p.sentAt)}
        </p>
      </div>
    );
  }
  if (p?.state === 'rejected') {
    return (
      <div className="max-w-[16rem] text-[13px]">
        <p className="inline-flex items-center gap-1.5 font-medium text-danger">
          <XCircle className="size-3.5" aria-hidden="true" />
          Rejected by {first}
        </p>
        <p className="truncate text-xs text-text-muted" title={p.rejection.reason}>
          “{p.rejection.reason}”
        </p>
      </div>
    );
  }
  const d = daysSince(f.kycDoneAt);
  return (
    <div className="text-[13px] tabular-nums">
      <p className={cn('font-medium', d >= 7 ? 'text-warning' : 'text-text')}>Ready to set up</p>
      <p className="text-xs text-text-muted">KYC done {ago(f.kycDoneAt)} · {formatDate(f.kycDoneAt)}</p>
    </div>
  );
}

/** All view: the status as the same badge All Clients uses (StatusBadge) */
function StatusCell({ f }) {
  return <StatusBadge status={STATUS[stageOf(f)].badge} />;
}
/** Active / Expired views: when the agreement runs till (amber within 30 days) or when it ended */
function AgreementCell({ f }) {
  if (f.status === 'expired') {
    return (
      <div className="text-[13px] tabular-nums">
        <p className="text-danger">Ended {ago(f.agreementEnd)}</p>
        <p className="text-xs text-text-muted">{formatDate(f.agreementEnd)}</p>
      </div>
    );
  }
  const left = Math.max(0, Math.ceil((new Date(f.agreementEnd) - Date.now()) / 864e5));
  return (
    <div className="text-[13px] tabular-nums">
      <p className="text-text">Till {formatDate(f.agreementEnd)}</p>
      <p className={cn('text-xs', left <= 30 ? 'font-medium text-warning' : 'text-text-muted')}>{left <= 30 ? `Ends in ${dayWord(left)}` : `${Math.round(left / 30)} months left`}</p>
    </div>
  );
}

/** Channel partner / both, as a quiet tag next to the name */
function TypeTag({ type }) {
  return (
    <span
      className="inline-flex h-[18px] shrink-0 items-center rounded px-1.5 text-[10px] font-semibold uppercase tracking-wide text-chart-4 ring-1 ring-inset ring-chart-4/25"
      title={TYPE_LABEL[type]}
    >
      {type === 'both' ? 'Partner too' : 'Partner'}
    </span>
  );
}

/** The first item as a chip and "+n" for the rest (all of them on hover) */
function TagList({ items }) {
  return (
    <span className="inline-flex max-w-[13rem] items-center gap-1" title={items.join(', ')}>
      <span className="truncate rounded-md bg-text-muted/10 px-1.5 py-0.5 text-xs font-medium text-text-secondary">{items[0]}</span>
      {items.length > 1 && <span className="shrink-0 text-xs font-semibold tabular-nums text-text-muted">+{items.length - 1}</span>}
    </span>
  );
}

/** A quiet dash for "not known yet" (before KYC) */
function Dash() {
  return (
    <span className="text-text-muted/60" title="Not known until they finish KYC">
      —
    </span>
  );
}

/** Filters panel (same pattern as All Clients): edits a draft, applied with "Show N facilitators" (live count) */
function FacilitatorFiltersDrawer({ open, onClose, filters, onApply, all, entities, search }) {
  // Phones: the All / Active / Expired pills aren't shown there, so the drawer offers Status (as All Clients' drawer does)
  const showStatus = useIsMobile();
  const [draft, setDraft] = useState(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const count = applyFilters(all, draft, search).length;

  const entityOptions = useMemo(
    () =>
      entities
        .map((e) => ({ value: e.id, label: e.name, description: `${all.filter((f) => f.entities.includes(e.id)).length} facilitators` }))
        .filter((o) => all.some((f) => f.entities.includes(o.value)))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [entities, all],
  );
  const stateOptions = useMemo(
    () => [...new Set(all.map((f) => f.address.state))].sort().map((s) => ({ value: s, label: s, description: `${all.filter((f) => f.address.state === s).length} facilitators` })),
    [all],
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter facilitators"
      description="By entity, type or state"
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
            {count === 0 ? 'No matching facilitators' : `Show ${count} ${count === 1 ? 'facilitator' : 'facilitators'}`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {showStatus && (
          <FilterSection icon={CheckCircle2} tone="green" title="Status" onClear={draft.status !== 'all' ? () => set({ status: 'all' }) : undefined}>
            <SegmentedControl
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'active', label: STATUS.active.label },
                { value: 'expired', label: 'Expired' },
              ]}
              value={draft.status}
              onChange={(status) => set({ status })}
              ariaLabel="Status"
              fullWidth
            />
          </FilterSection>
        )}
        <FilterSection icon={Building2} tone="blue" title="Onboarded for" onClear={draft.entities.length ? () => set({ entities: [] }) : undefined}>
          <MultiSelect options={entityOptions} value={draft.entities} onChange={(v) => set({ entities: v })} placeholder="Any entity" searchPlaceholder="Search entities…" />
        </FilterSection>
        <FilterSection icon={UserRound} tone="violet" title="Type" onClear={draft.type !== 'all' ? () => set({ type: 'all' }) : undefined}>
          <SegmentedControl
            tabs={[{ value: 'all', label: 'All' }, ...TYPES.map(({ value, label }) => ({ value, label: value === 'partner' ? 'Partner' : label }))]}
            value={draft.type}
            onChange={(type) => set({ type })}
            ariaLabel="Type"
            fullWidth
          />
        </FilterSection>
        <FilterSection icon={MapPin} tone="green" title="State" onClear={draft.states.length ? () => set({ states: [] }) : undefined}>
          <MultiSelect options={stateOptions} value={draft.states} onChange={(v) => set({ states: v })} placeholder="Any state" searchPlaceholder="Search states…" />
        </FilterSection>
      </div>
    </Drawer>
  );
}

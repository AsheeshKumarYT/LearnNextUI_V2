import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  IndianRupee,
  MessageSquareWarning,
  Pencil,
  Plane,
  Send,
  Hotel,
  WalletCards,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { addDays, formatDate } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { facilitatorsApi, financialYearOf } from '@/services/api';
import { Button, ConfirmDialog, DatePicker, FormField, Input, Modal, SegmentedControl, Select, Stepper, Switch } from '@/components/ui';

// What each agreement type means, shown under the toggle
const AGREEMENT_HELP = {
  facilitator: 'Pays them for delivering sessions',
  sales: 'Pays them for bringing in business',
  both: 'Pays them for sessions and for sales',
};

// The three steps and the fields each one checks
const STEPS = [
  { label: 'Agreement', fields: ['category', 'startDate', 'validity', 'financialYear'] },
  { label: 'Fees', fields: ['dayFee', 'coachingF2F', 'coachingVirtual'] },
  { label: 'Travel & stay', fields: ['flights', 'hotels'] },
];
const LAST = STEPS.length - 1;
const MAX_FEE = 1000000;

const blank = (f) => {
  const start = addDays(new Date(), 7);
  start.setHours(0, 0, 0, 0);
  return {
    category: 'new',
    startDate: start.toISOString(),
    validity: '12',
    financialYear: financialYearOf(start),
    agreementType: f?.type === 'partner' ? 'sales' : f?.type === 'both' ? 'both' : 'facilitator',
    onBehalfOf: 'person',
    dayFee: '',
    feedbackSlab: '',
    coaching: false,
    coachingF2F: '',
    coachingVirtual: '',
    flights: ['economy'],
    hotels: ['3', '4'],
  };
};
const formOf = (f) => {
  if (!f?.paymentSetup) return blank(f);
  const { state, sentAt, sentBy, round, rejection, history, ...form } = f.paymentSetup;  
  return { ...blank(f), ...form };
};

const fee = (v, label) => {
  if (!String(v).trim()) return `Enter the ${label}`;
  const n = Number(v);
  if (!(n > 0)) return 'Enter an amount above ₹0';
  if (n > MAX_FEE) return 'Enter an amount up to ₹10,00,000';
  return undefined;
};
function validate(form) {
  return {
    category: form.category ? undefined : 'Choose a category',
    startDate: form.startDate ? undefined : 'Pick the start date',
    validity: form.validity ? undefined : 'Choose how long the agreement runs',
    financialYear: form.financialYear ? undefined : 'Choose the financial year',
    dayFee: fee(form.dayFee, 'day fee'),
    coachingF2F: form.coaching ? fee(form.coachingF2F, 'face-to-face fee') : undefined,
    coachingVirtual: form.coaching ? fee(form.coachingVirtual, 'virtual fee') : undefined,
    flights: form.flights.length ? undefined : 'Pick at least one flight class',
    hotels: form.hotels.length ? undefined : 'Pick at least one hotel category',
  };
}

const rupees = (v) => `₹${Number(v).toLocaleString('en-IN')}`;
const endOf = (form) => (form.startDate ? addDays(new Date(new Date(form.startDate).setMonth(new Date(form.startDate).getMonth() + Number(form.validity))), -1) : null);

/**
 * Payment setup for a facilitator whose KYC is done (Payment setup pending) — picked from previews: "3-step modal".
 * Agreement (category, start, validity → end date, financial year, agreement type, on whose behalf) → Fees (day-wise fee,
 * feedback bonus, coaching F2F / virtual) → Travel & stay (flight classes, hotel categories, as tap chips) with a short
 * summary; then Send for approval — the facilitator approves (→ Active) or rejects with a reason.
 * Opens on the summary (read-only) when the setup is already with the facilitator; Edit & resend reopens the steps.
 * A rejected setup opens with their reason on top, ready to revise.
 */
export function PaymentSetupModal({ open, facilitator: f, onClose, onSent }) {
  const toast = useToast();
  const { user } = useAuth();
  const lookups = useMemo(() => facilitatorsApi.paymentSetupLookups(), []);
  const initial = useMemo(() => formOf(f), [f]);
  const sent = f?.paymentSetup?.state === 'sent';
  const rejected = f?.paymentSetup?.state === 'rejected';
  const log = f?.paymentSetup?.history ?? [];

  const [form, setForm] = useState(initial);
  const [viewing, setViewing] = useState(sent);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial);
    setViewing(sent);
    setStep(0);
    setReached(f?.paymentSetup ? LAST : 0);
    setTouched({});
    setTried({});
    setSaving(false);
    setShowLog(false);
  }, [open, initial, sent, f]);

  const set = (patch) => setForm((x) => ({ ...x, ...patch }));
  const errors = useMemo(() => validate(form), [form]);
  const stepOf = (k) => STEPS.findIndex((s) => s.fields.includes(k));
  // "Required" errors once Continue / Send was pressed on that step; typed-value errors after leaving the field
  const err = (k) => (tried[stepOf(k)] || touched[k] ? errors[k] : undefined);
  // Only a field with something typed in is checked on leaving it — an empty one waits for Continue / Send
  const blur = (k) => () => String(form[k] ?? '').trim() && setTouched((t) => ({ ...t, [k]: true }));
  const stepErrors = (i) => STEPS[i].fields.filter((k) => errors[k]);
  const changed = JSON.stringify(form) !== JSON.stringify(initial);

  const close = () => (!viewing && changed && !saving ? setConfirmClose(true) : onClose());
  const go = (i) => {
    setStep(i);
    setReached((r) => Math.max(r, i));
    requestAnimationFrame(() => document.querySelector('[role=dialog] .overflow-y-auto')?.scrollTo({ top: 0 }));
  };
  const next = () => {
    setTried((t) => ({ ...t, [step]: true }));
    if (!stepErrors(step).length) go(step + 1);
  };
  const send = async () => {
    const bad = STEPS.findIndex((_, i) => stepErrors(i).length);
    if (bad >= 0) {
      setTried(Object.fromEntries(STEPS.map((_, i) => [i, true])));
      if (bad !== step) go(bad);
      return;
    }
    setSaving(true);
    try {
      await facilitatorsApi.sendPaymentSetup(f.id, form, user?.name ?? 'Training Partner');
      toast.success('Sent for approval', { description: `${f.name} will review the payment setup` });
      onSent?.();
      onClose();
    } catch (e) {
      toast.error('Couldn’t send the payment setup', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const digits = (k) => (e) => set({ [k]: e.target.value.replace(/\D/g, '').slice(0, 7) });
  const toggle = (k, v) => set({ [k]: form[k].includes(v) ? form[k].filter((x) => x !== v) : [...form[k], v] });
  const end = endOf(form);

  const footer = viewing ? (
    <>
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
      <Button variant="secondary" leftIcon={Pencil} onClick={() => setViewing(false)}>
        Edit & resend
      </Button>
    </>
  ) : (
    <>
      <span className="hidden text-xs text-text-muted sm:mr-auto sm:block">
        Step {step + 1} of {STEPS.length}
      </span>
      {step === 0 ? (
        <Button variant="ghost" onClick={close} disabled={saving}>
          Cancel
        </Button>
      ) : (
        <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => go(step - 1)} disabled={saving}>
          Back
        </Button>
      )}
      {step < LAST ? (
        <Button rightIcon={ArrowRight} onClick={next}>
          Continue
        </Button>
      ) : (
        <Button leftIcon={Send} onClick={send} loading={saving}>
          {sent || rejected ? 'Send again' : 'Send for approval'}
        </Button>
      )}
    </>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="xl"
        icon={WalletCards}
        title={viewing ? 'Payment setup' : rejected ? 'Revise payment setup' : 'Set up payment'}
        description={f ? `${f.name} · ${f.email}` : ''}
        footer={footer}
        panelClassName="sm:max-w-2xl"
      >
        {f && viewing ? (
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 rounded-xl bg-info/[0.07] px-3.5 py-2.5 text-[13px] text-text-secondary">
              <Clock className="size-4 shrink-0 text-info" aria-hidden="true" />
              Waiting for {f.name.split(' ')[0]} to approve · sent {formatDate(f.paymentSetup.sentAt)} by {f.paymentSetup.sentBy}
            </p>
            <Summary form={form} lookups={lookups} />
            {log.length > 0 && (
              <div className="mt-1 border-t border-border pt-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">History</p>
                <History history={log} lookups={lookups} />
              </div>
            )}
          </div>
        ) : (
          <>
            {rejected && step === 0 && (
              <div className="mb-5 flex gap-3 rounded-xl border border-danger/20 bg-danger-soft/50 px-3.5 py-3">
                <MessageSquareWarning className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
                <div className="min-w-0 text-[13px]">
                  <p className="font-medium text-text">
                    {f.name.split(' ')[0]} rejected it on {formatDate(f.paymentSetup.rejection.at)}
                  </p>
                  <p className="mt-0.5 text-text-secondary">“{f.paymentSetup.rejection.reason}”</p>
                  {log.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowLog((v) => !v)}
                      aria-expanded={showLog}
                      className="mt-1.5 cursor-pointer text-xs font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {showLog ? 'Hide history' : `Show history · ${log.length} entries`}
                    </button>
                  )}
                </div>
              </div>
            )}
            {rejected && step === 0 && showLog && (
              <div className="-mt-2 mb-5 animate-fade-in rounded-xl border border-border px-3.5 py-3">
                <History history={log} lookups={lookups} />
              </div>
            )}

            <Stepper steps={STEPS} current={step} reachable={reached} onStepClick={go} orientation="horizontal" className="mb-5 border-b border-border pb-5 [&_li]:min-w-0 [&_p]:truncate" />

            <div key={step} className="grid animate-fade-in grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {step === 0 && (
                <>
                  <FormField label="Payment setup category" required error={err('category')}>
                    <Select value={form.category} onChange={(e) => set({ category: e.target.value })} options={lookups.categories} />
                  </FormField>
                  <FormField label="Contract start date" required error={err('startDate')}>
                    <DatePicker
                      value={form.startDate ? new Date(form.startDate) : null}
                      onChange={(d) => set({ startDate: d ? d.toISOString() : null, ...(d ? { financialYear: financialYearOf(d) } : {}) })}
                      placeholder="Pick a date"
                    />
                  </FormField>
                  <FormField label="Agreement validity" required error={err('validity')} helper={end ? `Runs till ${formatDate(end)}` : undefined}>
                    <Select value={form.validity} onChange={(e) => set({ validity: e.target.value })} options={lookups.validity} />
                  </FormField>
                  <FormField label="Financial year" required error={err('financialYear')}>
                    <Select value={form.financialYear} onChange={(e) => set({ financialYear: e.target.value })} options={lookups.financialYears} />
                  </FormField>
                  {/* Slim segmented toggles (picked from previews: "Segmented toggle"), side by side; a quiet line explains the pick */}
                  <FormField label="Agreement type" required helper={AGREEMENT_HELP[form.agreementType]}>
                    <SegmentedControl
                      fullWidth
                      ariaLabel="Agreement type"
                      value={form.agreementType}
                      onChange={(v) => set({ agreementType: v })}
                      tabs={[
                        { value: 'facilitator', label: 'Facilitator' },
                        { value: 'sales', label: 'Sales' },
                        { value: 'both', label: 'Both' },
                      ]}
                      className="w-full"
                    />
                  </FormField>
                  <FormField
                    label="Agreement on behalf of"
                    required
                    helper={form.onBehalfOf === 'firm' ? 'Made out to their firm' : 'Made out to the person'}
                  >
                    <SegmentedControl
                      fullWidth
                      ariaLabel="Agreement on behalf of"
                      value={form.onBehalfOf}
                      onChange={(v) => set({ onBehalfOf: v })}
                      tabs={[
                        { value: 'person', label: <span className="max-w-[9rem] truncate">{f?.name ?? 'The person'}</span> },
                        { value: 'firm', label: 'Their firm' },
                      ]}
                      className="w-full"
                    />
                  </FormField>
                </>
              )}

              {step === 1 && (
                <>
                  <FormField label="Day-wise fee" required error={err('dayFee')} helper="Paid for each training day">
                    <Input leftIcon={IndianRupee} inputMode="numeric" placeholder="0" value={form.dayFee} onChange={digits('dayFee')} onBlur={blur('dayFee')} />
                  </FormField>
                  <FormField label="Feedback slab" helper="The feedback range and the bonus it earns, on top of the day fee">
                    <Select
                      value={form.feedbackSlab}
                      onChange={(e) => set({ feedbackSlab: e.target.value })}
                      placeholder="Select feedback range"
                      options={lookups.feedbackSlabs.map((s) => ({ value: s.value, label: `${s.label} | ${s.bonus}` }))}
                    />
                  </FormField>
                  <div className="rounded-xl border border-border bg-surface-secondary/50 p-4 sm:col-span-2">
                    <Switch checked={form.coaching} onChange={(v) => set({ coaching: v })} label="Coaching sessions" description="Also pays for one-to-one coaching" />
                    {form.coaching && (
                      <div className="mt-4 grid grid-cols-1 gap-4 animate-fade-in sm:grid-cols-2">
                        <FormField label="Face-to-face fee" required error={err('coachingF2F')}>
                          <Input leftIcon={IndianRupee} inputMode="numeric" placeholder="0" value={form.coachingF2F} onChange={digits('coachingF2F')} onBlur={blur('coachingF2F')} />
                        </FormField>
                        <FormField label="Virtual fee" required error={err('coachingVirtual')}>
                          <Input leftIcon={IndianRupee} inputMode="numeric" placeholder="0" value={form.coachingVirtual} onChange={digits('coachingVirtual')} onBlur={blur('coachingVirtual')} />
                        </FormField>
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <FormField label="Flight classes allowed" required error={err('flights')} className="sm:col-span-2">
                    <Chips icon={Plane} options={lookups.flights} value={form.flights} onToggle={(v) => toggle('flights', v)} />
                  </FormField>
                  <FormField label="Hotel categories allowed" required error={err('hotels')} className="sm:col-span-2">
                    <Chips icon={Hotel} options={lookups.hotels} value={form.hotels} onToggle={(v) => toggle('hotels', v)} />
                  </FormField>
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">Summary</p>
                    <Summary form={form} lookups={lookups} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title="Discard this payment setup?"
        description="What you’ve filled in won’t be saved."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/** Tap chips for a multi-choice (flight classes, hotel categories) */
function Chips({ icon: Icon, options, value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(o.value)}
            className={cn(
              'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              on ? 'border-primary/40 bg-primary-soft text-primary-text' : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text',
            )}
          >
            {on ? <Check className="size-3.5" aria-hidden="true" /> : <Icon className="size-3.5 text-text-muted" aria-hidden="true" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** The terms tracked between rounds — what changed is listed on each resend in the history */
const TRACKED = [
  ['category', 'Category', (v, l) => l.categories.find((x) => x.value === v)?.label],
  ['startDate', 'Start date', (v) => (v ? formatDate(v) : '—')],
  ['validity', 'Validity', (v) => `${v} months`],
  ['financialYear', 'Financial year', (v) => v],
  ['agreementType', 'Agreement type', (v) => ({ facilitator: 'Facilitator', sales: 'Sales', both: 'Both' })[v]],
  ['onBehalfOf', 'On behalf of', (v) => (v === 'firm' ? 'Firm name' : 'Person’s name')],
  ['dayFee', 'Day fee', (v) => (v ? rupees(v) : '—')],
  ['feedbackSlab', 'Feedback slab', (v, l) => l.feedbackSlabs.find((s) => s.value === v)?.label ?? 'None'],
  ['coaching', 'Coaching', (v) => (v ? 'Included' : 'Not included')],
  ['coachingF2F', 'Face-to-face fee', (v) => (v ? rupees(v) : '—')],
  ['coachingVirtual', 'Virtual fee', (v) => (v ? rupees(v) : '—')],
  ['flights', 'Flights', (v, l) => v.map((x) => l.flights.find((o) => o.value === x)?.label).join(', ') || '—'],
  ['hotels', 'Hotels', (v) => v.map((x) => `${x}★`).join(', ') || '—'],
];
const changesBetween = (prev, next, lookups) =>
  TRACKED.filter(([k]) => JSON.stringify(prev[k] ?? '') !== JSON.stringify(next[k] ?? '')).map(([k, label, fmt]) => ({
    label,
    from: fmt(prev[k], lookups),
    to: fmt(next[k], lookups),
  }));

/**
 * Revision log (picked from previews: "Timeline in the modal") — every send and every answer from the facilitator,
 * newest first. A resend lists what changed since the round before; the first send shows its key terms.
 */
function History({ history, lookups }) {
  const rows = history
    .map((h, i) => {
      if (h.kind !== 'sent') return h;
      const prev = history.slice(0, i).findLast((x) => x.kind === 'sent');
      return { ...h, changes: prev ? changesBetween(prev.terms, h.terms, lookups) : null };
    })
    .reverse();
  return (
    <ol className="relative">
      {rows.map((h, i) => (
        <li key={`${h.kind}-${h.at}`} className="relative flex gap-3 pb-4 last:pb-0">
          {i < rows.length - 1 && <span className="absolute left-[4.5px] top-3 bottom-0 w-px bg-border" aria-hidden="true" />}
          <span className={cn('relative mt-[5px] size-2.5 shrink-0 rounded-full ring-4 ring-elevated', h.kind === 'rejected' ? 'bg-danger/70' : i === 0 ? 'bg-primary' : 'bg-border-strong')} aria-hidden="true" />
          <div className="min-w-0 text-[13px]">
            <p className="text-text">
              <span className="font-medium">
                Round {h.round} · {h.kind === 'rejected' ? `rejected by ${h.by.split(' ')[0]}` : `sent by ${h.by}`}
              </span>
              <span className="text-text-muted"> · {formatDate(h.at)}</span>
            </p>
            {h.kind === 'rejected' ? (
              <p className="mt-0.5 text-text-secondary">“{h.reason}”</p>
            ) : h.changes ? (
              h.changes.length ? (
                <ul className="mt-0.5 space-y-0.5 text-text-secondary">
                  {h.changes.map((c) => (
                    <li key={c.label}>
                      {c.label} <span className="text-text-muted line-through decoration-text-muted/50">{c.from}</span> → <span className="font-medium text-text">{c.to}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-0.5 text-text-muted">Sent again with no changes</p>
              )
            ) : (
              <p className="mt-0.5 text-text-secondary">
                Day fee {h.terms.dayFee ? rupees(h.terms.dayFee) : '—'} · {h.terms.validity} months from {formatDate(h.terms.startDate)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The whole setup in a few lines — the last step's check, and the read-only view while it's with the facilitator */
function Summary({ form, lookups }) {
  const label = (list, v) => list.find((x) => x.value === v)?.label ?? '—';
  const end = endOf(form);
  const slab = lookups.feedbackSlabs.find((s) => s.value === form.feedbackSlab);
  const rows = [
    ['Agreement', `${label(lookups.categories, form.category)} · ${label([{ value: 'facilitator', label: 'Facilitator' }, { value: 'sales', label: 'Sales' }, { value: 'both', label: 'Facilitator & sales' }], form.agreementType)} agreement`],
    ['Runs', form.startDate ? `${formatDate(form.startDate)} → ${end ? formatDate(end) : '—'} · ${form.validity} months · FY ${form.financialYear}` : '—'],
    ['Fees', `${form.dayFee ? `${rupees(form.dayFee)} a day` : '—'} · ${slab ? `feedback slab ${slab.label} (${slab.bonus} bonus)` : 'no feedback slab'}`],
    ['On behalf of', form.onBehalfOf === 'firm' ? 'Facilitator / channel partner firm name' : 'Facilitator / channel partner name'],
    ['Coaching', form.coaching ? `${form.coachingF2F ? rupees(form.coachingF2F) : '—'} face-to-face · ${form.coachingVirtual ? rupees(form.coachingVirtual) : '—'} virtual` : 'Not included'],
    ['Travel & stay', `${form.flights.map((v) => label(lookups.flights, v)).join(', ') || '—'} · ${form.hotels.map((v) => `${v}★`).join(', ') || '—'} hotels`],
  ];
  return (
    <dl className="divide-y divide-border rounded-xl border border-border bg-surface">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 px-3.5 py-2.5 text-[13px]">
          <dt className="text-text-muted">{k}</dt>
          <dd className="font-medium text-text">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

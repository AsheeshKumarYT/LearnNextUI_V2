import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, DatabaseZap, IdCard, Info, ListChecks, MapPinned, ReceiptText, SearchX, UsersRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { setLeaveGuard } from '@/utils/leaveGuard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { clientsApi } from '@/services/api';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { INITIAL_CLIENT, errorsForStep, isDirty, stepsFor } from '@/shared/clients/components/clientForm';
import { TrainingTypeStep } from './components/TrainingTypeStep';
import { DetailsStep } from './components/DetailsStep';
import { AddressStep } from '@/shared/clients/components/AddressStep';
import { BillingStep } from '@/shared/clients/components/BillingStep';
import { CRM_STAGES, CRM_STAGE_MS, CrmBanner, CrmFetchCard } from './components/CrmSync';

const STEP_ICONS = { type: UsersRound, details: IdCard, address: MapPinned, billing: ReceiptText };

/**
 * Add client — Training for → Details → Addresses → Billing (companies only).
 * Each step checks its fields before moving on; errors show on Continue or once a filled field loses focus.
 * Edit client (/clients/:id/edit) — the same form, pre-filled: any step can be opened, status can be changed,
 * and "Save changes" (on every step) checks all steps before saving.
 */
export default function AddClient() {
  const { id } = useParams();
  const existing = useMemo(() => (id ? clientsApi.get(id) : null), [id]);
  if (id && !existing) return <ClientNotFound />;
  return <ClientForm key={id ?? 'new'} existing={existing} />;
}

function ClientNotFound() {
  const navigate = useNavigate();
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Client not found"
        description="It may have been removed, or the link is out of date."
        action={
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/clients')}>
            All clients
          </Button>
        }
      />
    </Card>
  );
}

function ClientForm({ existing }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const editing = !!existing;
  // Editing: the client's own name isn't a duplicate of itself
  const lookups = useMemo(() => {
    const l = clientsApi.lookups();
    return editing ? { ...l, existingClients: l.existingClients.filter((n) => n !== existing.name) } : l;
  }, [editing, existing]);
  const initial = useMemo(() => (editing ? { ...INITIAL_CLIENT, ...existing.form } : INITIAL_CLIENT), [editing, existing]);

  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState(existing?.status ?? 'active');
  const [step, setStep] = useState(editing ? 1 : 0);
  const [attempted, setAttempted] = useState(() => new Set());
  const [touched, setTouched] = useState(() => new Set());
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaveTo, setLeaveTo] = useState('/clients'); // where to go once the user confirms discarding
  // CRM portal sync for companies: idle → fetching → done (name = the company it was fetched for)
  const [crm, setCrm] = useState({ status: 'idle', name: '' });
  const crmRun = useRef(0);

  const steps = stepsFor(values.trainingFor);
  const key = steps[step].key;
  const last = step === steps.length - 1;

  // Code is generated as soon as the type is chosen (CMP… / PRT…); an existing client keeps its code
  const v = { ...values, code: editing ? values.code : values.trainingFor ? clientsApi.nextCode(values.trainingFor) : '' };

  // A company that's already on file can't be added twice
  const duplicate = key === 'details' && v.trainingFor === 'company' && lookups.existingClients.some((n) => n.toLowerCase() === v.companyName.trim().toLowerCase());
  const errors = { ...errorsForStep(key, v), ...(duplicate && { companyName: 'This company is already in All Clients' }) };
  const visible = Object.fromEntries(Object.entries(errors).filter(([k]) => attempted.has(key) || touched.has(k)));
  const err = (k) => visible[k];
  const set = (k, x) => setValues((s) => ({ ...s, [k]: x }));
  const blur = (k) => setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));

  const goTo = (i) => {
    setStep(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate the current step; reveal errors and focus the first one, or move on / save
  const advance = () => {
    if (Object.keys(errors).length) {
      setAttempted((a) => new Set(a).add(key));
      requestAnimationFrame(() => document.querySelector('#add-client [aria-invalid="true"]')?.focus());
      return;
    }
    if (last) save();
    else goTo(step + 1);
  };

  const save = async () => {
    if (v.trainingFor === 'company' && v.billing.length === 0) {
      toast.error('Add a billing address', { description: 'Save at least one billing address with its GST No.' });
      return;
    }
    setSaving(true);
    try {
      const client = await clientsApi.create(v, user?.name ?? 'You');
      toast.success('Client added', { description: `${client.name} (${client.code})`, afterLoad: true });
      navigate('/clients');
    } catch (e) {
      toast.error('Couldn’t add the client', { description: e.message });
      setSaving(false);
    }
  };

  // Picking a CRM company pulls its whole profile and fills every step (the stages animate for at least ~2s)
  const fetchFromCrm = async (name) => {
    const run = ++crmRun.current;
    setCrm({ status: 'fetching', name });
    try {
      const [record] = await Promise.all([clientsApi.crmFetch(name), new Promise((r) => setTimeout(r, CRM_STAGE_MS * CRM_STAGES.length + 300))]);
      if (run !== crmRun.current) return; // a newer pick replaced this one
      setValues((s) => ({ ...s, ...record }));
      setTouched(new Set());
      setCrm({ status: 'done', name });
      toast.success('Fetched from CRM portal', { description: `${name} — every step is pre-filled. Review and continue.` });
    } catch (e) {
      if (run !== crmRun.current) return;
      setCrm({ status: 'idle', name: '' });
      toast.error('Couldn’t reach the CRM portal', { description: e.message });
    }
  };
  const fetching = crm.status === 'fetching';
  const crmFilled = crm.status === 'done' && values.trainingFor === 'company' && values.companyName === crm.name;

  // Edit: check every step, open the first one with problems, otherwise save
  const saveChanges = async () => {
    const dupe = v.trainingFor === 'company' && lookups.existingClients.some((n) => n.toLowerCase() === v.companyName.trim().toLowerCase());
    const bad = steps.findIndex((s) => s.key !== 'type' && (Object.keys(errorsForStep(s.key, v)).length || (s.key === 'details' && dupe)));
    if (bad >= 0) {
      setAttempted((a) => new Set(a).add(steps[bad].key));
      goTo(bad);
      toast.error('Check the highlighted fields', { description: `${steps[bad].label} needs a few fixes before saving.` });
      requestAnimationFrame(() => setTimeout(() => document.querySelector('#add-client [aria-invalid="true"]')?.focus(), 350));
      return;
    }
    if (v.trainingFor === 'company' && v.billing.length === 0) {
      goTo(steps.findIndex((s) => s.key === 'billing'));
      toast.error('Add a billing address', { description: 'Save at least one billing address with its GST No.' });
      return;
    }
    setSaving(true);
    try {
      const client = await clientsApi.update(existing.id, v, status, user?.name ?? 'You');
      toast.success('Changes saved', { description: `${client.name} (${client.code})`, afterLoad: true });
      navigate('/clients');
    } catch (e) {
      toast.error('Couldn’t save the changes', { description: e.message });
      setSaving(false);
    }
  };

  const changed = editing ? status !== existing.status || JSON.stringify(values) !== JSON.stringify(initial) : isDirty(values);
  // Leave for 	o (default: All Clients) — asks first when there are unsaved changes
  const leave = (to = '/clients') => {
    if (!changed) return navigate(to);
    setLeaveTo(to);
    setConfirmLeave(true);
  };
  // Links outside the form (the header breadcrumbs) ask too
  useEffect(() => setLeaveGuard((to) => (changed ? (leave(to), true) : false)));

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      {/* Same language as the other pages: a tinted glass steps card on the left, glass section cards on the right.
          Fills the page height (see AdminLayout); the steps card is as tall as the window and stays put on long steps. */}
      <div className="grid grid-cols-1 gap-6 lg:flex-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card tint="primary" subtleTint padding="none" className="hidden flex-col px-5 py-6 xl:sticky xl:top-[calc(var(--app-header-h)+2rem)] xl:flex xl:transition-[top] xl:duration-300 xl:ease-out xl:min-h-[calc(100dvh-6.75rem)] xl:self-start">
          {/* Soft tone-matched icon tile — a checklist, so it doesn't repeat the page header's icon */}
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
            <ListChecks className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[15px] font-semibold text-text">{editing ? 'Edit client' : 'New client'}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {editing ? 'Open any step to make changes.' : crmFilled ? 'Pre-filled from the CRM portal — just review.' : values.trainingFor ? `${steps.length} quick steps for ${values.trainingFor === 'company' ? 'a company' : 'an individual'}.` : 'Takes about two minutes.'}
          </p>

          <ol className="mt-7 flex flex-col">
            {steps.map((s, i) => {
              // Editing: every step is already complete and can be opened (except the training type, which is fixed)
              const state = i === step ? 'current' : editing || i < step ? 'done' : 'upcoming';
              const canOpen = editing ? i > 0 : i <= step;
              const Icon = STEP_ICONS[s.key];
              return (
                <li key={s.key} className="relative pb-3.5 last:pb-0">
                  {i < steps.length - 1 && (
                    // Connector: centred under the 32px circle (6px button padding + 16px) with a 4px gap at both ends
                    <span className={cn('absolute -bottom-[5px] left-[21px] top-[45px] w-0.5 rounded-full', editing || i < step ? 'bg-primary' : 'bg-border-strong')} aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    onClick={() => canOpen && goTo(i)}
                    disabled={!canOpen}
                    title={editing && i === 0 ? 'The training type can’t be changed' : undefined}
                    aria-current={state === 'current' ? 'step' : undefined}
                    className={cn(
                      // items-start: circles stay at a fixed spot (the connector lines are positioned from it) even when a description wraps.
                      // relative z-10: the highlighted (current) row sits above the connector lines, hiding their ends
                      'relative z-10 flex w-full items-start gap-3 rounded-xl p-1.5 pr-3 text-left transition-colors disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      state === 'current' && 'bg-surface shadow-xs ring-1 ring-border-strong dark:bg-surface-sunken',
                      state === 'done' && 'hover:bg-surface/70',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-[3px] inline-flex size-8 shrink-0 items-center justify-center rounded-full', // 3px down: centred on the two text lines
                        state === 'done' && 'bg-primary text-primary-fg',
                        state === 'current' && 'bg-primary-soft text-primary-text ring-2 ring-primary',
                        state === 'upcoming' && 'bg-surface text-text-secondary ring-1 ring-border-strong dark:bg-surface-sunken',
                      )}
                    >
                      {state === 'done' ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : <Icon className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm font-semibold', state === 'upcoming' ? 'text-text-secondary' : 'text-text')}>{s.label}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-text-muted" title={s.description}>{s.description}</span>
                    </span>
                    {/* Pre-filled from the CRM portal — a small icon marker at the end of the row (keeps room for the text) */}
                    {crmFilled && s.key !== 'type' && (
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-chart-1/10 text-chart-1" title="Pre-filled from CRM portal">
                        <DatabaseZap className="size-3" aria-hidden="true" />
                        <span className="sr-only">Pre-filled from CRM portal</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-auto flex items-start gap-2 rounded-xl bg-surface/60 px-3 py-2.5 text-xs text-text-secondary dark:bg-surface-sunken/60">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary-text" aria-hidden="true" />
            <span>
              Fields marked <span className="font-semibold text-danger">*</span> are required. {editing ? 'Save changes checks every step.' : 'You can go back to any finished step.'}
            </span>
          </p>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          {/* Below xl: compact progress card instead of the side panel */}
          <Card padding="sm" tint="primary" subtleTint className="xl:hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text">{steps[step].label}</span>
              <span className="tabular-nums text-text-secondary">
                Step {step + 1} of {steps.length}
              </span>
            </div>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s.key} className={i <= step ? 'h-1.5 flex-1 rounded-full bg-primary' : 'h-1.5 flex-1 rounded-full bg-text-muted/20'} />
              ))}
            </div>
          </Card>

        <form
          id="add-client"
          noValidate
          className="flex flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (step > 0 && key !== 'billing') advance();
          }}
        >
          <div
            key={`${key}-${values.trainingFor}`}
            className={cn(
              // The last card stretches to the page height and joins the action bar below: square bottom corners, no bottom
              // border, and a shadow that only spreads up/sideways (a normal one would show through the glass bar as a seam)
              'flex flex-1 animate-fade-in flex-col gap-5 [&>*:last-child]:flex-1 [&>*:last-child]:rounded-b-none [&>*:last-child]:border-b-0 [&>*:last-child]:shadow-[0_-4px_16px_-8px_rgb(var(--ln-shadow-color)/0.2)]',
              // While the CRM fetch runs, the form below the fetch card is dimmed and locked
              fetching && key === 'details' && '[&>*:not(:first-child)]:pointer-events-none [&>*:not(:first-child)]:opacity-45 [&>*:not(:first-child)]:transition-opacity',
            )}
          >
            {fetching && key === 'details' && <CrmFetchCard key={crm.name} name={crm.name} />}
            {crmFilled && key !== 'type' && <CrmBanner name={crm.name} step={steps[step].label} />}
            {key === 'type' && (
              <TrainingTypeStep
                value={values.trainingFor}
                error={attempted.has('type') ? errors.trainingFor : undefined}
                onChange={(trainingFor) => {
                  set('trainingFor', trainingFor);
                  goTo(1);
                }}
              />
            )}
            {key === 'details' && (
              <DetailsStep
                v={v}
                set={set}
                err={err}
                blur={blur}
                lookups={lookups}
                onLogoError={(m) => toast.error(m)}
                // New clients: picking a CRM company fills the form. Editing: no auto-fill, but status can be changed.
                onCrmPick={editing ? undefined : fetchFromCrm}
                status={editing ? status : undefined}
                onStatusChange={setStatus}
              />
            )}
            {key === 'address' && <AddressStep v={v} setValues={setValues} errors={visible} blur={blur} geo={lookups.geo} />}
            {key === 'billing' && <BillingStep v={v} set={set} setValues={setValues} err={err} blur={blur} geo={lookups.geo} onFileError={(m) => toast.error(m)} />}
          </div>
        </form>

        {/* Action bar — the footer of the form card above it (joined: no gap, square top corners, a dashed divider), so the
            step and its buttons read as one card rather than a stack of boxes */}
        <Card padding="none" className="-mt-5 flex items-center justify-between gap-3 rounded-t-none border-t border-dashed border-t-border-strong px-5 py-3.5 sm:px-6">
          {/* Back (after the first step) + Cancel on every step — Cancel asks first if anything changed */}
          <div className="flex items-center gap-1">
            {step > (editing ? 1 : 0) && (
              <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => goTo(step - 1)} disabled={saving}>
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={() => leave()} disabled={saving}>
              Cancel
            </Button>
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              {!last && (
                <Button variant="secondary" rightIcon={ArrowRight} onClick={advance} disabled={saving}>
                  Next
                </Button>
              )}
              <Button leftIcon={Check} onClick={saveChanges} loading={saving}>
                Save changes
              </Button>
            </div>
          ) : step > 0 &&
            (last ? (
              <Button leftIcon={Check} onClick={advance} loading={saving}>
                Save client
              </Button>
            ) : (
              <Button rightIcon={ArrowRight} onClick={advance} disabled={fetching}>
                Continue
              </Button>
            ))}
        </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onConfirm={() => navigate(leaveTo)}
        title={editing ? 'Discard your changes?' : 'Discard this client?'}
        description={editing ? 'Your edits to this client won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </div>
  );
}

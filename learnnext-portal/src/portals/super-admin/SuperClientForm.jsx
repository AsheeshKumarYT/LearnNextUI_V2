import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, Check, CircleCheck, IdCard, ImagePlus, Info, ListChecks, MapPinned, ReceiptText, SearchX, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { setLeaveGuard } from '@/utils/leaveGuard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { clientsApi } from '@/services/api';
import { Button, Card, ConfirmDialog, FormField, Input, SearchableSelect, Select, Switch } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { INITIAL_CLIENT, addressStepErrors, billingStepErrors } from '@/shared/clients/components/clientForm';
import { FormCard, LogoPicker, PrefixInput } from '@/shared/clients/components/clientFormFields';
import { AddressStep } from '@/shared/clients/components/AddressStep';
import { BillingStep } from '@/shared/clients/components/BillingStep';
import { partnersApi } from '@/services/api';

const STEPS = [
  { key: 'details', label: 'Details', description: 'Company & contact person', icon: IdCard },
  { key: 'address', label: 'Addresses', description: 'Communication & office', icon: MapPinned },
  { key: 'billing', label: 'Billing', description: 'Addresses, GST & TDS', icon: ReceiptText },
];
const INITIAL = { ...INITIAL_CLIENT, trainingFor: 'company', industry: 'Education & Training', contactName: '', contactEmail: '' };
const GRID = 'grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2';
const blank = (v) => !v || !String(v).trim();
const digits = (v = '') => String(v).replace(/\D/g, '');

/** Step "details" for a Super Admin client (a training partner): company + its contact person — all typed by hand */
function detailsErrors(v, exceptId) {
  const e = {};
  if (blank(v.companyName)) e.companyName = 'Enter the company name';
  else if (v.companyName.trim().length < 2) e.companyName = 'Name looks too short';
  else if (partnersApi.nameTaken(v.companyName, exceptId)) e.companyName = 'This company is already a client';
  if (blank(v.companyType)) e.companyType = 'Choose a company type';
  if (blank(v.industry)) e.industry = 'Choose an industry';
  if (v.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.website.trim())) e.website = 'Enter a valid website, e.g. brightpath.in';
  if (blank(v.contactName)) e.contactName = 'Enter the contact person’s name';
  if (blank(v.contactEmail)) e.contactEmail = 'Enter an email address';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.contactEmail.trim())) e.contactEmail = 'Enter a valid email address';
  if (!/^[6-9]\d{9}$/.test(digits(v.mobile))) e.mobile = blank(v.mobile) ? 'Enter a mobile number' : 'Enter a valid 10-digit mobile number';
  if (v.phone || v.stdCode) {
    if (!/^0?\d{2,4}$/.test(digits(v.stdCode))) e.stdCode = 'STD code';
    if (!/^\d{6,8}$/.test(digits(v.phone))) e.phone = 'Enter a 6–8 digit number';
  }
  return e;
}
const errorsFor = (key, v, exceptId) => (key === 'details' ? detailsErrors(v, exceptId) : key === 'address' ? addressStepErrors(v) : billingStepErrors(v));

/**
 * Super Admin → Add client / Edit client (/clients/new, /clients/:id/edit). The same page wizard as the Training
 * Partner portal's Add client — steps card on the left, the step's cards on the right, action bar joined below — but
 * filled in by hand (no CRM): Details → Addresses → Billing. Addresses and Billing reuse the Training Partner steps.
 */
export default function SuperClientForm() {
  const { id } = useParams();
  const existing = useMemo(() => (id ? partnersApi.get(id) : null), [id]);
  const navigate = useNavigate();
  if (id && !existing) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Client not found"
          description="It may have been removed, or the link is out of date."
          action={
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate('/clients')}>
              Manage clients
            </Button>
          }
        />
      </Card>
    );
  }
  return <PartnerForm key={id ?? 'new'} existing={existing} />;
}

function PartnerForm({ existing }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const editing = !!existing;
  const lookups = useMemo(() => clientsApi.lookups(), []);
  const initial = useMemo(() => (editing ? { ...INITIAL, ...existing.form } : { ...INITIAL, code: partnersApi.nextCode() }), [editing, existing]);

  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState(existing?.status ?? 'active');
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState(() => new Set());
  const [touched, setTouched] = useState(() => new Set());
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaveTo, setLeaveTo] = useState('/clients');

  const v = values;
  const key = STEPS[step].key;
  const last = step === STEPS.length - 1;
  const errors = errorsFor(key, v, existing?.id);
  // As on the Training Partner form: a step's errors show after Continue / Save, or once a field has been left
  const visible = Object.fromEntries(Object.entries(errors).filter(([k]) => attempted.has(key) || touched.has(k)));
  const err = (k) => visible[k];
  const set = (k, x) => setValues((s) => ({ ...s, [k]: x }));
  const blur = (k) => setTouched((t) => (t.has(k) ? t : new Set(t).add(k)));
  const text = (k) => ({ value: v[k], onChange: (e) => set(k, e.target.value), onBlur: () => blur(k) });

  const goTo = (i) => {
    setStep(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persist = async () => {
    if (v.billing.length === 0) {
      goTo(STEPS.findIndex((s) => s.key === 'billing'));
      toast.error('Add a billing address', { description: 'Save at least one billing address with its GST No.' });
      return;
    }
    setSaving(true);
    try {
      const p = editing ? await partnersApi.update(existing.id, v, status, user?.name ?? 'You') : await partnersApi.create(v, user?.name ?? 'You');
      toast.success(editing ? 'Changes saved' : 'Client added', { description: `${p.name} (${p.code})`, afterLoad: true });
      navigate(editing ? `/clients/${p.id}` : '/clients');
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the changes' : 'Couldn’t add the client', { description: e.message });
      setSaving(false);
    }
  };

  // New: check this step, then move on (or save on the last one)
  const advance = () => {
    if (Object.keys(errors).length) {
      setAttempted((a) => new Set(a).add(key));
      requestAnimationFrame(() => document.querySelector('#super-client [aria-invalid="true"]')?.focus());
      return;
    }
    if (last) persist();
    else goTo(step + 1);
  };

  // Edit: check every step, open the first one with problems, otherwise save
  const saveChanges = () => {
    const bad = STEPS.findIndex((s) => Object.keys(errorsFor(s.key, v, existing.id)).length);
    if (bad >= 0) {
      setAttempted((a) => new Set(a).add(STEPS[bad].key));
      goTo(bad);
      toast.error('Check the highlighted fields', { description: `${STEPS[bad].label} needs a few fixes before saving.` });
      return;
    }
    persist();
  };

  const changed = editing ? status !== existing.status || JSON.stringify(values) !== JSON.stringify(initial) : JSON.stringify(values) !== JSON.stringify(initial);
  const leave = (to = '/clients') => {
    if (!changed) return navigate(to);
    setLeaveTo(to);
    setConfirmLeave(true);
  };
  useEffect(() => setLeaveGuard((to) => (changed ? (leave(to), true) : false)));

  return (
    <div className="flex flex-col gap-6 lg:flex-1">
      <div className="grid grid-cols-1 gap-6 lg:flex-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Steps card — as on the Training Partner portal's Add client */}
        <Card tint="primary" subtleTint padding="none" className="hidden flex-col px-5 py-6 xl:sticky xl:top-[calc(var(--app-header-h)+2rem)] xl:flex xl:min-h-[calc(100dvh-6.75rem)] xl:self-start xl:transition-[top] xl:duration-300 xl:ease-out">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-inset ring-chart-1/15">
            <ListChecks className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[15px] font-semibold text-text">{editing ? 'Edit client' : 'New client'}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{editing ? 'Open any step to make changes.' : '3 steps — fill in each by hand.'}</p>

          <ol className="mt-7 flex flex-col">
            {STEPS.map((s, i) => {
              const state = i === step ? 'current' : editing || i < step ? 'done' : 'upcoming';
              const canOpen = editing || i <= step;
              return (
                <li key={s.key} className="relative pb-3.5 last:pb-0">
                  {i < STEPS.length - 1 && <span className={cn('absolute -bottom-[5px] left-[21px] top-[45px] w-0.5 rounded-full', editing || i < step ? 'bg-primary' : 'bg-border-strong')} aria-hidden="true" />}
                  <button
                    type="button"
                    onClick={() => canOpen && goTo(i)}
                    disabled={!canOpen}
                    aria-current={state === 'current' ? 'step' : undefined}
                    className={cn(
                      'relative z-10 flex w-full items-start gap-3 rounded-xl p-1.5 pr-3 text-left transition-colors disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      state === 'current' && 'bg-surface shadow-xs ring-1 ring-border-strong dark:bg-surface-sunken',
                      state === 'done' && 'hover:bg-surface/70',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-[3px] inline-flex size-8 shrink-0 items-center justify-center rounded-full',
                        state === 'done' && 'bg-primary text-primary-fg',
                        state === 'current' && 'bg-primary-soft text-primary-text ring-2 ring-primary',
                        state === 'upcoming' && 'bg-surface text-text-secondary ring-1 ring-border-strong dark:bg-surface-sunken',
                      )}
                    >
                      {state === 'done' ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : <s.icon className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm font-semibold', state === 'upcoming' ? 'text-text-secondary' : 'text-text')}>{s.label}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-text-muted">{s.description}</span>
                    </span>
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
          {/* Below xl: a compact progress card instead of the steps card */}
          <Card padding="sm" tint="primary" subtleTint className="xl:hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text">{STEPS[step].label}</span>
              <span className="tabular-nums text-text-secondary">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span key={s.key} className={i <= step ? 'h-1.5 flex-1 rounded-full bg-primary' : 'h-1.5 flex-1 rounded-full bg-text-muted/20'} />
              ))}
            </div>
          </Card>

          <form
            id="super-client"
            noValidate
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (key !== 'billing') advance();
            }}
          >
            <div
              key={key}
              className="flex flex-1 animate-fade-in flex-col gap-5 [&>*:last-child]:flex-1 [&>*:last-child]:rounded-b-none [&>*:last-child]:border-b-0 [&>*:last-child]:shadow-[0_-4px_16px_-8px_rgb(var(--ln-shadow-color)/0.2)]"
            >
              {key === 'details' && (
                <>
                  <FormCard icon={Building2} tone="primary" title="Company details" description="The training partner, as it appears across LearnNext.">
                    <div className={GRID}>
                      <FormField label="Company name" required error={err('companyName')}>
                        <Input placeholder="e.g. BrightPath Training Academy LLP" autoComplete="organization" {...text('companyName')} />
                      </FormField>
                      <FormField label="Client code" helper="Generated automatically">
                        <Input value={v.code} readOnly inputClassName="cursor-default bg-surface-sunken font-mono font-semibold tracking-wide text-text-secondary" />
                      </FormField>
                      <FormField label="Company type" required error={err('companyType')}>
                        <Select options={lookups.companyTypes} placeholder="Select" {...text('companyType')} />
                      </FormField>
                      <FormField label="Industry" required error={err('industry')}>
                        <SearchableSelect options={lookups.industries.map((x) => ({ value: x, label: x }))} value={v.industry} onChange={(x) => set('industry', x)} placeholder="Select" searchPlaceholder="Search…" />
                      </FormField>
                      <FormField label="Website" optional error={err('website')}>
                        <Input placeholder="company.com" inputMode="url" {...text('website')} />
                      </FormField>
                    </div>
                  </FormCard>

                  <FormCard icon={UserRound} tone="success" title="Contact person" description="Who we talk to at this training partner.">
                    <div className={GRID}>
                      <FormField label="Name" required error={err('contactName')}>
                        <Input placeholder="Full name" autoComplete="name" {...text('contactName')} />
                      </FormField>
                      <FormField label="Email" required error={err('contactEmail')}>
                        <Input type="email" placeholder="name@company.com" autoComplete="email" {...text('contactEmail')} />
                      </FormField>
                      <FormField label="Mobile number" required error={err('mobile')}>
                        <PrefixInput prefix="+91" type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210" value={v.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('mobile')} />
                      </FormField>
                      <FormField label="Phone number" optional error={err('stdCode') ? 'Enter the STD code too' : err('phone')}>
                        <div className="flex gap-2">
                          <Input inputMode="numeric" maxLength={5} placeholder="STD" aria-label="STD code" className="w-20 shrink-0" invalid={!!err('stdCode')} value={v.stdCode} onChange={(e) => set('stdCode', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('stdCode')} />
                          <Input inputMode="numeric" maxLength={8} placeholder="Number" aria-label="Phone number" value={v.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} onBlur={() => blur('phone')} />
                        </div>
                      </FormField>
                    </div>
                  </FormCard>

                  {editing && (
                    <FormCard icon={CircleCheck} tone="success" title="Status" description="Inactive clients stay on file but can’t sign in.">
                      <div className="rounded-xl border border-border-strong bg-surface/60 px-4 py-3.5 dark:bg-surface-sunken/50">
                        <Switch
                          checked={status === 'active'}
                          onChange={(on) => setStatus(on ? 'active' : 'inactive')}
                          label={status === 'active' ? 'Active client' : 'Inactive client'}
                          description={status === 'active' ? 'Turn off to mark this client inactive.' : 'Turn on to make this client active again.'}
                        />
                      </div>
                    </FormCard>
                  )}

                  <FormCard icon={ImagePlus} tone="violet" title="Company logo" description="Shown next to the client across LearnNext.">
                    <LogoPicker value={v.logo} onChange={(x) => set('logo', x)} onError={(m) => toast.error(m)} />
                  </FormCard>
                </>
              )}
              {key === 'address' && <AddressStep v={v} setValues={setValues} errors={visible} blur={blur} geo={lookups.geo} />}
              {key === 'billing' && <BillingStep v={v} set={set} setValues={setValues} err={err} blur={blur} geo={lookups.geo} onFileError={(m) => toast.error(m)} />}
            </div>
          </form>

          {/* Action bar — joined to the step's last card */}
          <Card padding="none" className="-mt-5 flex items-center justify-between gap-3 rounded-t-none border-t border-dashed border-t-border-strong px-5 py-3.5 sm:px-6">
            <div className="flex items-center gap-1">
              {step > 0 && (
                <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => goTo(step - 1)} disabled={saving}>
                  Back
                </Button>
              )}
              <Button variant="ghost" onClick={() => leave(editing ? `/clients/${existing.id}` : '/clients')} disabled={saving}>
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
            ) : last ? (
              <Button leftIcon={Check} onClick={advance} loading={saving}>
                Save client
              </Button>
            ) : (
              <Button rightIcon={ArrowRight} onClick={advance}>
                Continue
              </Button>
            )}
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

import { useEffect, useId, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Building2, CircleCheck, Lock, UploadCloud, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { entitiesApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, SearchableSelect, SegmentedControl, Stepper, Switch, Textarea } from '@/components/ui';
import { DocUpload, LogoPicker, PrefixInput } from '@/shared/clients/components/clientFormFields';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { EMPTY_ENTITY, ENTITY_STEPS, REG_LABEL, validateEntity } from './entityRules';

const upper = (v) => v.toUpperCase().replace(/\s/g, '');

/**
 * Add / edit an entity in a modal, one part at a time: Details → Registration → Tax & billing (a Stepper under the
 * title, Back / Next in the footer, two columns per step). Each registration number has its document right under it
 * (the same DocUpload as the client form). Next checks the step before moving on. When editing, every step is open from
 * the start (the step bar works as tabs) and "Save changes" joins the footer once something has changed. Closing with unsaved changes asks first.
 * `entity` = the one being edited (null = new); `entities` = all, for the parent list. `onSaved(entity)` after a save.
 */
export function EntityModal({ open, entity, entities, onClose, onSaved }) {
  const editing = Boolean(entity);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(() => (entity ? { ...EMPTY_ENTITY, ...structuredClone(entity), parent: entity.parent ?? '' } : EMPTY_ENTITY), [entity]);
  const last = ENTITY_STEPS.length - 1;

  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState({}); // steps where Next / Save was pressed — all their errors show
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setStep(0);
      setReached(editing ? last : 0);
      setTouched({});
      setTried({});
      setSaving(false);
    }
  }, [open, initial, editing, last]);

  const geo = useMemo(() => entitiesApi.geo(), []);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setAddress = (patch) => setForm((f) => ({ ...f, address: { ...f.address, ...patch } }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => validateEntity(form, { isEdit: editing, prefixTaken: (p) => entitiesApi.prefixTaken(p, entity?.id) }), [form, editing, entity]);
  const stepOf = (k) => ENTITY_STEPS.findIndex((s) => s.fields.includes(k));
  const err = (k) => (tried[stepOf(k)] || touched[k] ? errors[k] : undefined);
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const stepErrors = (i) => ENTITY_STEPS[i].fields.filter((k) => errors[k]);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const go = (i) => {
    setStep(i);
    setReached((r) => Math.max(r, i));
    requestAnimationFrame(() => document.querySelector('[role=dialog] .overflow-y-auto')?.scrollTo({ top: 0 }));
  };

  const next = () => {
    setTried((t) => ({ ...t, [step]: true }));
    if (!stepErrors(step).length) go(step + 1);
  };

  const save = async () => {
    // Every step is checked; the first one with something to fix is shown
    const bad = ENTITY_STEPS.findIndex((_, i) => stepErrors(i).length);
    if (bad >= 0) {
      setTried(Object.fromEntries(ENTITY_STEPS.map((_, i) => [i, true])));
      if (bad !== step) go(bad);
      const n = stepErrors(bad).length;
      toast.error('Check the highlighted fields', { description: `${n} ${n === 1 ? 'field needs' : 'fields need'} a fix in ${ENTITY_STEPS[bad].label}.` });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, parent: form.parent || null };
      const saved = editing ? await entitiesApi.update(entity.id, payload) : await entitiesApi.create(payload, user?.name ?? 'You');
      toast.success(editing ? 'Entity updated' : 'Entity added', { description: `${saved.name} (${saved.invoicePrefix})` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the entity' : 'Couldn’t add the entity', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const parentOptions = entities.filter((e) => e.id !== entity?.id).map((e) => ({ value: e.id, label: e.name, description: e.invoicePrefix }));
  const a = form.address;
  const countries = useMemo(() => Object.keys(geo).map((c) => ({ value: c, label: c })), [geo]);
  const states = useMemo(
    () =>
      Object.keys(geo[a.country] ?? {})
        .sort()
        .map((s) => ({ value: s, label: s })),
    [geo, a.country],
  );
  const cities = useMemo(() => (geo[a.country]?.[a.state] ?? []).map((c) => ({ value: c, label: c })), [geo, a.country, a.state]);
  const reg = REG_LABEL[form.cinType];
  const fileError = (m) => toast.error(m);

  const footer = (
    // A fragment: the modal footer lays its children out (full-width buttons on phones); the step count sits on the left
    <>
      <span className="hidden text-xs text-text-muted sm:mr-auto sm:block">
        Step {step + 1} of {ENTITY_STEPS.length}
      </span>
      {/* Cancel / Back, Next, then Save — while editing, Save changes appears only once something has changed */}
      {step === 0 ? (
        <Button variant="ghost" onClick={close} disabled={saving}>
          Cancel
        </Button>
      ) : (
        <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => go(step - 1)} disabled={saving}>
          Back
        </Button>
      )}
      {step < last && (
        <Button variant={editing ? 'secondary' : 'primary'} rightIcon={ArrowRight} onClick={next} disabled={saving}>
          Next
        </Button>
      )}
      {(editing ? changed : step === last) && (
        <Button onClick={save} loading={saving}>
          {editing ? 'Save changes' : 'Save entity'}
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
        icon={Building2}
        title={editing ? 'Edit entity' : 'Add entity'}
        description={editing ? entity.name : 'A legal entity that raises invoices.'}
        footer={footer}
        // One soft wash over the whole panel (header, steps, fields) like the client form's cards, so the white fields stand out
        panelClassName="sm:max-w-3xl [background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
      >
        <Stepper steps={ENTITY_STEPS} current={step} reachable={reached} onStepClick={go} orientation="horizontal" className="mb-5 border-b border-border pb-5 [&_li]:min-w-0 [&_p]:truncate" />

        <div key={step} className="grid animate-fade-in grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          {step === 0 && (
            <>
              <FormField label="Entity name" required error={err('name')} className="sm:col-span-2">
                <Input placeholder="Registered legal name" value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={blur('name')} />
              </FormField>
              <FormField label="Parent entity" optional>
                <SearchableSelect options={parentOptions} value={form.parent} onChange={(parent) => set({ parent })} placeholder="Select parent" searchPlaceholder="Search entities…" clearable />
              </FormField>
              <FormField label="Invoice initial" required error={err('invoicePrefix')}>
                {editing ? (
                  <div
                    className="flex h-10 items-center gap-2 rounded-xl border border-border-strong bg-surface-sunken/60 px-3 sm:h-9 dark:bg-surface-sunken/40"
                    title="Can’t be changed — issued invoices carry it"
                  >
                    <Lock className="size-3.5 text-text-muted" aria-hidden="true" />
                    <span className="text-sm font-semibold tracking-wide text-text">{form.invoicePrefix}</span>
                  </div>
                ) : (
                  <Input
                    placeholder="e.g. BYLD"
                    maxLength={6}
                    className="uppercase"
                    value={form.invoicePrefix}
                    onChange={(e) => set({ invoicePrefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                    onBlur={blur('invoicePrefix')}
                  />
                )}
              </FormField>
              <FormField label="Logo" required>
                <LogoPicker value={form.logo} onChange={(logo) => set({ logo })} onError={fileError} hint={err('logo') ?? 'PNG, JPG or SVG · up to 2 MB'} invalid={Boolean(err('logo'))} />
              </FormField>
              {editing && (
                <FormField label="Status">
                  <div className="flex h-10 items-center sm:h-9">
                    <Switch checked={form.status === 'active'} onChange={(on) => set({ status: on ? 'active' : 'inactive' })} label={form.status === 'active' ? 'Active' : 'Inactive'} />
                  </div>
                </FormField>
              )}
            </>
          )}

          {step === 1 && (
            <>
              {/* A checklist: one row per registration — its name, the number, then its document */}
              <div className="divide-y divide-border sm:col-span-2 [&>*:first-child]:pt-0">
                <RegRow
                  label="PAN"
                  hint="Permanent account no."
                  error={err('pan') ?? err('panDoc')}
                  input={
                    <Input
                      aria-label="PAN No."
                      invalid={Boolean(err('pan'))}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={form.pan}
                      onChange={(e) => set({ pan: upper(e.target.value) })}
                      onBlur={blur('pan')}
                    />
                  }
                  doc={<DocButton value={form.panDoc} onChange={(panDoc) => set({ panDoc })} name="PAN card" invalid={Boolean(err('panDoc'))} onError={fileError} />}
                />
                <RegRow
                  label={reg}
                  hint={
                    // CIN for a company, LLPIN for an LLP — the same segmented toggle used across the app
                    <SegmentedControl
                      size="sm"
                      ariaLabel="Registration type"
                      className="mt-1.5"
                      value={form.cinType}
                      onChange={(cinType) => set({ cinType, cin: '' })}
                      tabs={[
                        { value: 'CIN', label: 'Company' },
                        { value: 'LLPIN', label: 'LLP' },
                      ]}
                    />
                  }
                  error={err('cin') ?? err('cinDoc')}
                  input={
                    <Input
                      aria-label={`${reg} No.`}
                      invalid={Boolean(err('cin'))}
                      placeholder={form.cinType === 'LLPIN' ? 'AAB-1234' : 'U80301DL2009PTC193221'}
                      maxLength={form.cinType === 'LLPIN' ? 8 : 21}
                      value={form.cin}
                      onChange={(e) => set({ cin: upper(e.target.value) })}
                      onBlur={blur('cin')}
                    />
                  }
                  doc={<DocButton value={form.cinDoc} onChange={(cinDoc) => set({ cinDoc })} name={`${reg} certificate`} invalid={Boolean(err('cinDoc'))} onError={fileError} />}
                />
                <RegRow
                  label="LUT"
                  hint="Letter of undertaking"
                  error={err('lut') ?? err('lutDoc')}
                  input={
                    <Input
                      aria-label="LUT No."
                      invalid={Boolean(err('lut'))}
                      placeholder="e.g. AD070325012345K"
                      value={form.lut}
                      onChange={(e) => set({ lut: upper(e.target.value) })}
                      onBlur={blur('lut')}
                    />
                  }
                  doc={<DocButton value={form.lutDoc} onChange={(lutDoc) => set({ lutDoc })} name="LUT" invalid={Boolean(err('lutDoc'))} onError={fileError} />}
                />
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 border-t border-border pt-6 sm:col-span-2 sm:grid-cols-2">
                <FormField label="Authorised signature" required>
                  <LogoPicker
                    value={form.signature}
                    onChange={(signature) => set({ signature })}
                    onError={fileError}
                    label="Upload signature"
                    hint={err('signature') ?? 'PNG or JPG · up to 2 MB'}
                    invalid={Boolean(err('signature'))}
                  />
                </FormField>
                <FormField label="LUT declaration" required error={err('lutDeclaration')}>
                  <Textarea
                    rows={3}
                    placeholder="We declare that the supply of services is made under LUT without payment of IGST…"
                    value={form.lutDeclaration}
                    onChange={(e) => set({ lutDeclaration: e.target.value })}
                    onBlur={blur('lutDeclaration')}
                  />
                </FormField>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <FormField label="Address line 1" required error={err('address.line1')}>
                <Input placeholder="Building, street" value={a.line1} onChange={(e) => setAddress({ line1: e.target.value })} onBlur={blur('address.line1')} />
              </FormField>
              <FormField label="Address line 2" required error={err('address.line2')}>
                <Input placeholder="Area, landmark" value={a.line2} onChange={(e) => setAddress({ line2: e.target.value })} onBlur={blur('address.line2')} />
              </FormField>
              <FormField label="Country" required error={err('address.country')}>
                <SearchableSelect
                  options={countries}
                  value={a.country}
                  onChange={(country) => setAddress({ country, state: '', city: '' })}
                  placeholder="Select country"
                  searchPlaceholder="Search countries…"
                />
              </FormField>
              <FormField label="State" required error={err('address.state')}>
                <SearchableSelect
                  options={states}
                  value={a.state}
                  onChange={(state) => setAddress({ state, city: '' })}
                  placeholder="Select state"
                  searchPlaceholder="Search states…"
                  disabled={!a.country}
                />
              </FormField>
              <FormField label="City" required error={err('address.city')}>
                <SearchableSelect
                  options={cities}
                  value={a.city}
                  onChange={(city) => setAddress({ city })}
                  placeholder={a.state ? 'Select city' : 'Pick a state first'}
                  searchPlaceholder="Search cities…"
                  disabled={!a.state}
                />
              </FormField>
              <FormField label="Pin code" required error={err('address.pin')}>
                <Input
                  inputMode="numeric"
                  maxLength={a.country === 'India' ? 6 : 10}
                  placeholder="400001"
                  value={a.pin}
                  onChange={(e) => setAddress({ pin: a.country === 'India' ? e.target.value.replace(/\D/g, '') : e.target.value })}
                  onBlur={blur('address.pin')}
                />
              </FormField>
              <FormField label="Phone" required error={err('phone')}>
                <PrefixInput
                  prefix="+91"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '') })}
                  onBlur={blur('phone')}
                />
              </FormField>
              <div>
                <FormField label="GSTIN No." required error={err('gstin')}>
                  <Input placeholder="07AABCB1234K1Z9" maxLength={15} value={form.gstin} onChange={(e) => set({ gstin: upper(e.target.value) })} onBlur={blur('gstin')} />
                </FormField>
                <DocUpload value={form.gstDoc} onChange={(gstDoc) => set({ gstDoc })} label="GST certificate" required error={err('gstDoc')} onError={fileError} />
              </div>
            </>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this entity?'}
        description={editing ? 'Your edits to this entity won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/**
 * One line of the registration checklist: the document's name (with a small hint or control under it), its number,
 * then its file — stacked on phones. One message under the row: the number's problem first, else the file's.
 */
function RegRow({ label, hint, input, doc, error }) {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 items-center gap-x-5 gap-y-2 sm:grid-cols-[10rem_minmax(0,1fr)_15rem]">
        <div>
          <p className="text-[13px] font-semibold text-text">
            {label}
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          </p>
          {typeof hint === 'string' ? <p className="mt-0.5 text-xs text-text-muted">{hint}</p> : hint}
        </div>
        {input}
        {doc}
      </div>
      {error && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-danger sm:ml-[11.25rem]" role="alert">
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A row's document: a small dashed "Upload …" button that becomes a soft green file pill once attached — click the
 * name to view it, × to remove. PDF / JPG / PNG up to 5 MB.
 */
function DocButton({ value, onChange, name, invalid, onError }) {
  const id = useId();
  const [preview, setPreview] = useState(false);
  const take = (f) => {
    if (!f) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)) return onError('Use a PDF, JPG or PNG file.');
    if (f.size > 5 * 1024 * 1024) return onError('File must be under 5 MB.');
    onChange({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) });
    return undefined;
  };

  if (value) {
    return (
      <div className="flex h-10 min-w-0 items-center gap-2.5 rounded-control border border-success/30 bg-success-soft/40 pl-1.5 pr-1 sm:h-9">
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
          <CircleCheck className="size-4" aria-hidden="true" />
        </span>
        <button
          type="button"
          onClick={() => setPreview(true)}
          title={`View ${value.name}`}
          className="min-w-0 flex-1 truncate rounded-sm text-left text-[13px] font-medium text-text hover:text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {value.name}
        </button>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={`Remove ${value.name}`}
          title="Remove"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
        <FilePreviewModal file={preview ? value : null} onClose={() => setPreview(false)} />
      </div>
    );
  }
  return (
    // A solid, left-aligned control (not a faint dashed box): icon tile + what to upload; accepted files in the tooltip
    <label
      htmlFor={id}
      title="PDF, JPG or PNG · max 5 MB"
      className={cn(
        'group flex h-10 min-w-0 cursor-pointer items-center gap-2.5 rounded-control border bg-surface pl-1.5 pr-3 shadow-xs transition-colors focus-within:ring-2 focus-within:ring-focus sm:h-9 dark:bg-surface-secondary',
        invalid ? 'border-danger/60' : 'border-border-strong hover:border-primary/60 hover:bg-primary-soft/30',
      )}
    >
      <span className={cn('inline-flex size-7 shrink-0 items-center justify-center rounded-lg', invalid ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-text')}>
        <UploadCloud className="size-4" aria-hidden="true" />
      </span>
      <span className={cn('min-w-0 flex-1 truncate text-[13px] font-medium', invalid ? 'text-danger' : 'text-text group-hover:text-primary-text')}>Upload {name}</span>
      <input
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}

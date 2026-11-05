import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Library } from 'lucide-react';
import { formatCurrency } from '@/utils/formatNumber';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { programsApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, SearchableSelect, Stepper } from '@/components/ui';
import { DocUpload, LogoPicker, PrefixInput } from '@/shared/clients/components/clientFormFields';
import { EMPTY_PROGRAM, PROGRAM_STEPS, validateProgram } from './programRules';

/**
 * Add / edit a program in a modal, in two steps (as the Entity modal): Program (name, category, logo) → Mapping & fees
 * (entity, sub-entity, fee per person, executive overview). Every field is required. Next checks the step; when
 * editing, both steps are open from the start and "Save changes" shows once something changed. Closing with unsaved
 * changes asks first. `program` = the one being edited (null = new). `onSaved(program)` after a save.
 */
export function ProgramModal({ open, program, onClose, onSaved }) {
  const editing = Boolean(program);
  const toast = useToast();
  const { user } = useAuth();
  const initial = useMemo(
    () =>
      program
        ? { name: program.name, category: program.category, logo: program.logo, entity: program.entity, sub: program.sub, fee: String(program.fee), overview: program.overview }
        : EMPTY_PROGRAM,
    [program],
  );
  const last = PROGRAM_STEPS.length - 1;

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lookups = useMemo(() => programsApi.lookups(), [open]);
  const categories = useMemo(() => lookups.categories.map((c) => ({ value: c, label: c })), [lookups]);
  const entities = useMemo(() => lookups.entities.map((e) => ({ value: e.id, label: e.name, description: e.prefix })), [lookups]);
  const subs = useMemo(() => lookups.subEntities.filter((s) => s.entity === form.entity).map((s) => ({ value: s.id, label: s.name })), [lookups, form.entity]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => validateProgram(form, { nameTaken: (n) => programsApi.nameTaken(n, program?.id) }), [form, program]);
  const stepOf = (k) => PROGRAM_STEPS.findIndex((s) => s.fields.includes(k));
  const err = (k) => (tried[stepOf(k)] || touched[k] ? errors[k] : undefined);
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const stepErrors = (i) => PROGRAM_STEPS[i].fields.filter((k) => errors[k]);
  const fileError = (m) => toast.error(m);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const go = (i) => {
    setStep(i);
    setReached((r) => Math.max(r, i));
  };
  const next = () => {
    setTried((t) => ({ ...t, [step]: true }));
    if (!stepErrors(step).length) go(step + 1);
  };

  const save = async () => {
    // Every step is checked; the first one with something to fix is shown
    const bad = PROGRAM_STEPS.findIndex((_, i) => stepErrors(i).length);
    if (bad >= 0) {
      setTried(Object.fromEntries(PROGRAM_STEPS.map((_, i) => [i, true])));
      if (bad !== step) go(bad);
      const n = stepErrors(bad).length;
      toast.error('Check the highlighted fields', { description: `${n} ${n === 1 ? 'field needs' : 'fields need'} a fix in ${PROGRAM_STEPS[bad].label}.` });
      return;
    }
    setSaving(true);
    try {
      const by = user?.name ?? 'You';
      const saved = editing ? await programsApi.update(program.id, form, by) : await programsApi.create(form, by);
      toast.success(editing ? 'Program updated' : 'Program added', { description: `${saved.name} · ${formatCurrency(saved.fee, 'INR')} per person` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the program' : 'Couldn’t add the program', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <>
      <span className="hidden text-xs text-text-muted sm:mr-auto sm:block">
        Step {step + 1} of {PROGRAM_STEPS.length}
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
      {step < last && (
        <Button variant={editing ? 'secondary' : 'primary'} rightIcon={ArrowRight} onClick={next} disabled={saving}>
          Next
        </Button>
      )}
      {(editing ? changed : step === last) && (
        <Button onClick={save} loading={saving}>
          {editing ? 'Save changes' : 'Add program'}
        </Button>
      )}
    </>
  );

  const fee = Number(form.fee);

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="lg"
        icon={Library}
        title={editing ? 'Edit program' : 'Add program'}
        description={editing ? program.name : 'A program you can add content to and sell per person.'}
        footer={footer}
        // The entity modal's soft wash over the whole panel, so the white fields stand out
        panelClassName="[background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
      >
        <Stepper
          steps={PROGRAM_STEPS}
          current={step}
          reachable={reached}
          onStepClick={(i) => (i <= step || editing || !stepErrors(step).length ? go(i) : next())}
          orientation="horizontal"
          className="mb-5 border-b border-border pb-5 [&_li]:min-w-0 [&_p]:truncate"
        />

        <div key={step} className="grid animate-fade-in grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          {step === 0 ? (
            <>
              <FormField label="Program name" required error={err('name')} className="sm:col-span-2">
                <Input placeholder="e.g. Situational Leadership® II" autoComplete="off" value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={blur('name')} />
              </FormField>
              <FormField label="Program category" required error={err('category')}>
                <SearchableSelect options={categories} value={form.category} onChange={(category) => set({ category })} placeholder="Select category" searchPlaceholder="Search categories…" />
              </FormField>
              <FormField label="Program logo" required>
                <LogoPicker value={form.logo} onChange={(logo) => set({ logo })} onError={fileError} hint={err('logo') ?? 'PNG, JPG or SVG · up to 2 MB'} invalid={Boolean(err('logo'))} />
              </FormField>
            </>
          ) : (
            <>
              {/* Entity names are long — full width so they show in full; sub-entity and fee share the next row */}
              <FormField label="Entity" required error={err('entity')} className="sm:col-span-2">
                <SearchableSelect options={entities} value={form.entity} onChange={(entity) => set({ entity, sub: '' })} placeholder="Select entity" searchPlaceholder="Search entities…" />
              </FormField>
              <FormField label="Sub-entity" required error={err('sub')}>
                <SearchableSelect
                  options={subs}
                  value={form.sub}
                  onChange={(sub) => set({ sub })}
                  placeholder={form.entity ? (subs.length ? 'Select sub-entity' : 'No sub-entities under it') : 'Pick an entity first'}
                  searchPlaceholder="Search sub-entities…"
                  disabled={!form.entity || !subs.length}
                />
              </FormField>
              <FormField label="Fees per person" required error={err('fee')} helper={!err('fee') && fee > 0 ? `${formatCurrency(fee, 'INR')} per participant, before tax` : undefined}>
                <PrefixInput
                  prefix="₹"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="18500"
                  value={form.fee}
                  onChange={(e) => set({ fee: e.target.value.replace(/\D/g, '') })}
                  onBlur={blur('fee')}
                />
              </FormField>
              <div className="sm:col-span-2">
                <p className="text-[13px] font-medium text-text">
                  Executive overview<span className="ml-0.5 text-danger" aria-hidden="true">*</span>
                </p>
                <DocUpload value={form.overview} onChange={(overview) => set({ overview })} label="executive overview" error={err('overview')} onError={fileError} />
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
        title={editing ? 'Discard your changes?' : 'Discard this program?'}
        description={editing ? 'Your edits to this program won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

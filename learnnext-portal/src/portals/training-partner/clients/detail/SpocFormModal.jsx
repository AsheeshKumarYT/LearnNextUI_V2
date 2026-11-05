import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, UserCog, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { email as isEmail, required, validate } from '@/utils/validation';
import { useToast } from '@/hooks/useToast';
import { clientsApi } from '@/services/api';
import { Button, Checkbox, ConfirmDialog, FormField, Input, Modal, SearchableSelect, StatusBadge, Stepper } from '@/components/ui';
import { PrefixInput } from '@/shared/clients/components/clientFormFields';

/** "+91 98765 43210" from 10 digits */
export const formatMobile = (m) => (m ? `+91 ${m.replace(/(\d{5})(\d{5})/, '$1 $2')}` : '');

const STEPS = [
  { label: 'Details', fields: ['name', 'email', 'mobile'] },
  { label: 'Project access', fields: [] },
];
const EMPTY_ADDRESS = { line1: '', line2: '', country: 'India', state: '', city: '' };
const EMPTY = { name: '', email: '', mobile: '', department: '', designation: '', address: EMPTY_ADDRESS, projects: [] };
/** An older SPOC may only have a city (`location`): find its state so the address shows it */
const addressOf = (spoc, geo) => {
  if (spoc.address) return { ...EMPTY_ADDRESS, ...spoc.address };
  if (!spoc.location) return EMPTY_ADDRESS;
  const state = Object.entries(geo.India ?? {}).find(([, cities]) => cities.includes(spoc.location))?.[0] ?? '';
  return { ...EMPTY_ADDRESS, state, city: state ? spoc.location : '' };
};
/** Names are letters only (plus spaces, dots, apostrophes and hyphens) — digits and other symbols are dropped as you type */
const lettersOnly = (v) => v.replace(/[^\p{L}\s.'-]/gu, '').replace(/\s{2,}/g, ' ');

/**
 * Add / edit a SPOC in a modal, in two steps (as the Entity modal): Details (name — letters only, email, mobile;
 * department, designation and an address — lines 1 / 2, country → state → city — optional) → Project access (tick the client's projects they can see, with Select all — a new SPOC starts
 * with all of them ticked). Next checks the step;
 * when editing, both steps are open from the start and "Save changes" shows once something changed. Closing with
 * unsaved changes asks first. `spoc` = the one being edited (null = new). `onSaved(spoc)` after a save.
 */
export function SpocFormModal({ open, clientId, spoc, projects, onClose, onSaved }) {
  const editing = Boolean(spoc);
  const toast = useToast();
  const lookups = useMemo(() => clientsApi.spocLookups(), []);
  // A new SPOC starts with access to every project (untick any they shouldn't see)
  const initial = useMemo(
    () =>
      spoc
        ? {
            ...EMPTY,
            name: spoc.name,
            email: spoc.email,
            mobile: spoc.mobile,
            department: spoc.department ?? '',
            designation: spoc.designation ?? '',
            address: addressOf(spoc, lookups.geo),
            projects: [...spoc.projects],
          }
        : { ...EMPTY, projects: projects.map((p) => p.id) },
    [spoc, projects, lookups],
  );
  const last = STEPS.length - 1;

  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial);
      setStep(0);
      setReached(editing ? last : 0);
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [open, initial, editing, last]);

  const departments = useMemo(() => lookups.departments.map((d) => ({ value: d, label: d })), [lookups]);
  const designations = useMemo(() => lookups.designations.map((d) => ({ value: d, label: d })), [lookups]);
  // Address: country → state → city, each narrowing the next
  const addr = form.address;
  const setAddr = (patch) => setForm((f) => ({ ...f, address: { ...f.address, ...patch } }));
  const countries = useMemo(() => Object.keys(lookups.geo).map((c) => ({ value: c, label: c })), [lookups]);
  const states = useMemo(() => Object.keys(lookups.geo[addr.country] ?? {}).sort().map((s) => ({ value: s, label: s })), [lookups, addr.country]);
  const cities = useMemo(() => (lookups.geo[addr.country]?.[addr.state] ?? []).map((c) => ({ value: c, label: c })), [lookups, addr.country, addr.state]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => {
    const e = validate(form, {
      name: [required('Enter the SPOC’s name')],
      email: [required('Enter an email address'), isEmail()],
      mobile: [required('Enter a mobile number'), (v) => (v && v.length !== 10 ? 'Enter all 10 digits' : undefined)],
    });
    if (!e.email && clientsApi.spocEmailTaken(clientId, form.email, spoc?.id)) e.email = 'Another SPOC of this client already uses this email';
    return e;
  }, [form, clientId, spoc]);
  const err = (k) => (tried || touched[k] ? errors[k] : undefined);
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const detailsOk = !STEPS[0].fields.some((k) => errors[k]);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const go = (i) => {
    setStep(i);
    setReached((r) => Math.max(r, i));
  };
  const next = () => {
    setTried(true);
    if (detailsOk) go(1);
  };

  const save = async () => {
    if (!detailsOk) {
      setTried(true);
      go(0);
      toast.error('Check the highlighted fields', { description: 'Some details need a fix before saving.' });
      return;
    }
    setSaving(true);
    try {
      const saved = await clientsApi.saveSpoc(clientId, { ...form, id: spoc?.id });
      toast.success(editing ? 'SPOC updated' : 'SPOC added', { description: `${saved.name} · ${saved.projects.length} of ${projects.length} projects` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the SPOC' : 'Couldn’t add the SPOC', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const footer = (
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
      {step < last && (
        <Button variant={editing ? 'secondary' : 'primary'} rightIcon={ArrowRight} onClick={next} disabled={saving}>
          Next
        </Button>
      )}
      {(editing ? changed : step === last) && (
        <Button onClick={save} loading={saving}>
          {editing ? 'Save changes' : 'Add SPOC'}
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
        size="lg"
        icon={UserCog}
        title={editing ? 'Edit SPOC' : 'Add SPOC'}
        description={editing ? spoc.name : 'A point of contact at this client and the projects they can see.'}
        footer={footer}
      >
        <Stepper steps={STEPS} current={step} reachable={reached} onStepClick={(i) => (i === 0 || detailsOk ? go(i) : next())} orientation="horizontal" className="mb-5 border-b border-border pb-5 [&_li]:min-w-0 [&_p]:truncate" />

        <div key={step} className="animate-fade-in">
          {step === 0 ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <FormField label="SPOC name" required error={err('name')} className="sm:col-span-2">
                <Input leftIcon={UserRound} placeholder="Full name" autoComplete="off" value={form.name} onChange={(e) => set({ name: lettersOnly(e.target.value) })} onBlur={blur('name')} />
              </FormField>
              <FormField label="Email" required error={err('email')}>
                <Input type="email" leftIcon={Mail} placeholder="name@company.com" autoComplete="off" value={form.email} onChange={(e) => set({ email: e.target.value })} onBlur={blur('email')} />
              </FormField>
              <FormField label="Mobile number" required error={err('mobile')}>
                <PrefixInput
                  prefix="+91"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={form.mobile}
                  onChange={(e) => set({ mobile: e.target.value.replace(/\D/g, '') })}
                  onBlur={blur('mobile')}
                />
              </FormField>
              <FormField label="Department" optional>
                <SearchableSelect options={departments} value={form.department} onChange={(department) => set({ department })} placeholder="Select department" searchPlaceholder="Search departments…" clearable />
              </FormField>
              <FormField label="Designation" optional>
                <SearchableSelect options={designations} value={form.designation} onChange={(designation) => set({ designation })} placeholder="Select designation" searchPlaceholder="Search designations…" clearable />
              </FormField>
              {/* Address (optional as a whole — marked once on the heading, not on every field) */}
              <div className="flex items-center gap-3 pt-1 sm:col-span-2">
                <span className="text-[13px] font-semibold text-text">
                  Address <span className="font-normal text-text-muted">(optional)</span>
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <FormField label="Address line 1">
                <Input placeholder="Building, street" maxLength={120} value={addr.line1} onChange={(e) => setAddr({ line1: e.target.value })} />
              </FormField>
              <FormField label="Address line 2">
                <Input placeholder="Area, landmark" maxLength={120} value={addr.line2} onChange={(e) => setAddr({ line2: e.target.value })} />
              </FormField>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:col-span-2 sm:grid-cols-3">
                <FormField label="Country">
                  <SearchableSelect options={countries} value={addr.country} onChange={(country) => setAddr({ country, state: '', city: '' })} placeholder="Select country" searchPlaceholder="Search countries…" />
                </FormField>
                <FormField label="State">
                  <SearchableSelect
                    options={states}
                    value={addr.state}
                    onChange={(state) => setAddr({ state, city: '' })}
                    placeholder={addr.country ? 'Select state' : 'Country first'}
                    searchPlaceholder="Search states…"
                    disabled={!addr.country}
                    clearable
                  />
                </FormField>
                <FormField label="City">
                  <SearchableSelect
                    options={cities}
                    value={addr.city}
                    onChange={(city) => setAddr({ city })}
                    placeholder={addr.state ? 'Select city' : 'State first'}
                    searchPlaceholder="Search cities…"
                    disabled={!addr.state}
                    clearable
                  />
                </FormField>
              </div>
            </div>
          ) : (
            <ProjectAccess projects={projects} value={form.projects} onChange={(ids) => set({ projects: ids })} />
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
        title={editing ? 'Discard your changes?' : 'Discard this SPOC?'}
        description={editing ? 'Your edits to this SPOC won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/** Step 2: Select all, then one tickable row per project (full name, dates, status badge) */
function ProjectAccess({ projects, value, onChange }) {
  if (!projects.length) {
    return <p className="py-6 text-center text-[13px] text-text-muted">This client has no projects yet — you can give access once projects are set up.</p>;
  }
  const n = value.length;
  const all = n === projects.length;
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 pb-3">
        <Checkbox
          checked={all}
          indeterminate={n > 0 && !all}
          onChange={() => onChange(all ? [] : projects.map((p) => p.id))}
          label={<span className="text-[13px] font-semibold text-text">Select all</span>}
        />
        <span className="text-[13px] tabular-nums text-text-muted">
          <span className="font-semibold text-text">{n}</span> of {projects.length} selected
        </span>
      </div>
      <ul className="divide-y divide-border border-t border-border">
        {projects.map((p) => {
          const on = value.includes(p.id);
          return (
            <li key={p.id}>
              <label className={cn('-mx-2 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-sunken/50', on && 'bg-success-soft/25')}>
                <Checkbox checked={on} onChange={() => toggle(p.id)} className="mt-0.5" aria-label={p.name} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-5 text-text">{p.name}</span>
                  <span className="mt-0.5 block text-xs tabular-nums text-text-muted">
                    {formatDate(p.start)} – {formatDate(p.end)}
                  </span>
                </span>
                <StatusBadge status={p.status} className="mt-0.5 shrink-0" />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

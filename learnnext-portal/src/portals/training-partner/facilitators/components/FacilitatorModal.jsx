import { useEffect, useMemo, useState } from 'react';
import { Send, UserRoundPlus, UserRoundPen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { facilitatorsApi } from '@/services/api';
import { Button, ConfirmDialog, FormField, Input, Modal, MultiSelect, SearchableSelect, SegmentedControl } from '@/components/ui';
import { PrefixInput } from '@/shared/clients/components/clientFormFields';
import { TYPES } from './facilitatorMeta';

const EMPTY = { name: '', email: '', mobile: '', address: { line1: '', line2: '', country: 'India', state: '', city: '' }, entities: [], type: 'facilitator' };
// Dial codes for the countries in the location list (the mobile number's prefix follows the country)
const DIAL = { India: '+91', 'United Arab Emirates': '+971', Singapore: '+65', 'United Kingdom': '+44', 'United States': '+1' };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f, exceptId) {
  const e = {};
  if (!f.name.trim()) e.name = 'Enter the facilitator’s name';
  if (!f.email.trim()) e.email = 'Enter their email — the KYC link goes here';
  else if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email address';
  else if (facilitatorsApi.emailTaken(f.email, exceptId)) e.email = 'Another facilitator already uses this email';
  if (!f.mobile) e.mobile = 'Enter their mobile number';
  else if (f.address.country === 'India' ? f.mobile.length !== 10 : f.mobile.length < 6) e.mobile = f.address.country === 'India' ? 'Enter a 10-digit mobile number' : 'Enter a valid mobile number';
  if (!f.address.line1.trim()) e['address.line1'] = 'Enter the address';
  if (!f.address.country) e['address.country'] = 'Select the country';
  if (!f.address.state) e['address.state'] = 'Select the state';
  if (!f.address.city) e['address.city'] = 'Select the city';
  if (!f.entities.length) e.entities = 'Choose at least one entity';
  return e;
}

/**
 * Add a facilitator (or channel partner) and send them the KYC link — or edit one. One calm modal in three short
 * parts: Contact (name, email, mobile), Location (address lines, country → state → city) and Onboarding (the entities
 * they're onboarded for — one or more — and their type). New ones are saved with "Send KYC" (status: KYC pending); edits
 * with "Save changes" once something has changed. Closing with unsaved changes asks first.
 * `facilitator` = the one being edited (null = new). `onSaved(facilitator)` after a save.
 */
export function FacilitatorModal({ open, facilitator, onClose, onSaved }) {
  const editing = Boolean(facilitator);
  const toast = useToast();
  const { user } = useAuth();
  const lookups = useMemo(() => facilitatorsApi.lookups(), []);
  const initial = useMemo(
    () =>
      facilitator
        ? { name: facilitator.name, email: facilitator.email, mobile: facilitator.mobile, address: { ...facilitator.address }, entities: [...facilitator.entities], type: facilitator.type }
        : EMPTY,
    [facilitator],
  );

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  // Fresh form each time it opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [open, initial]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setAddress = (patch) => setForm((f) => ({ ...f, address: { ...f.address, ...patch } }));
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const errors = useMemo(() => validate(form, facilitator?.id), [form, facilitator]);
  const err = (k) => (tried || touched[k] ? errors[k] : undefined);

  const close = () => (changed && !saving ? setConfirmClose(true) : onClose());
  const save = async () => {
    setTried(true);
    if (Object.keys(errors).length) return;
    setSaving(true);
    try {
      const saved = editing ? await facilitatorsApi.update(facilitator.id, form) : await facilitatorsApi.create(form, user?.name ?? 'You');
      if (editing) toast.success('Facilitator updated', { description: saved.name });
      else toast.success('KYC link sent', { description: `${saved.name} · ${saved.email}` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the facilitator' : 'Couldn’t send the KYC link', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const a = form.address;
  const geo = lookups.geo;
  const countries = useMemo(() => Object.keys(geo).map((c) => ({ value: c, label: c })), [geo]);
  const states = useMemo(
    () =>
      Object.keys(geo[a.country] ?? {})
        .sort()
        .map((s) => ({ value: s, label: s })),
    [geo, a.country],
  );
  const cities = useMemo(() => (geo[a.country]?.[a.state] ?? []).map((c) => ({ value: c, label: c })), [geo, a.country, a.state]);
  const entityOptions = useMemo(() => [...lookups.entities].sort((x, y) => x.name.localeCompare(y.name)).map((e) => ({ value: e.id, label: e.name, description: e.prefix })), [lookups]);
  const india = a.country === 'India';

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        closeOnBackdrop={false}
        size="lg"
        icon={editing ? UserRoundPen : UserRoundPlus}
        title={editing ? 'Edit facilitator' : 'Add facilitator'}
        description={editing ? facilitator.name : 'They’ll get a KYC link by email to finish their profile, documents and bank details.'}
        // The entity modal's soft wash, so the white fields stand out
        panelClassName="sm:max-w-2xl [background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={saving}>
              Cancel
            </Button>
            {editing ? (
              <Button onClick={save} loading={saving} disabled={!changed}>
                Save changes
              </Button>
            ) : (
              <Button leftIcon={Send} onClick={save} loading={saving}>
                Send KYC
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-6 pt-1">
          <Part title="Contact">
            <FormField label="Name" required error={err('name')} className="sm:col-span-2">
              <Input placeholder="e.g. Abhinay Tomar" autoComplete="off" value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={touch('name')} />
            </FormField>
            <FormField label="Email" required error={err('email')}>
              <Input type="email" placeholder="name@example.com" autoComplete="off" value={form.email} onChange={(e) => set({ email: e.target.value })} onBlur={touch('email')} />
            </FormField>
            <FormField label="Mobile" required error={err('mobile')}>
              <PrefixInput
                prefix={DIAL[a.country] ?? '+'}
                inputMode="numeric"
                maxLength={india ? 10 : 14}
                placeholder={india ? '98765 43210' : 'Mobile number'}
                value={form.mobile}
                onChange={(e) => set({ mobile: e.target.value.replace(/\D/g, '') })}
                onBlur={touch('mobile')}
              />
            </FormField>
          </Part>

          <Part title="Location">
            <FormField label="Address line 1" required error={err('address.line1')}>
              <Input placeholder="House / flat, street" value={a.line1} onChange={(e) => setAddress({ line1: e.target.value })} onBlur={touch('address.line1')} />
            </FormField>
            <FormField label="Address line 2" optional>
              <Input placeholder="Area, landmark" value={a.line2} onChange={(e) => setAddress({ line2: e.target.value })} />
            </FormField>
            <FormField label="Country" required error={err('address.country')}>
              <SearchableSelect
                options={countries}
                value={a.country}
                onChange={(country) => {
                  setAddress({ country, state: '', city: '' });
                  if (country !== 'India') set({ mobile: form.mobile.slice(0, 14) });
                }}
                placeholder="Select country"
                searchPlaceholder="Search countries…"
              />
            </FormField>
            <FormField label="State" required error={err('address.state')}>
              <SearchableSelect
                options={states}
                value={a.state}
                onChange={(state) => {
                  setAddress({ state, city: '' });
                  touch('address.state')();
                }}
                placeholder={a.country ? 'Select state' : 'Pick a country first'}
                searchPlaceholder="Search states…"
                disabled={!a.country}
              />
            </FormField>
            <FormField label="City" required error={err('address.city')} className="sm:col-span-2">
              <SearchableSelect
                options={cities}
                value={a.city}
                onChange={(city) => {
                  setAddress({ city });
                  touch('address.city')();
                }}
                placeholder={a.state ? 'Select city' : 'Pick a state first'}
                searchPlaceholder="Search cities…"
                disabled={!a.state}
              />
            </FormField>
          </Part>

          <Part title="Onboarding">
            <FormField label="Onboarding for" required error={err('entities')} helper="One or more entities" className="sm:col-span-2">
              <MultiSelect
                options={entityOptions}
                value={form.entities}
                onChange={(entities) => {
                  set({ entities });
                  touch('entities')();
                }}
                placeholder="Select entities"
                searchPlaceholder="Search entities…"
              />
            </FormField>
            <FormField label="Type" required className="sm:col-span-2">
              <SegmentedControl tabs={TYPES.map(({ value, label }) => ({ value, label }))} value={form.type} onChange={(type) => set({ type })} ariaLabel="Type" fullWidth />
            </FormField>
          </Part>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        title={editing ? 'Discard your changes?' : 'Discard this facilitator?'}
        description={editing ? 'Your edits won’t be saved.' : 'The details you’ve entered won’t be saved and no KYC link will be sent.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/** One part of the form: a quiet heading over a two-column grid (one column on phones) */
function Part({ title, children }) {
  return (
    <section aria-label={title}>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">{title}</h3>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

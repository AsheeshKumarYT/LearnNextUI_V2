import { useEffect, useId, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, AtSign, Camera, Plus, UserRoundCog, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { usersApi } from '@/services/api';
import { Button, ConfirmDialog, DatePicker, FormField, Input, Modal, SearchableSelect, Select, Stepper, Switch } from '@/components/ui';
import { PasswordHint } from './PasswordHint';
import { PrefixInput } from '@/shared/clients/components/clientFormFields';
import { EMPTY_USER, USER_STEPS, validateUser, yearsAgo } from './userRules';

const digits = (v) => v.replace(/\D/g, '');
// Date of birth is kept as yyyy-mm-dd; the picker works with local Date objects
const toDate = (iso) => (iso ? new Date(`${iso}T00:00:00`) : null);
const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Add / edit a user in a modal, one part at a time: Personal → Address → Login & role (same pattern as the Entity
 * master: a Stepper under the title, Back / Next in the footer, two columns per step). Fields follow the old system's
 * user form. "Required" messages show only after Next / Save; typed-value problems (format, duplicates) show when the
 * field is left. When editing, every step is open (the step bar works as tabs), the password isn't shown (row action
 * "Change password" sets it) and "Save changes" appears once something has changed. Closing with unsaved changes asks.
 * `user` = the one being edited (null = new); `users` = everyone (for Parent user). `onSaved(user)` after a save.
 */
export function UserModal({ open, user, users, onClose, onSaved }) {
  const editing = Boolean(user);
  const toast = useToast();
  const initial = useMemo(() => (user ? { ...EMPTY_USER, ...structuredClone(user), password: '' } : EMPTY_USER), [user]);
  const last = USER_STEPS.length - 1;

  const [form, setForm] = useState(initial);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  // Alternate email / number: shown once asked for (or when the user already has one)
  const [alt, setAlt] = useState({ email: false, mobile: false });

  useEffect(() => {
    if (open) {
      setAlt({ email: Boolean(initial.altEmail), mobile: Boolean(initial.altMobile) });
      setForm(initial);
      setStep(0);
      setReached(editing ? last : 0);
      setTouched({});
      setTried({});
      setSaving(false);
    }
  }, [open, initial, editing, last]);

  const lookups = useMemo(() => usersApi.lookups(), []);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setAddress = (patch) => setForm((f) => ({ ...f, address: { ...f.address, ...patch } }));
  const changed = JSON.stringify(form) !== JSON.stringify(initial);
  const { errors, missing } = useMemo(
    () =>
      validateUser(form, {
        isEdit: editing,
        usernameTaken: (u) => usersApi.usernameTaken(u, user?.id),
        emailTaken: (e) => usersApi.emailTaken(e, user?.id),
      }),
    [form, editing, user],
  );
  const stepOf = (k) => USER_STEPS.findIndex((s) => s.fields.includes(k));
  // Missing values: only once Next / Save was pressed on that step. Wrong values: as soon as the field is left.
  const err = (k) => (tried[stepOf(k)] || (touched[k] && !missing.has(k)) ? errors[k] : undefined);
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const stepErrors = (i) => USER_STEPS[i].fields.filter((k) => errors[k]);

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
    const bad = USER_STEPS.findIndex((_, i) => stepErrors(i).length);
    if (bad >= 0) {
      setTried(Object.fromEntries(USER_STEPS.map((_, i) => [i, true])));
      if (bad !== step) go(bad);
      const n = stepErrors(bad).length;
      toast.error('Check the highlighted fields', { description: `${n} ${n === 1 ? 'field needs' : 'fields need'} a fix in ${USER_STEPS[bad].label}.` });
      return;
    }
    setSaving(true);
    try {
      const saved = editing ? await usersApi.update(user.id, form) : await usersApi.create(form);
      toast.success(editing ? 'User updated' : 'User added', { description: `${saved.name} · ${saved.username}` });
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(editing ? 'Couldn’t save the user' : 'Couldn’t add the user', { description: e.message });
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
  const opts = (list) => list.map((x) => ({ value: x, label: x }));
  // Parent user: anyone else (not this user, nor someone who reports to them — that would make a loop)
  const parentOptions = useMemo(() => {
    const below = new Set();
    const queue = user ? [user.id] : [];
    while (queue.length) {
      const id = queue.shift();
      users.forEach((u) => {
        if (u.parent === id && !below.has(u.id)) {
          below.add(u.id);
          queue.push(u.id);
        }
      });
    }
    return users.filter((u) => u.id !== user?.id && !below.has(u.id)).map((u) => ({ value: u.id, label: u.name, description: u.role }));
  }, [users, user]);

  const footer = (
    <>
      <span className="hidden text-xs text-text-muted sm:mr-auto sm:block">
        Step {step + 1} of {USER_STEPS.length}
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
          {editing ? 'Save changes' : 'Save user'}
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
        icon={UserRoundCog}
        title={editing ? 'Edit user' : 'Add user'}
        description={editing ? user.name : 'Someone who can sign in to LearnNext.'}
        footer={footer}
        panelClassName="sm:max-w-3xl [background:linear-gradient(to_bottom_right,color-mix(in_srgb,var(--color-chart-1)_5%,transparent),transparent_40%),color-mix(in_srgb,var(--ln-background)_45%,var(--ln-elevated))]! dark:[background:var(--ln-elevated)]!"
      >
        <Stepper steps={USER_STEPS} current={step} reachable={reached} onStepClick={go} orientation="horizontal" className="mb-5 border-b border-border pb-5 [&_li]:min-w-0 [&_p]:truncate" />

        <div key={step} className="grid animate-fade-in grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          {/* Personal (picked from previews: "Photo + name header"): a round photo beside the name, then gender / date of
              birth, then email / mobile (no divider or section label — user's call), alternates behind a link until needed */}
          {step === 0 && (
            <>
              <div className="flex items-start gap-4 sm:col-span-2">
                <PhotoPicker value={form.photo} name={form.name} onChange={(photo) => set({ photo })} onError={(m) => toast.error(m)} />
                <FormField label="Full name" required error={err('name')} className="min-w-0 flex-1">
                  <Input placeholder="e.g. Meera Iyer" maxLength={80} value={form.name} onChange={(e) => set({ name: e.target.value })} onBlur={blur('name')} />
                </FormField>
              </div>
              <FormField label="Gender" required error={err('gender')}>
                <Select placeholder="Select gender" options={opts(lookups.genders)} value={form.gender} onChange={(e) => set({ gender: e.target.value })} />
              </FormField>
              <FormField label="Date of birth" required error={err('dob')}>
                {/* The app's own date picker, with month / year dropdowns to reach a birth year quickly */}
                <DatePicker
                  pickMonthYear
                  placeholder="Choose a date"
                  minDate={toDate(yearsAgo(100))}
                  maxDate={toDate(yearsAgo(16))}
                  value={toDate(form.dob)}
                  onChange={(d) => set({ dob: d ? toIso(d) : '' })}
                />
              </FormField>

              <div className="flex flex-col gap-4">
                <FormField label="Email" required error={err('email')}>
                  <Input type="email" leftIcon={AtSign} placeholder="name@company.com" value={form.email} onChange={(e) => set({ email: e.target.value.trim() })} onBlur={blur('email')} />
                </FormField>
                {alt.email ? (
                  <FormField label="Alternate email" optional error={err('altEmail')}>
                    <Input type="email" leftIcon={AtSign} placeholder="Another email" autoFocus={!form.altEmail} value={form.altEmail} onChange={(e) => set({ altEmail: e.target.value.trim() })} onBlur={blur('altEmail')} />
                  </FormField>
                ) : (
                  <AddLink onClick={() => setAlt((s) => ({ ...s, email: true }))}>Alternate email</AddLink>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <FormField label="Mobile number" required error={err('mobile')}>
                  <PrefixInput prefix="+91" inputMode="numeric" maxLength={10} placeholder="98765 43210" value={form.mobile} onChange={(e) => set({ mobile: digits(e.target.value) })} onBlur={blur('mobile')} />
                </FormField>
                {alt.mobile ? (
                  <FormField label="Alternate mobile number" optional error={err('altMobile')}>
                    <PrefixInput prefix="+91" inputMode="numeric" maxLength={10} placeholder="Another number" autoFocus={!form.altMobile} value={form.altMobile} onChange={(e) => set({ altMobile: digits(e.target.value) })} onBlur={blur('altMobile')} />
                  </FormField>
                ) : (
                  <AddLink onClick={() => setAlt((s) => ({ ...s, mobile: true }))}>Alternate number</AddLink>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <FormField label="Address line 1" required error={err('address.line1')}>
                <Input placeholder="House / building, street" value={a.line1} onChange={(e) => setAddress({ line1: e.target.value })} onBlur={blur('address.line1')} />
              </FormField>
              <FormField label="Address line 2" optional>
                <Input placeholder="Area, landmark" value={a.line2} onChange={(e) => setAddress({ line2: e.target.value })} />
              </FormField>
              <FormField label="Country" required error={err('address.country')}>
                <SearchableSelect options={countries} value={a.country} onChange={(country) => setAddress({ country, state: '', city: '' })} placeholder="Select country" searchPlaceholder="Search countries…" />
              </FormField>
              <FormField label="State" required error={err('address.state')}>
                <SearchableSelect options={states} value={a.state} onChange={(state) => setAddress({ state, city: '' })} placeholder="Select state" searchPlaceholder="Search states…" disabled={!a.country} />
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
              <FormField label="Pincode" required error={err('address.pin')}>
                <Input
                  inputMode="numeric"
                  maxLength={a.country === 'India' ? 6 : 10}
                  placeholder="400001"
                  value={a.pin}
                  onChange={(e) => setAddress({ pin: a.country === 'India' ? digits(e.target.value) : e.target.value })}
                  onBlur={blur('address.pin')}
                />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <FormField label="Role" required error={err('role')}>
                <SearchableSelect options={opts(lookups.roles)} value={form.role} onChange={(role) => set({ role })} placeholder="Select role" searchPlaceholder="Search roles…" />
              </FormField>
              <FormField label="Designation" required error={err('designation')}>
                <SearchableSelect options={opts(lookups.designations)} value={form.designation} onChange={(designation) => set({ designation })} placeholder="Select designation" searchPlaceholder="Search designations…" />
              </FormField>
              <FormField label="Application" required error={err('application')}>
                <Select placeholder="Select application" options={opts(lookups.applications)} value={form.application} onChange={(e) => set({ application: e.target.value })} />
              </FormField>
              <FormField label="Parent user" optional>
                <SearchableSelect options={parentOptions} value={form.parent} onChange={(parent) => set({ parent: parent ?? '' })} placeholder="Select user" searchPlaceholder="Search users…" clearable />
              </FormField>
              <div className="flex flex-col gap-4">
                <FormField label="Username" required error={err('username')}>
                  <Input placeholder="e.g. name@company.com" maxLength={60} value={form.username} onChange={(e) => set({ username: e.target.value.trim() })} onBlur={blur('username')} />
                </FormField>
                {/* Most logins use the email — a quiet link (like "+ Alternate email") copies it in */}
                {form.email && form.username !== form.email && (
                  <AddLink icon={AtSign} onClick={() => set({ username: form.email })}>
                    Use email as username
                  </AddLink>
                )}
              </div>
              {!editing ? (
                <FormField label="Password" required error={err('password')}>
                  <Input type="password" autoComplete="new-password" placeholder="Set a password" value={form.password} onChange={(e) => set({ password: e.target.value })} onBlur={blur('password')} />
                  <PasswordHint password={form.password} />
                </FormField>
              ) : (
                <FormField label="Status">
                  <div className="flex h-10 items-center sm:h-9">
                    <Switch checked={form.status === 'active'} onChange={(on) => set({ status: on ? 'active' : 'inactive' })} label={form.status === 'active' ? 'Active — can sign in' : 'Inactive — can’t sign in'} />
                  </div>
                </FormField>
              )}
              {/* "IsAdmin" in the old form */}
              <FormField label="Admin rights">
                <div className="flex h-10 items-center sm:h-9">
                  <Switch checked={form.isAdmin} onChange={(isAdmin) => set({ isAdmin })} label={form.isAdmin ? 'Yes — can manage other users' : 'No'} />
                </div>
              </FormField>
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
        title={editing ? 'Discard your changes?' : 'Discard this user?'}
        description={editing ? 'Your edits to this user won’t be saved.' : 'The details you’ve entered won’t be saved.'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}

/**
 * Round profile photo (Add user): an empty dashed circle with a camera opens the file picker; with a photo, the circle
 * shows it (camera on hover = change) and a small × removes it. PNG / JPG up to 2 MB, kept as a data URL.
 */
function PhotoPicker({ value, name, onChange, onError }) {
  const id = useId();
  const read = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return onError?.('Use a PNG or JPG photo.');
    if (file.size > 2 * 1024 * 1024) return onError?.('Photo must be under 2 MB.');
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(file);
    return undefined;
  };
  return (
    <div className="relative shrink-0 pt-1">
      <label
        htmlFor={id}
        title={value ? 'Change photo' : 'Add a photo (PNG or JPG, up to 2 MB)'}
        className={
          'group relative flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors focus-within:ring-[3px] focus-within:ring-focus ' +
          (value ? 'border border-border-strong' : 'border-[1.5px] border-dashed border-chart-1/45 bg-chart-1/10 text-primary-text hover:border-chart-1/70 hover:bg-chart-1/15')
        }
      >
        {value ? (
          <>
            <img src={value} alt={name ? `${name}’s photo` : 'Profile photo'} className="size-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
              <Camera className="size-5" />
            </span>
          </>
        ) : (
          <Camera className="size-6" aria-hidden="true" />
        )}
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          aria-label={value ? 'Change photo' : 'Add a photo'}
          onChange={(e) => {
            read(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Remove photo"
          title="Remove photo"
          className="absolute -right-0.5 top-0.5 inline-flex size-5 items-center justify-center rounded-full border border-border bg-elevated text-text-muted shadow-xs hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** A quiet "+ Alternate …" link that reveals an optional field */
function AddLink({ onClick, icon: Icon = Plus, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mt-2 inline-flex items-center gap-1 self-start rounded text-[13px] font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </button>
  );
}

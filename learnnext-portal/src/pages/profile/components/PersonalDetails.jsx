import { Briefcase, Building2, CheckCircle2, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useForm } from '@/hooks/useForm';
import { email, maxLength, minLength, phone, required } from '@/utils/validation';
import { Button, Card, CardHeader, FormField, Input, Select, Textarea } from '@/components/ui';

const FIELDS = ['name', 'email', 'phone', 'location', 'department', 'designation', 'bio'];
const BIO_MAX = 240;
const pick = (user) => Object.fromEntries(FIELDS.map((k) => [k, user[k] ?? '']));

const schema = {
  name: [required('Enter your full name'), minLength(2, 'Name looks too short')],
  email: [required('Enter your email address'), email()],
  phone: [required('Enter your mobile number'), phone('Enter a valid mobile number')],
  department: [required('Choose your department')],
  designation: [required('Enter your designation')],
  bio: [maxLength(BIO_MAX)],
};

/**
 * Editable basic details. The footer turns into a save bar as soon as something changes.
 * "About" grows to fill the card so it lines up with the column beside it.
 */
export function PersonalDetails({ user, departments, onSave, className }) {
  const initial = pick(user);
  const form = useForm(initial, schema);
  const dirty = FIELDS.some((k) => (form.values[k] ?? '').trim() !== (initial[k] ?? ''));

  const submit = form.handleSubmit(async (values) => {
    const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
    await onSave(clean);
    form.reset(clean);
  });

  return (
    <Card tint="primary" softTint padding="none" className={cn('flex flex-col', className)}>
      <CardHeader divided icon={UserRound} title="Personal details" description={<><span className="sm:hidden">Your details on LearnNext.</span><span className="max-sm:hidden">How you appear to your team across LearnNext.</span></>} />

      {/* Airy layout: no helper lines (placeholders carry the format hints), wider gaps between fields */}
      <form id="profile-form" onSubmit={submit} noValidate className="flex flex-1 flex-col gap-6 px-5 pb-7 pt-1 sm:px-6">
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
          <FormField label="Full name" required error={form.errors.name}>
            <Input leftIcon={UserRound} autoComplete="name" placeholder="e.g. Atul Kumar" {...form.field('name')} />
          </FormField>
          <FormField label="Email address" required error={form.errors.email}>
            <Input type="email" leftIcon={Mail} autoComplete="email" placeholder="you@company.com" {...form.field('email')} />
          </FormField>
          <FormField label="Mobile number" required error={form.errors.phone}>
            <Input type="tel" leftIcon={Phone} autoComplete="tel" placeholder="+91 98765 43210" {...form.field('phone')} />
          </FormField>
          <FormField label="Location" optional error={form.errors.location}>
            <Input leftIcon={MapPin} autoComplete="address-level2" placeholder="City, country" {...form.field('location')} />
          </FormField>
          <FormField label="Department" required error={form.errors.department}>
            <Select leftIcon={Building2} options={departments} placeholder="Choose a department" {...form.field('department')} />
          </FormField>
          <FormField label="Designation" required error={form.errors.designation}>
            <Input leftIcon={Briefcase} autoComplete="organization-title" placeholder="e.g. Program Manager" {...form.field('designation')} />
          </FormField>
        </div>

        <FormField label="About" optional fill error={form.errors.bio}>
          <Textarea fill rows={3} maxLength={BIO_MAX} showCount placeholder="A short line about your role, shown to your team" {...form.field('bio')} />
        </FormField>
      </form>

      {/* Save bar: calm "saved" state, highlighted once there are unsaved edits */}
      <div
        className={cn(
          'flex flex-col gap-3 rounded-b-card border-t px-5 py-3.5 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-6',
          dirty ? 'border-primary/20 bg-primary-soft' : 'border-dashed border-border-strong',
        )}
      >
        <p className={cn('flex items-center gap-2 text-[13px]', dirty ? 'font-semibold text-primary-text' : 'text-text-muted')} aria-live="polite">
          {dirty ? (
            <>
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              You have unsaved changes
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
              All changes saved
            </>
          )}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => form.reset(initial)} disabled={!dirty || form.submitting} className="flex-1 sm:flex-none">
            Discard
          </Button>
          <Button type="submit" form="profile-form" loading={form.submitting} disabled={!dirty} className="flex-1 sm:flex-none">
            Save changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

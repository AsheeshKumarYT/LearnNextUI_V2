import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { authApi } from '@/services/api';
import { matches, minLength, required } from '@/utils/validation';
import { Button, FormField, Input } from '@/components/ui';
import { AuthHeading } from './components/AuthHeading';
import { PasswordStrength, PASSWORD_RULES } from '@/components/ui/PasswordStrength';

const strongEnough = () => (v) => (v && PASSWORD_RULES.filter((r) => r.test(v)).length < 3 ? 'Choose a stronger password' : undefined);

export default function ResetPassword() {
  const navigate = useNavigate();
  const form = useForm(
    { password: '', confirm: '' },
    {
      password: [required('Enter a new password'), minLength(8), strongEnough()],
      confirm: [required('Confirm your new password'), matches('password', 'Passwords do not match')],
    },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    await authApi.resetPassword(values);
    navigate('/reset-success', { replace: true });
  });

  return (
    <>
      <AuthHeading icon={ShieldCheck} title="Set a new password" description="Your new password must be different from previously used passwords." />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="New password" error={form.errors.password} required>
          <Input type="password" leftIcon={Lock} placeholder="Create a password" autoComplete="new-password" autoFocus {...form.field('password')} />
        </FormField>
        <PasswordStrength password={form.values.password} />
        <FormField label="Confirm password" error={form.errors.confirm} required>
          <Input type="password" leftIcon={Lock} placeholder="Repeat the password" autoComplete="new-password" {...form.field('confirm')} />
        </FormField>
        <Button type="submit" size="lg" fullWidth loading={form.submitting}>
          Reset password
        </Button>
      </form>
    </>
  );
}

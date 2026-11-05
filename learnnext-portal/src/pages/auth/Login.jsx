import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { DEMO_CREDENTIALS as demoCredentials } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { required, email as emailRule } from '@/utils/validation';
import { Button, Checkbox, FormField, Input } from '@/components/ui';
import { Alert } from '@/components/feedback/Alert';
import { AuthHeading } from './components/AuthHeading';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);
  // Fetch the role picker ahead of time, so it swaps in instantly after Sign in
  useEffect(() => {
    import('./ChooseRole');
  }, []);

  const form = useForm(
    { email: '', password: '' },
    { email: [required('Enter your email address'), emailRule()], password: [required('Enter your password')] },
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    try {
      const { user, role } = await login({ ...values, remember });
      // Several roles and no remembered choice → the role picker greets them instead
      // afterLoad: appears once the dashboard has finished loading, not while it is still on its way
      if (role) toast.success(`Welcome back, ${user.name.split(' ')[0]}`, { afterLoad: true });
      // PublicOnlyRoute performs the redirect (back to the requested page or /dashboard; the role picker first if needed)
    } catch (e) {
      setError(e.message);
    }
  });

  const fillDemo = () => {
    form.setValues({ email: demoCredentials.email, password: demoCredentials.password });
    setError('');
  };

  return (
    <>
      <AuthHeading title="Sign in to LearnNext" description="Welcome back. Sign in to continue." />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 short:max-lg:gap-4">
        {error && <Alert tone="danger" title="Sign in failed">{error}</Alert>}

        <FormField label="Email" error={form.errors.email} required>
          <Input type="email" leftIcon={Mail} placeholder="you@company.com" autoComplete="email" autoFocus {...form.field('email')} />
        </FormField>

        <FormField
          label="Password"
          error={form.errors.password}
          required
          labelAction={
            <Link to="/forgot-password" className="rounded text-[13px] font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Forgot password?
            </Link>
          }
        >
          <Input type="password" leftIcon={Lock} placeholder="Enter your password" autoComplete="current-password" {...form.field('password')} />
        </FormField>

        <Checkbox label="Keep me signed in" checked={remember} onChange={(e) => setRemember(e.target.checked)} />

        <Button type="submit" size="lg" fullWidth loading={form.submitting}>
          {form.submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-8 rounded-card border border-dashed border-primary/30 bg-surface-secondary p-4 max-lg:mt-6 short:max-lg:mt-5 short:max-lg:py-3 lg:bg-surface-secondary/50 dark:border-primary/40">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 text-[13px]">
            <p className="font-medium text-text">Demo account</p>
            <p className="mt-0.5 truncate text-text-muted">{demoCredentials.email} · {demoCredentials.password}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fillDemo}>
            Use demo
          </Button>
        </div>
      </div>
    </>
  );
}

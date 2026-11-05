import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, MailCheck } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/hooks/useToast';
import { authApi } from '@/services/api';
import { required, email as emailRule } from '@/utils/validation';
import { Button, FormField, Input } from '@/components/ui';
import { AuthHeading } from './components/AuthHeading';

export default function ForgotPassword() {
  const toast = useToast();
  const [sentTo, setSentTo] = useState('');
  const [resending, setResending] = useState(false);
  const form = useForm({ email: '' }, { email: [required('Enter your email address'), emailRule()] });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    await authApi.requestPasswordReset(email);
    setSentTo(email);
  });

  const resend = async () => {
    setResending(true);
    await authApi.requestPasswordReset(sentTo);
    setResending(false);
    toast.success('Reset link sent again', { description: `Check ${sentTo}` });
  };

  if (sentTo) {
    return (
      <>
        <AuthHeading
          icon={MailCheck}
          tone="success"
          title="Check your inbox"
          description={
            <>
              We sent a password reset link to <span className="font-medium text-text">{sentTo}</span>. The link expires in 30 minutes.
            </>
          }
        />
        <div className="flex flex-col gap-3">
          <Button as={Link} to="/reset-password?token=demo" size="lg" fullWidth>
            Open reset link (demo)
          </Button>
          <Button variant="secondary" size="lg" fullWidth loading={resending} onClick={resend}>
            Resend email
          </Button>
        </div>
        <BackToLogin />
      </>
    );
  }

  return (
    <>
      <AuthHeading icon={KeyRound} title="Forgot your password?" description="Enter the email linked to your account and we’ll send you a reset link." />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Email" error={form.errors.email} required>
          <Input type="email" leftIcon={Mail} placeholder="you@company.com" autoComplete="email" autoFocus {...form.field('email')} />
        </FormField>
        <Button type="submit" size="lg" fullWidth loading={form.submitting}>
          Send reset link
        </Button>
      </form>
      <BackToLogin />
    </>
  );
}

function BackToLogin() {
  return (
    <Link to="/login" className="mx-auto mt-8 flex w-fit items-center gap-1.5 rounded text-[13px] font-medium text-text-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <ArrowLeft className="size-4" /> Back to sign in
    </Link>
  );
}

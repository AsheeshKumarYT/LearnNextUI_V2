import { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Lock, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { matches, minLength, required } from '@/utils/validation';
import { DEMO_OTP, profileApi } from '@/services/api';
import { Alert } from '@/components/feedback';
import { Button, FormField, Input, Modal, OtpInput, PasswordStrength, PASSWORD_RULES, RadioGroup, Stepper } from '@/components/ui';

const STEPS = [{ label: 'Verify' }, { label: 'Code' }, { label: 'Password' }];
const RESEND_AFTER = 30;
const CHANNEL_META = {
  email: { icon: Mail, label: 'Email' },
  phone: { icon: Smartphone, label: 'SMS to mobile' },
};

const strongEnough = () => (v) => (v && PASSWORD_RULES.filter((r) => r.test(v)).length < 3 ? 'Choose a stronger password' : undefined);
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Ticks a number of seconds down to 0 while `active`. */
function useCountdown(seconds, active, resetKey) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!active) return undefined;
    setLeft(seconds);
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds, active, resetKey]);
  return left;
}

/**
 * OTP-verified password change: choose email / SMS → enter the 6-digit code → set a new password → done.
 */
export function ChangePasswordModal({ open, onClose, onChanged }) {
  const [step, setStep] = useState(0);
  const [channel, setChannel] = useState('email');
  const [sent, setSent] = useState(null); // { destination, expiresIn }
  const [sentAt, setSentAt] = useState(0); // bump to restart timers on resend
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState('');

  const form = useForm(
    { password: '', confirm: '' },
    {
      password: [required('Enter a new password'), minLength(8), strongEnough()],
      confirm: [required('Confirm your new password'), matches('password', 'Passwords do not match')],
    },
  );

  const onCodeStep = open && step === 1;
  const resendIn = useCountdown(RESEND_AFTER, onCodeStep, sentAt);
  const expiresIn = useCountdown(sent?.expiresIn ?? 300, onCodeStep, sentAt);
  const channels = open ? profileApi.otpChannels() : [];

  // Fresh flow every time the dialog opens
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setChannel('email');
    setSent(null);
    setCode('');
    setCodeError('');
    setSendError('');
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sendCode = async () => {
    setBusy(true);
    setSendError('');
    try {
      const res = await profileApi.sendOtp(channel);
      setSent(res);
      setSentAt(Date.now());
      setCode('');
      setCodeError('');
      setStep(1);
    } catch (e) {
      setSendError(e.message || 'Couldn’t send the code. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (value = code) => {
    if (value.length < 6) return setCodeError('Enter all 6 digits.');
    if (expiresIn === 0) return setCodeError('This code has expired. Send a new one.');
    setBusy(true);
    setCodeError('');
    try {
      await profileApi.verifyOtp(value);
      setStep(2);
    } catch (e) {
      setCodeError(e.message);
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const savePassword = form.handleSubmit(async (values) => {
    const updated = await profileApi.changePassword(values);
    onChanged?.(updated);
    setStep(3);
  });

  const done = step === 3;

  const footer = {
    0: (
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={sendCode} loading={busy}>Send code</Button>
      </>
    ),
    1: (
      <>
        <Button variant="secondary" onClick={() => setStep(0)} disabled={busy}>Back</Button>
        <Button onClick={() => verify()} loading={busy} disabled={code.length < 6}>Verify code</Button>
      </>
    ),
    2: (
      <>
        <Button variant="secondary" onClick={onClose} disabled={form.submitting}>Cancel</Button>
        <Button type="submit" form="new-password-form" loading={form.submitting}>Update password</Button>
      </>
    ),
    3: <Button onClick={onClose} fullWidth className="sm:w-auto">Done</Button>,
  }[step];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdrop={false}
      icon={done ? CheckCircle2 : KeyRound}
      title={done ? 'Password updated' : 'Change password'}
      description={done ? undefined : 'We’ll confirm it’s you with a one-time code first.'}
      footer={footer}
    >
      {!done && <Stepper steps={STEPS} current={step} orientation="horizontal" className="mb-6 [&_li]:min-w-0 [&_p]:truncate" />}

      {step === 0 && (
        <div className="flex animate-fade-in flex-col gap-4">
          <p className="text-[13px] text-text-secondary">Where should we send your 6-digit verification code?</p>
          <RadioGroup
            label="Send code by"
            variant="cards"
            value={channel}
            onChange={setChannel}
            className="sm:grid-cols-2"
            options={channels.map((c) => ({
              value: c.channel,
              label: CHANNEL_META[c.channel].label,
              description: c.destination,
              icon: CHANNEL_META[c.channel].icon,
            }))}
          />
          {sendError && <Alert tone="danger">{sendError}</Alert>}
        </div>
      )}

      {step === 1 && sent && (
        <form
          className="flex animate-fade-in flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
          noValidate
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-text">
              {sent.channel === 'phone' ? <Smartphone className="size-5" aria-hidden="true" /> : <Mail className="size-5" aria-hidden="true" />}
            </span>
            <p className="text-[13px] leading-5 text-text-secondary">
              We sent a code to <span className="font-semibold text-text">{sent.destination}</span>. It expires in{' '}
              <span className={expiresIn < 60 ? 'font-semibold text-warning' : 'font-semibold text-text'}>{mmss(expiresIn)}</span>.
            </p>
          </div>

          <FormField label="Verification code" error={codeError}>
            <OtpInput value={code} onChange={(v) => { setCode(v); setCodeError(''); }} onComplete={verify} disabled={busy} autoFocus />
          </FormField>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="text-text-muted">Didn’t get it?</span>
            {resendIn > 0 ? (
              <span className="tabular-nums text-text-muted">Resend in {mmss(resendIn)}</span>
            ) : (
              <Button variant="link" onClick={sendCode} disabled={busy}>
                Resend code
              </Button>
            )}
          </div>

          {/* Mock auth: show the code so the flow can be tried. Remove with the mock layer. */}
          <Alert tone="info" title="Demo mode">
            Use code <span className="font-mono font-semibold tracking-[0.2em] text-text">{DEMO_OTP}</span>
          </Alert>
        </form>
      )}

      {step === 2 && (
        <form id="new-password-form" onSubmit={savePassword} noValidate className="flex animate-fade-in flex-col gap-5">
          <Alert tone="success" icon={ShieldCheck}>Identity verified. Choose a strong new password.</Alert>
          <FormField label="New password" error={form.errors.password} required>
            <Input type="password" leftIcon={Lock} placeholder="Create a password" autoComplete="new-password" autoFocus {...form.field('password')} />
          </FormField>
          <PasswordStrength password={form.values.password} />
          <FormField label="Confirm password" error={form.errors.confirm} required>
            <Input type="password" leftIcon={Lock} placeholder="Repeat the password" autoComplete="new-password" {...form.field('confirm')} />
          </FormField>
        </form>
      )}

      {done && (
        <div className="flex animate-fade-in flex-col items-center py-4 text-center">
          <span className="relative inline-flex size-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-success-soft motion-safe:animate-ping [animation-iteration-count:2]" aria-hidden="true" />
            <span className="relative inline-flex size-20 animate-scale-in items-center justify-center rounded-full bg-gradient-to-br from-success-main to-chart-2 text-white shadow-raised">
              <CheckCircle2 className="size-10" aria-hidden="true" />
            </span>
          </span>
          <p className="mt-5 text-lg font-semibold text-text">You’re all set</p>
          <p className="mt-1 max-w-xs text-[13px] text-text-secondary">
            Your password has been changed. Use the new one the next time you sign in.
          </p>
        </div>
      )}
    </Modal>
  );
}

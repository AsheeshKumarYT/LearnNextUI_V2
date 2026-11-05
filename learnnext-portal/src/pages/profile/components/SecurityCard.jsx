import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, CardHeader } from '@/components/ui';

const DAY = 24 * 60 * 60 * 1000;
const STALE_AFTER_DAYS = 90;

function ageLabel(days) {
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 31) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months} month${months > 1 ? 's' : ''} ago` : `${Math.round(months / 12)} year${months >= 24 ? 's' : ''} ago`;
}

/** Password health + entry point to the OTP-verified password change. */
export function SecurityCard({ user, onChangePassword, className }) {
  const days = user.passwordChangedAt ? Math.floor((Date.now() - new Date(user.passwordChangedAt).getTime()) / DAY) : null;
  const stale = days == null || days > STALE_AFTER_DAYS;
  // Meter: full when just changed, empties over the recommended rotation window
  const freshness = days == null ? 0 : Math.max(6, 100 - (days / STALE_AFTER_DAYS) * 100);

  return (
    <Card tint="success" softTint className={className}>
      <CardHeader icon={ShieldCheck} iconTone="success" title="Security" description={<><span className="sm:hidden">Password and sign-in.</span><span className="max-sm:hidden">Keep your account protected.</span></>} />

      {/* Solid surface + strong hairline + small shadow so the panel reads clearly on the frosted card (phones: no inner box) */}
      <div className="relative overflow-hidden rounded-card border border-border-strong bg-surface p-4 shadow-xs dark:bg-surface-secondary max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:p-0 max-sm:shadow-none max-sm:dark:bg-transparent">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 max-sm:hidden text-white shadow-[0_8px_16px_-6px_var(--ln-primary-shadow)]">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text">Password</p>
            <p className="mt-0.5 text-xs text-text-secondary">{days == null ? 'Never changed' : `Last changed ${ageLabel(days)}`}</p>
          </div>
        </div>

        {/* Freshness meter: full when just changed, empties over the rotation window */}
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-sunken max-sm:mt-3"
          role="img"
          aria-label={`Password freshness ${Math.round(freshness)}%. We recommend a new password every ${STALE_AFTER_DAYS} days.`}
        >
          <span
            className={cn('block h-full origin-left animate-grow-x rounded-full', stale ? 'bg-warning-main' : 'bg-success-main')}
            style={{ width: `${freshness}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-text-muted">Change due every {STALE_AFTER_DAYS} days</span>
          {/* Past the window: "Renew" opens the same OTP-verified change-password flow as the button below */}
          {stale ? (
            <button
              type="button"
              onClick={onChangePassword}
              aria-haspopup="dialog"
              className="rounded font-semibold text-warning underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Renew
            </button>
          ) : (
            days != null && <span className="font-semibold tabular-nums text-text-secondary">{STALE_AFTER_DAYS - days} days left</span>
          )}
        </div>
      </div>

      <Button fullWidth className="mt-5 max-sm:mt-4" leftIcon={KeyRound} onClick={onChangePassword} aria-haspopup="dialog">
        Change password
      </Button>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-text-muted max-sm:hidden">
        <Mail className="size-3.5" aria-hidden="true" />
        We’ll verify it’s you with a one-time code
      </p>
    </Card>
  );
}

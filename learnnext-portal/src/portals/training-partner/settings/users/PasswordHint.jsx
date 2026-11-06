import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

// The password rules (first three required — see passwordProblem in userRules.js; the symbol only adds strength)
const RULES = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'upper & lower case', test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: 'a number', test: (p) => /\d/.test(p) },
  { label: 'a symbol (optional)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];
const BAR = ['bg-danger-main/70', 'bg-warning-main/70', 'bg-success-main/70', 'bg-success-main/70'];

/**
 * Quiet password guidance (picked from previews: "One quiet hint line"): a thin 4-part strength bar and one line of the
 * rules, each part turning green once met. Nothing turns red — before typing everything is simply muted.
 */
export function PasswordHint({ password = '' }) {
  const met = RULES.map((r) => r.test(password));
  const score = met.filter(Boolean).length;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {RULES.map((r, i) => (
          <span key={r.label} className={cn('h-1 flex-1 rounded-full transition-colors duration-300', password && i < score ? BAR[score - 1] : 'bg-surface-sunken dark:bg-white/[0.08]')} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-text-muted">
        {RULES.map((r, i) => (
          <span key={r.label}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            <span className={cn('transition-colors', met[i] && 'font-medium text-success')}>{r.label}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

/** "✓ Passwords match" under the confirm field, once both are typed and equal */
export function PasswordMatch({ password, confirm }) {
  if (!confirm || confirm !== password) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-success" aria-live="polite">
      <Check className="size-3.5" aria-hidden="true" />
      Passwords match
    </p>
  );
}

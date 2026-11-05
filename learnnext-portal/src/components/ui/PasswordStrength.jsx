import { Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { passwordStrength } from '@/utils/validation';

const toneBar = { danger: 'bg-danger', warning: 'bg-warning', success: 'bg-success' };
const toneText = { danger: 'text-danger', warning: 'text-warning', success: 'text-success' };

export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Upper & lowercase letters', test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: 'A number', test: (p) => /\d/.test(p) },
  { label: 'A symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/** Strength meter + rule checklist for new-password fields (reset & settings). */
export function PasswordStrength({ password = '' }) {
  const s = passwordStrength(password);
  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cn('h-1 rounded-full transition-colors', i < s.score ? toneBar[s.tone] : 'bg-surface-sunken')} />
          ))}
        </div>
        <span className={cn('w-16 text-right text-xs font-medium', password ? toneText[s.tone] : 'text-text-muted')}>{password ? s.label : '—'}</span>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li key={r.label} className={cn('flex items-center gap-1.5 text-xs', ok ? 'text-success' : 'text-text-muted')}>
              {ok ? <Check className="size-3.5" /> : <X className="size-3.5 opacity-60" />}
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

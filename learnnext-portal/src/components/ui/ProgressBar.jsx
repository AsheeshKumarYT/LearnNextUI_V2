import { cn } from '@/utils/cn';

// Bars use the bright "main" status colors; the plain status tokens are tuned for text on soft backgrounds
const tones = { primary: 'bg-primary', success: 'bg-success-main', warning: 'bg-warning-main', danger: 'bg-danger-main', info: 'bg-info-main' };
const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' };

/** <ProgressBar value={64} showValue label="Completion" /> — `ariaLabel` names the bar for screen readers without a visible label */
export function ProgressBar({ value = 0, max = 100, tone = 'primary', size = 'sm', label, ariaLabel, showValue, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="text-text-secondary">{label}</span>}
          {showValue && <span className="font-medium tabular-nums text-text">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel || label || 'Progress'}
        className={cn('w-full overflow-hidden rounded-full bg-surface-sunken', heights[size])}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500 ease-out', tones[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

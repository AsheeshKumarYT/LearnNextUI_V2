import { cn } from '@/utils/cn';
import { ProgressBar } from './ProgressBar';

/**
 * Compact metric — lighter than StatCard, good for grids inside a bigger card.
 * <MetricCard label="Completion" value="68%" progress={68} hint="Target 75%" />
 */
export function MetricCard({ label, value, hint, progress, tone = 'primary', icon: Icon, className }) {
  return (
    <div className={cn('rounded-card border border-border bg-surface-secondary/60 p-4', className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        {Icon && <Icon className="size-3.5" aria-hidden="true" />}
        {label}
      </div>
      <p className="mt-1.5 text-xl font-semibold tracking-[-0.01em] tabular-nums text-text">{value}</p>
      {progress != null && <ProgressBar value={progress} tone={tone} size="xs" className="mt-3" />}
      {hint && <p className="mt-2 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/** +12.4% / -3.1% pill. Set `invert` when a decrease is good (e.g. churn). */
export function TrendIndicator({ value, invert, suffix = '%', className }) {
  if (value == null) return null;
  const up = value >= 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums',
        good ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {Math.abs(value).toFixed(1)}
      {suffix}
      <span className="sr-only">{up ? 'increase' : 'decrease'}</span>
    </span>
  );
}

import { CalendarDays } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Shows the period a card's data actually covers.
 * `follows` = the card reacts to the global period filter (tinted chip, label updates);
 * otherwise the period is fixed (neutral chip, e.g. "Next 10 days", "Lifetime", "Current").
 */
export function PeriodChip({ label, follows = false, className }) {
  return (
    <span
      title={follows ? 'Follows the period filter' : 'Fixed period — not affected by the period filter'}
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 text-[11px] font-semibold',
        follows ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-secondary ring-1 ring-inset ring-border-strong',
        className,
      )}
    >
      <CalendarDays className="size-3" aria-hidden="true" />
      <span className="sr-only">Period: </span>
      {label}
    </span>
  );
}

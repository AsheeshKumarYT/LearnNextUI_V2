import { Package, Plane, ReceiptText, Tag, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/utils/cn';

// Each kind of expense gets its own icon and a soft tint (static class names for Tailwind); unknown ones get a tag
const META = {
  'Revenue Invoice': { icon: ReceiptText, tone: 'bg-chart-1/10 text-chart-1' },
  'Flight & Hotel Booking': { icon: Plane, tone: 'bg-chart-2/10 text-chart-2' },
  'Food Expenses': { icon: UtensilsCrossed, tone: 'bg-chart-3/15 text-warning' },
  'Courier Services': { icon: Package, tone: 'bg-chart-4/10 text-chart-4' },
};
const FALLBACK = { icon: Tag, tone: 'bg-surface-sunken text-text-muted' };

/** The expense head's icon in a soft rounded tile (list rows, filter options) */
export function ExpenseHeadIcon({ head, className }) {
  const { icon: Icon, tone } = META[head] ?? FALLBACK;
  return (
    <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl', tone, className)} aria-hidden="true">
      <Icon className="size-[18px]" />
    </span>
  );
}

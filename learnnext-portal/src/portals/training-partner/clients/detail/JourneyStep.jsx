import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

// Marker per status: filled tick when done, pulsing dot while running, hollow ring when still ahead
const DOT = {
  'in-progress': 'bg-primary text-primary-fg ring-primary/20',
  upcoming: 'bg-surface ring-info/30 border-[1.5px] border-info-main/60',
  pending: 'bg-surface ring-warning/20 border-[1.5px] border-warning/50',
  completed: 'bg-success-main text-white ring-success/15',
};

/**
 * One step of a vertical journey (the projects a participant is in): a small status marker on a
 * hairline that runs to the next step. Render inside an <ol>; pass `last` on the final step.
 */
export function JourneyStep({ status, last, className, children }) {
  return (
    <li className={cn('relative pl-8', !last && 'pb-7', className)}>
      {!last && <span className="absolute bottom-0 left-[7.5px] top-6 w-px rounded-full bg-border" aria-hidden="true" />}
      <span className={cn('absolute left-0 top-1 inline-flex size-4 items-center justify-center rounded-full ring-[3px]', DOT[status])} aria-hidden="true">
        {status === 'completed' ? (
          <Check className="size-2.5" strokeWidth={3.5} />
        ) : status === 'in-progress' ? (
          <span className="size-1.5 animate-pulse rounded-full bg-primary-fg motion-reduce:animate-none" />
        ) : null}
      </span>
      {children}
    </li>
  );
}

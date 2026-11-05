import { Globe, Map, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

const PLACE = {
  country: { icon: Globe, tone: 'bg-chart-1/10 text-chart-1' },
  state: { icon: Map, tone: 'bg-chart-4/10 text-chart-4' },
  city: { icon: MapPin, tone: 'bg-success-main/12 text-success' },
};

/** A soft icon tile for a country / state / city row */
export function PlaceIcon({ kind, className }) {
  const { icon: Icon, tone } = PLACE[kind];
  return (
    <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl', tone, className)} aria-hidden="true">
      <Icon className="size-[18px]" />
    </span>
  );
}

/** "NA" for a value that doesn't apply (e.g. GST outside India) — quiet, so real values stand out */
export function NotApplicable() {
  return <span className="text-xs text-text-muted/80">NA</span>;
}

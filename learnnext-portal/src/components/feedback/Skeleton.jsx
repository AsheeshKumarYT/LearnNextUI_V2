import { cn } from '@/utils/cn';

/** Base shimmer block. Size it with className: <Skeleton className="h-4 w-32" /> */
export function Skeleton({ className, circle }) {
  return <div aria-hidden="true" className={cn('animate-shimmer bg-surface-sunken', circle ? 'rounded-full' : 'rounded-md', className)} />;
}

/** Preset: n lines of text */
export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

/** Preset: list rows with avatar */
export function SkeletonList({ rows = 4, className }) {
  return (
    <div className={cn('flex flex-col gap-4', className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton circle className="size-8 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Preset: card grid */
export function SkeletonCards({ count = 4, className }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-card border border-border bg-surface p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-7 w-28" />
          <Skeleton className="mt-3 h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

/** Preset: table body rows */
export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="divide-y divide-border" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-6 px-4 py-3.5 sm:px-5">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} className={cn('h-3.5', c === 0 ? 'w-40 flex-[2]' : 'flex-1')} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Preset: profile header */
export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-4" role="status" aria-label="Loading">
      <Skeleton circle className="size-16" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-56" />
      </div>
    </div>
  );
}

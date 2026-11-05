import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/feedback';

// Per tone: dot + soft halo, a faint left-side wash, a tinted edge and a pressed state (static class names for Tailwind)
const TONES = {
  blue: { dot: 'bg-chart-1 ring-chart-1/15', wash: 'from-chart-1/[0.08]', edge: 'border-chart-1/20', pressed: 'border-chart-1/45 ring-2 ring-chart-1/10' },
  green: { dot: 'bg-success-main ring-success-main/15', wash: 'from-success-main/[0.08]', edge: 'border-success-main/25', pressed: 'border-success-main/50 ring-2 ring-success-main/12' },
  slate: { dot: 'bg-text-muted ring-text-muted/15', wash: 'from-text-muted/[0.08]', edge: 'border-text-muted/25', pressed: 'border-text-secondary/45 ring-2 ring-text-muted/12' },
  violet: { dot: 'bg-chart-4 ring-chart-4/15', wash: 'from-chart-4/[0.07]', edge: 'border-chart-4/20', pressed: 'border-chart-4/45 ring-2 ring-chart-4/10' },
  amber: { dot: 'bg-chart-3 ring-chart-3/20', wash: 'from-chart-3/[0.10]', edge: 'border-chart-3/30', pressed: 'border-chart-3/60 ring-2 ring-chart-3/15' },
  cyan: { dot: 'bg-info ring-info/15', wash: 'from-info/[0.07]', edge: 'border-info/20', pressed: 'border-info/45 ring-2 ring-info/10' },
  red: { dot: 'bg-danger-main ring-danger-main/15', wash: 'from-danger-main/[0.07]', edge: 'border-danger-main/20', pressed: 'border-danger-main/45 ring-2 ring-danger-main/10' },
};

/**
 * Light one-line summary for a list's toolbar: small pills with a coloured dot, number and label.
 * `items` = [{ key, label, value, tone: blue|green|slate|violet|amber|cyan|red, title?, filterable?, attention? }]. Filterable pills are one-click
 * filters: pressed when `value === key` ('all' is the resting state, never highlighted); `onChange(key)` on click.
 * className lets the toolbar change the layout (e.g. one non-wrapping, sideways-scrolling line).
 */
export function StatPills({ items, value, onChange, loading, ariaLabel = 'Summary', className }) {
  if (loading) return <Skeleton className="h-8 w-80 max-w-full rounded-full" />;

  return (
    <div className={cn('flex w-full flex-wrap items-center gap-2 sm:w-auto', className)} role="group" aria-label={ariaLabel}>
      {items.map((t) => {
        const T = TONES[t.tone];
        const pressed = t.filterable && value === t.key;
        const Comp = t.filterable ? 'button' : 'span';
        return (
          <Comp
            key={t.key}
            {...(t.filterable && { type: 'button', onClick: () => onChange(t.key), 'aria-pressed': pressed })}
            title={t.title}
            className={cn(
              'relative isolate inline-flex h-8 shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border bg-surface pl-3 pr-3.5 text-[13px] shadow-xs transition-[border-color,box-shadow] duration-200 dark:bg-surface-secondary',
              t.filterable && 'hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              // "All" is the resting state — no highlight
              pressed && t.key !== 'all' ? T.pressed : T.edge,
            )}
          >
            {/* Faint tone wash from the left, behind the content */}
            <span className={cn('pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r to-transparent to-70%', T.wash)} aria-hidden="true" />
            {/* `attention` (with a count, not pressed): the dot's halo breathes softly, so waiting items catch the eye */}
            <span className={cn('size-2 rounded-full ring-[3px]', T.dot, t.attention && t.value > 0 && !pressed && 'motion-safe:animate-pulse')} aria-hidden="true" />
            <span className="font-semibold tabular-nums text-text">{t.value}</span>
            <span className="text-text-secondary">{t.label}</span>
          </Comp>
        );
      })}
    </div>
  );
}

/** The client list's summary: All clients / Active / Inactive (status filters) and New this month */
export function ClientStats({ clients = [], stats, status, onStatusChange, loading, className }) {
  const addedThisYear = useMemo(() => {
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    return clients.filter((c) => new Date(c.createdAt) >= yearAgo).length;
  }, [clients]);

  return (
    <StatPills
      ariaLabel="Client summary"
      loading={loading}
      value={status}
      onChange={onStatusChange}
      className={className}
      items={[
        { key: 'all', label: 'All clients', value: stats.total, title: `Show all clients (+${addedThisYear} this year)`, tone: 'blue', filterable: true },
        { key: 'active', label: 'Active', value: stats.active, title: 'Show active clients', tone: 'green', filterable: true },
        { key: 'inactive', label: 'Inactive', value: stats.inactive, title: 'Show inactive clients', tone: 'slate', filterable: true },
        { key: 'new', label: 'New this month', value: stats.recent, tone: 'violet' },
      ]}
    />
  );
}

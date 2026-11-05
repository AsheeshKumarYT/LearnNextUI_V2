import { cn } from '@/utils/cn';
import { Card } from './Card';
import { Sparkline } from './Sparkline';
import { TrendIndicator } from './TrendIndicator';
import { Skeleton } from '@/components/feedback/Skeleton';

// Pastel tinted variants (static class names so Tailwind can see them). Colors come from the chart / status tokens.
const tints = {
  blue: { card: 'bg-gradient-to-br from-chart-1/10 to-chart-1/25', icon: 'text-chart-1', blob: 'bg-chart-1/15' },
  green: { card: 'bg-gradient-to-br from-success-main/10 to-success-main/25', icon: 'text-success-main', blob: 'bg-success-main/15' },
  cyan: { card: 'bg-gradient-to-br from-chart-2/10 to-chart-2/25', icon: 'text-chart-2', blob: 'bg-chart-2/15' },
  yellow: { card: 'bg-gradient-to-br from-chart-3/10 to-chart-3/25', icon: 'text-chart-3', blob: 'bg-chart-3/15' },
  purple: { card: 'bg-gradient-to-br from-chart-4/10 to-chart-4/25', icon: 'text-chart-4', blob: 'bg-chart-4/15' },
  red: { card: 'bg-gradient-to-br from-chart-5/10 to-chart-5/25', icon: 'text-chart-5', blob: 'bg-chart-5/15' },
};

/**
 * KPI card: label, big value, trend vs. previous period, optional sparkline.
 * <StatCard label="Active learners" value="3,404" change={12.4} icon={Users} trend={[…]} />
 * `tone` (blue | green | cyan | yellow | purple | red) renders the pastel tinted variant.
 * `caption` adds a muted line under the value (e.g. "2 ongoing") when there's no trend to show.
 * `chip` renders a small element at the right of the label row (tinted variant), e.g. a period chip.
 * `footer` renders below the caption (tinted variant), e.g. a progress bar or a link hint.
 */
export function StatCard({ label, value, change, changeLabel = 'vs last month', caption, icon: Icon, tone, trend, invertTrend, chip, footer, loading, accent, className }) {
  const tint = tints[tone];
  if (loading) {
    return (
      <Card className={className}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-28" />
        <Skeleton className="mt-3 h-4 w-32" />
      </Card>
    );
  }

  if (tint) {
    // Light: same outline + shadow as other cards, without the white hairline that shows over the tint.
    // Dark keeps the flat jewel look.
    return (
      <Card className={cn('@container relative overflow-hidden border-transparent p-4 sm:p-5 dark:border-glass-border dark:shadow-none dark:ring-0', tint.card, className)}>
        {/* Soft decorative circles in the corner (behind the content) */}
        <span className={cn('pointer-events-none absolute -right-7 -top-7 size-20 rounded-full', tint.blob)} aria-hidden="true" />
        <span className={cn('pointer-events-none absolute -right-1 top-9 size-10 rounded-full', tint.blob)} aria-hidden="true" />
        {/* Compact: icon sits inline with the label. An optional chip sits beside it when the card is wide enough,
            otherwise on its own line — same rule for every card in a row, so they stay consistent. */}
        <div className="relative flex flex-col items-start gap-1.5 @[14rem]:flex-row @[14rem]:items-center @[14rem]:justify-between @[14rem]:gap-2">
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-text-secondary">
            {Icon && <Icon className={cn('size-5 shrink-0', tint.icon)} strokeWidth={1.9} aria-hidden="true" />}
            <span className="truncate">{label}</span>
          </p>
          {chip}
        </div>
        <p className="relative mt-2 truncate text-[26px] font-bold leading-8 tabular-nums text-text">{value}</p>
        {change != null && (
          <p className="relative mt-1 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
            <TrendIndicator value={change} invert={invertTrend} />
            {changeLabel}
          </p>
        )}
        {caption && <p className="relative mt-1 truncate text-xs text-text-secondary">{caption}</p>}
        {footer && <div className="relative mt-2">{footer}</div>}
      </Card>
    );
  }

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {accent && <span className="absolute inset-x-0 top-0 h-0.5 bg-primary" aria-hidden="true" />}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-text">{label}</p>
        {Icon && (
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[30px] font-bold leading-10 tabular-nums text-text">{value}</p>
          {change != null && (
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px] text-text-secondary">
              <TrendIndicator value={change} invert={invertTrend} />
              {changeLabel}
            </p>
          )}
          {caption && <p className="mt-1.5 truncate text-[13px] text-text-secondary">{caption}</p>}
        </div>
        {trend && <Sparkline data={trend} tone={(change ?? 0) >= 0 !== Boolean(invertTrend) ? 'primary' : 'danger'} className="mb-1 shrink-0" />}
      </div>
    </Card>
  );
}

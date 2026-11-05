import { ChartPie } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, StatusBadge } from '@/components/ui';
import { CHART_COLORS, DonutChart } from '@/components/charts';
import { formatCurrency, formatRupeesCompact } from '@/utils/formatNumber';
import { percent } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

/**
 * Billing composition (donut: share of invoiced amount per entity — parts of a whole)
 * + collection status pinned to the bottom (invoiced vs collected vs outstanding).
 */
export function EntitySplit({ billing, periodLabel, className }) {
  const { entities, invoiced, received } = billing;
  const total = entities.reduce((s, e) => s + e.value, 0);
  const rows = [...entities].sort((a, b) => b.value - a.value).map((e, i) => ({ ...e, color: CHART_COLORS[i % CHART_COLORS.length] }));
  const due = invoiced - received;
  const collected = percent(received, invoiced);
  const tone = collected >= 60 ? 'success' : collected >= 25 ? 'warning' : 'danger';

  const stats = [
    { key: 'collected', label: 'Collected', value: received, dot: 'bg-success-main' },
    { key: 'due', label: 'Outstanding', value: due, dot: 'bg-danger-main' },
  ];

  return (
    // overflow-hidden + @container: the legend can never leak out, and it stacks under the donut when the card is narrow
    <Card tint="info" softTint className={cn('@container flex min-w-0 flex-col overflow-hidden', className)}>
      <CardHeader
        icon={ChartPie}
        iconTone="info"
        title="Billing by entity"
        badge={<PeriodChip label={periodLabel} follows />}
        description="Share of invoiced amount"
      />
      <div className="flex min-w-0 flex-col items-center gap-6 @md:flex-row">
        <div className="size-44 shrink-0">
          <DonutChart data={rows} valueFormatter={(v) => formatCurrency(v, 'INR')} centerValue={formatRupeesCompact(total)} centerLabel="invoiced" />
        </div>
        {/* Contained grid: [dot] [label — truncates] [amount] [%] */}
        <ul className="grid grid-cols-1 w-full min-w-0 flex-1 gap-3">
          {rows.map((e) => (
            <li
              key={e.code}
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto_2.75rem] items-center gap-x-2.5 text-[13px]"
              title={`${e.name} (${e.code}): ${formatCurrency(e.value, 'INR')}`}
            >
              <span className="size-2.5 rounded-[3px]" style={{ background: e.color }} aria-hidden="true" />
              <span className="min-w-0 truncate text-text-secondary">
                {e.name} <span className="text-text-muted">({e.code})</span>
              </span>
              <span className="text-right font-semibold tabular-nums text-text">{formatRupeesCompact(e.value)}</span>
              <span className="text-right text-xs tabular-nums text-text-muted">{percent(e.value, total)}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collection meter — pinned to the bottom so the card always fills its row */}
      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-border-strong bg-surface-sunken p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-text">Collection status</p>
            <StatusBadge tone={tone} label={`${collected}% collected`} />
          </div>

          {/* The whole invoiced amount as one bar: collected (green) + outstanding (red) */}
          <div
            className="mt-3 flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-surface-sunken"
            role="img"
            aria-label={`Collected ${formatRupeesCompact(received)}, outstanding ${formatRupeesCompact(due)}`}
          >
            {received > 0 && (
              <span className="h-full basis-0 origin-left animate-grow-x rounded-full bg-success-main" style={{ flexGrow: received }} />
            )}
            {due > 0 && (
              <span className="h-full basis-0 origin-left animate-grow-x rounded-full bg-danger-main" style={{ flexGrow: due, animationDelay: '150ms' }} />
            )}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.key} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className={cn('size-2 rounded-full', s.dot)} aria-hidden="true" />
                  {s.label}
                </dt>
                <dd className="mt-0.5 truncate text-[15px] font-bold tabular-nums text-text" title={formatCurrency(s.value, 'INR')}>
                  {formatRupeesCompact(s.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  );
}

import { Building2, PieChart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, CardHeader } from '@/components/ui';
import { formatCurrency, formatRupeesCompact } from '@/utils/formatNumber';
import { percent } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

/** Ranked clients with full names and bars relative to the leader, plus a concentration summary at the bottom. */
export function TopClients({ clients, className }) {
  const max = clients[0]?.value || 1;
  const total = clients.reduce((s, c) => s + c.value, 0);
  const leaderShare = percent(clients[0]?.value ?? 0, total);

  return (
    <Card tint="primary" softTint className={cn('flex flex-col', className)}>
      <CardHeader icon={Building2} title="Top clients" badge={<PeriodChip label="Lifetime" />} description="By total billing" />
      {/* grid-cols-1 (minmax 0) + min-w-0: long names truncate instead of pushing the amounts past the card edge on phones */}
      <ol className="grid grid-cols-1 gap-4">
        {clients.map((c, i) => (
          <li key={c.name} title={formatCurrency(c.value, 'INR')} className="min-w-0">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span
                className={cn(
                  'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums',
                  i === 0 ? 'bg-gradient-to-br from-primary to-chart-2 text-white' : 'bg-surface-sunken text-text-secondary',
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-text">{c.name}</span>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-text">{formatRupeesCompact(c.value)}</span>
            </div>
            <div className="ml-9 mt-1.5 h-2 overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full origin-left animate-grow-x rounded-full bg-gradient-to-r from-primary to-chart-2"
                style={{ width: `${(c.value / max) * 100}%`, opacity: 1 - i * 0.14, animationDelay: `${250 + i * 90}ms` }}
              />
            </div>
          </li>
        ))}
      </ol>

      {/* Concentration summary — pinned to the bottom so the card fills its row without stretching the list */}
      {clients.length > 0 && (
        <div className="mt-auto pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-text">
              <PieChart className="size-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-text" title={formatCurrency(total, 'INR')}>
                {formatRupeesCompact(total)} from top {clients.length} clients
              </p>
              <p className="truncate text-xs text-text-muted">
                {clients[0].name.replace(/\s+(Ltd|Limited|Pvt Ltd)$/i, '')} alone is {leaderShare}% of it
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

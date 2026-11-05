import { useState } from 'react';
import { ChartBar, Crown, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, SegmentedControl } from '@/components/ui';
import { percent } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

const KINDS = [
  { value: 'brand', label: 'Brands' },
  { value: 'program', label: 'Programs' },
];
// "used" drops on phones so both toggles fit on one row
const ORDERS = [
  // One span per label: the tab lays its children out with a gap, so a loose "Most" + "used" got extra space between them
  { value: 'most', label: <span>Most<span className="hidden sm:inline">&nbsp;used</span></span> },
  { value: 'least', label: <span>Least<span className="hidden sm:inline">&nbsp;used</span></span> },
];

// Toggle fills its grid cell on phones (equal-width options), natural width from sm up
const FULL_ON_PHONE = 'flex w-full [&>button]:flex-1 [&>button]:px-2 sm:inline-flex sm:w-auto sm:[&>button]:flex-none sm:[&>button]:px-3';

// Rank-ordered shades: strongest colour = rank 1 (cool blues for "most", warm ambers for "least")
const SHADES = {
  most: [100, 72, 50, 34, 22].map((p) => `color-mix(in srgb, var(--ln-primary) ${p}%, var(--ln-surface))`),
  least: [100, 72, 50, 34, 22].map((p) => `color-mix(in srgb, var(--ln-warning-main) ${p}%, var(--ln-surface))`),
};

/**
 * Usage as one story: a single share bar split by rank and a calm ranked list (the #1 item highlighted)
 * — instead of five separate bars.
 */
export function UsageRanking({ usage, periodLabel, className }) {
  const [kind, setKind] = useState('brand');
  const [order, setOrder] = useState('most');

  const all = usage[kind] ?? [];
  const total = all.reduce((s, r) => s + r.value, 0);
  const rows = [...all]
    .sort((a, b) => (order === 'most' ? b.value - a.value : a.value - b.value))
    .slice(0, 5)
    .map((r, i) => ({ ...r, color: SHADES[order][i] }));
  const lead = rows[0];
  const LeadIcon = order === 'most' ? Crown : TrendingDown;

  return (
    <Card tint="info" softTint padding="none" className={cn('flex flex-col', className)}>
      <CardHeader
        divided
        icon={ChartBar}
        iconTone="info"
        title="Usage ranking"
        badge={<PeriodChip label={periodLabel} follows />}
        description="Times used in programs"
        // Two toggle groups need their own row; beside the title they squeeze it onto several lines
        className="flex-col items-stretch"
        action={
          // Phones: two equal halves on one row; from sm up: natural widths side by side
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <SegmentedControl size="sm" tabs={KINDS} value={kind} onChange={setKind} ariaLabel="Rank by" className={FULL_ON_PHONE} />
            <SegmentedControl size="sm" tabs={ORDERS} value={order} onChange={setOrder} ariaLabel="Sort order" className={FULL_ON_PHONE} />
          </div>
        }
      />

      {lead && (
        <div key={`${kind}-${order}`} className="flex flex-1 animate-fade-in flex-col px-5 pb-6 pt-3 sm:px-6">
          {/* One-line summary above the share bar (the #1 item is highlighted in the list, not repeated here) */}
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text tabular-nums">{total}</span> uses in total · top 5 shown
          </p>

          {/* One share bar, split by rank */}
          <div
            className="mt-2.5 flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-surface-sunken"
            role="img"
            aria-label={rows.map((r) => `${r.name} ${r.value}`).join(', ')}
          >
            {rows.map((r, i) => (
              <span
                key={r.name}
                title={`${r.name}: ${r.value} uses`}
                className="h-full basis-0 origin-left animate-grow-x rounded-full"
                style={{ flexGrow: r.value, background: r.color, animationDelay: `${120 + i * 90}ms` }}
              />
            ))}
          </div>

          {/* Compact legend */}
          {/* Fills the remaining height (card stretches to its row) so there's no empty band at the bottom */}
          {/* #1 gets a soft highlighted row with a crown (or falling-trend icon for "least used") */}
          <ol className="mt-6 flex flex-1 flex-col justify-between gap-3">
            {rows.map((r, i) => (
              <li
                key={r.name}
                className={cn(
                  'flex items-center gap-3 text-[13px]',
                  i === 0 && cn('-mx-2.5 rounded-lg px-2.5 py-2', order === 'most' ? 'bg-primary-soft/70' : 'bg-warning-soft/70'),
                )}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-text-secondary" title={r.name}>
                  {i === 0 && (
                    <LeadIcon
                      className={cn('mr-1.5 inline size-3.5 -translate-y-px', order === 'most' ? 'text-primary-text' : 'text-warning')}
                      aria-label={order === 'most' ? 'Most used' : 'Least used'}
                    />
                  )}
                  <span className={cn(i === 0 && 'font-semibold text-text')}>{r.name}</span>
                </span>
                {/* Share % hidden on phones so names get the room (the bar above still shows the split) */}
                <span className="hidden w-9 shrink-0 text-right text-xs tabular-nums text-text-muted sm:inline">{percent(r.value, total)}%</span>
                <span className="w-7 shrink-0 text-right font-semibold tabular-nums text-text">{r.value}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}

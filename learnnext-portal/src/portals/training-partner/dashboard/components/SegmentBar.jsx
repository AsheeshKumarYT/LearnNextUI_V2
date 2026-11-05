import { cn } from '@/utils/cn';
import { percent } from './dashboardTheme';

/**
 * Stacked horizontal bar + legend — shows how a whole splits into parts.
 * <SegmentBar segments={[{ key, label, value, color }]} formatValue={fmt} />
 */
export function SegmentBar({ segments, formatValue = (v) => v, size = 'md', legend = true, className }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div className={className}>
      <div
        className={cn('flex w-full gap-1 overflow-hidden rounded-full bg-surface-sunken', size === 'lg' ? 'h-3' : 'h-2')}
        role="img"
        aria-label={segments.map((s) => `${s.label} ${formatValue(s.value)}`).join(', ')}
      >
        {segments
          .filter((s) => s.value > 0)
          .map((s, i) => (
            <span
              key={s.key}
              title={`${s.label}: ${formatValue(s.value)}`}
              className="h-full basis-0 origin-left animate-grow-x rounded-full transition-[flex-grow] duration-700 ease-out"
              style={{ flexGrow: s.value, background: s.color, animationDelay: `${250 + i * 120}ms` }}
            />
          ))}
      </div>
      {legend && (
        <ul className="mt-4 grid grid-cols-1 gap-2.5">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center gap-2.5 text-[13px]">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-text-secondary">{s.label}</span>
              <span className="font-semibold tabular-nums text-text">{formatValue(s.value)}</span>
              <span className="w-10 text-right text-xs tabular-nums text-text-muted">{percent(s.value, total)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

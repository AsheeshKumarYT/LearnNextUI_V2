import { cn } from '@/utils/cn';
import { colorAt } from './chartTheme';

/** Standalone legend (rendered outside the SVG for better wrapping). series: [{ key, label, color }] */
export function ChartLegend({ series = [], className }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {series.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="size-2.5 rounded-[3px]" style={{ background: colorAt(i, s) }} aria-hidden="true" />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

import { cn } from '@/utils/cn';

// Icon tile tones per section (static class names for Tailwind)
const TILE = {
  green: 'bg-success-main/12 text-success',
  blue: 'bg-chart-1/10 text-chart-1',
  violet: 'bg-chart-4/10 text-chart-4',
  amber: 'bg-chart-3/15 text-warning',
};

// Soft top-corner wash per section (kept light — a filters drawer stacks several of them)
const WASH = {
  green: 'from-success-main/[0.09]',
  blue: 'from-chart-1/[0.095]',
  violet: 'from-chart-4/[0.075]',
  amber: 'from-chart-3/[0.07]', // amber reads stronger than the others at the same opacity
};

/** One filter group in a filters drawer, as a small card: coloured icon tile + title, optional "Clear" when it has a value */
export function FilterSection({ icon: Icon, tone, title, onClear, children }) {
  return (
    <section className="relative isolate flex flex-col gap-3.5 rounded-xl border border-border-strong bg-surface p-4 shadow-xs focus-within:z-20 dark:bg-surface-secondary">
      <span className={cn('pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br via-transparent via-45% to-transparent', WASH[tone])} aria-hidden="true" />
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2.5 text-[13px] font-semibold text-text">
          <span className={cn('inline-flex size-7 items-center justify-center rounded-lg', TILE[tone])}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          {title}
        </h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="rounded px-1 text-xs font-semibold text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

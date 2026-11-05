import { cn } from '@/utils/cn';
import { Card } from '@/components/ui';
import { TabHeader } from '@/shared/clients/detail/TabHeader';

// Icon tile tones (static class names for Tailwind)
const TILE = {
  primary: 'bg-chart-1/10 text-chart-1',
  success: 'bg-success-main/12 text-success',
  warning: 'bg-chart-3/15 text-warning',
  info: 'bg-chart-2/12 text-info',
  violet: 'bg-chart-4/10 text-chart-4',
};

/**
 * A list tab that has no data yet (Invoices, SPOCs, Tax & Billing).
 * Shows the list's columns over a few faded "ghost" rows, with a calm message on top — so the page reads as
 * "this is where X will live" rather than a blank box. Replace with the real table when the list is ready.
 */
export function ListPlaceholder({ icon: Icon, tone = 'primary', title, description, columns, emptyTitle, emptyText }) {
  return (
    <Card tint={tone} subtleTint padding="none">
      <TabHeader icon={Icon} tone={tone} title={title} description={description} hideTitleOnMobile />

      {/* Phones: just the icon + message (no ghost table — its columns get cut off and it reads as a box in a box) */}
      <div className="relative mx-5 mb-5 overflow-hidden rounded-xl border border-border-strong max-sm:m-0 max-sm:border-0 sm:mx-6 sm:mb-6">
        {/* Column headings */}
        <div className="grid gap-4 border-b border-border-strong bg-surface-sunken/60 px-4 py-2.5 max-sm:hidden" style={{ gridTemplateColumns: `1.6fr repeat(${columns.length - 1}, 1fr)` }}>
          {columns.map((c) => (
            <span key={c} className="truncate text-xs font-semibold text-text-secondary">
              {c}
            </span>
          ))}
        </div>
        {/* Ghost rows — cleared around the centre (where the message sits) and faded towards the edges */}
        <div className="[mask-image:radial-gradient(ellipse_62%_75%_at_50%_55%,transparent_40%,black_85%)] max-sm:hidden" aria-hidden="true">
          {[0.9, 0.7, 0.8, 0.6].map((w, r) => (
            <div key={r} className="grid items-center gap-4 border-b border-border px-4 py-3.5 last:border-0" style={{ gridTemplateColumns: `1.6fr repeat(${columns.length - 1}, 1fr)` }}>
              {columns.map((c, i) => (
                <span key={c} className="flex items-center gap-2.5">
                  {i === 0 && <span className="size-7 shrink-0 rounded-lg bg-text-muted/[0.08]" />}
                  <span className="h-2.5 rounded-full bg-text-muted/[0.08]" style={{ width: `${Math.round((i === 0 ? w : 0.45 + ((r + i) % 3) * 0.15) * 100)}%` }} />
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col items-center justify-center px-6 text-center max-sm:static max-sm:py-12">
          <span className={cn('inline-flex size-12 items-center justify-center rounded-2xl shadow-xs ring-1 ring-inset ring-border-strong', TILE[tone])}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-semibold text-text">{emptyTitle}</p>
          <p className="mt-1 max-w-sm text-[13px] text-text-secondary">{emptyText}</p>
        </div>
      </div>
    </Card>
  );
}

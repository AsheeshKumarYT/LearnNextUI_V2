import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';

/**
 * Title row for cards: <CardHeader title="Recent activity" description="…" action={<Button/>} />
 * Set `divided` when used inside a Card with padding="none".
 * `actionClassName` styles the action wrapper (e.g. full width when the header stacks on phones).
 * `iconTone` colours the icon tile: primary (default) | success | warning | danger | info | violet.
 * `badge` renders a small element at the right end of the title row (e.g. a period chip). */

// Soft gradient icon tile per tone (static class names for Tailwind; amber kept a step lower — it reads stronger)
const TILE = {
  primary: 'from-chart-1/15 to-chart-1/5 text-chart-1 ring-chart-1/15',
  info: 'from-chart-2/15 to-chart-2/5 text-chart-2 ring-chart-2/15',
  success: 'from-success-main/15 to-success-main/5 text-success ring-success-main/15',
  warning: 'from-chart-3/[0.12] to-chart-3/[0.04] text-warning ring-chart-3/15',
  danger: 'from-danger/12 to-danger/[0.04] text-danger ring-danger/15',
  violet: 'from-chart-4/15 to-chart-4/5 text-chart-4 ring-chart-4/15',
};

/** The header's icon tile on its own (44px, soft gradient) — for custom headers that should match */
export function IconTile({ icon: Icon, tone = 'primary', className }) {
  return (
    <span className={cn('inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-inset', TILE[tone] ?? TILE.primary, className)}>
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

export function CardHeader({ title, description, icon, iconTone = 'primary', badge, action, actionClassName, divided, className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        divided ? 'px-5 pb-4 pt-5 sm:px-6 sm:pt-6' : 'mb-5',
        className,
      )}
    >
      {/* Title block on the left, optional badge pinned to the right end of the same row */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          {icon && <IconTile icon={icon} tone={iconTone} />}
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-6 text-text">{title}</h3>
            {description && <p className="mt-0.5 text-[13px] text-text-secondary">{phoneShort(description)}</p>}
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      {action && <div className={cn('flex max-w-full shrink-0 items-center gap-2', actionClassName)}>{action}</div>}
    </div>
  );
}

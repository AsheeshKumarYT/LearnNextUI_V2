import { cn } from '@/utils/cn';

/**
 * Surface container. Use selectively — not every section needs a card.
 * padding: none | sm | md | lg     interactive: adds hover elevation
 */
const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-7' };

/**
 * tint: a soft colour wash from the top-left corner (same feel as the dashboard KPI cards) — match it to the
 * card's header icon tone: primary | info | success | warning | danger | violet. Static class names so Tailwind sees them.
 * Add `softTint` for a slightly lighter wash (~70%), or `subtleTint` for a much lighter one (~half).
 */
const tints = {
  primary: 'from-chart-1/[0.11]',
  info: 'from-chart-2/[0.07]',
  success: 'from-success-main/[0.11]',
  warning: 'from-chart-3/[0.08]',
  danger: 'from-danger-main/[0.09]',
  violet: 'from-chart-4/[0.075]',
};
// `subtleTint`: about half the strength, for pages with many tinted cards stacked together (e.g. long forms)
const subtleTints = {
  primary: 'from-chart-1/[0.06]',
  info: 'from-chart-2/[0.04]',
  success: 'from-success-main/[0.06]',
  warning: 'from-chart-3/[0.045]',
  danger: 'from-danger-main/[0.05]',
  violet: 'from-chart-4/[0.04]',
};

// `faintTint`: lighter still (~60% of subtle) — for the tones that read strongest when many cards stack (e.g. Verify KYC)
const faintTints = {
  primary: 'from-chart-1/[0.035]',
  info: 'from-chart-2/[0.025]',
  success: 'from-success-main/[0.035]',
  warning: 'from-chart-3/[0.026]',
  danger: 'from-danger-main/[0.03]',
  violet: 'from-chart-4/[0.025]',
};

// `softTint`: ~30% lighter than the default (e.g. the dashboard, where many tinted cards sit side by side)
const softTints = {
  primary: 'from-chart-1/[0.08]',
  info: 'from-chart-2/[0.05]',
  success: 'from-success-main/[0.08]',
  warning: 'from-chart-3/[0.055]',
  danger: 'from-danger-main/[0.065]',
  violet: 'from-chart-4/[0.05]',
};

/**
 * `tintColor` (any CSS colour, e.g. a logo's main colour from useLogoColor) replaces the tint's hue with the same wash
 * shape at the default strength; `tint` stays the fallback while it's unknown (null).
 */
/** `flatOnMobile`: on phones the card drops its frame (border, shadow, glass, tint) and sits straight on the page */
export function Card({ as: Comp = 'div', padding = 'md', interactive, tint, tintColor, softTint, subtleTint, faintTint, flatOnMobile, className, children, ...props }) {
  return (
    <Comp
      className={cn(
        // Frosted glass card: translucent + blurred background, bright hairline edge, soft shadow with top highlight
        'ln-card rounded-card glass border border-glass-border shadow-card',
        flatOnMobile && 'ln-flat-mobile',
        // isolate: the tint sits above the card surface but below its content, without touching the children
        tint && 'relative isolate',
        interactive && 'transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-raised',
        paddings[padding],
        className,
      )}
      {...props}
    >
      {tint && (
        <span
          className={cn('ln-card-tint pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br via-transparent via-40% to-transparent', (faintTint ? faintTints : subtleTint ? subtleTints : softTint ? softTints : tints)[tint])}
          style={tintColor ? { backgroundImage: `linear-gradient(to bottom right, color-mix(in srgb, ${tintColor} ${subtleTint ? 6 : softTint ? 8 : 10}%, transparent), transparent 40%)` } : undefined}
          aria-hidden="true"
        />
      )}
      {children}
    </Comp>
  );
}

/** Optional divided footer area inside a Card with padding="none" */
export function CardFooter({ className, children }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-end gap-2 border-t border-dashed border-border-strong px-5 py-3 sm:px-6', className)}>
      {children}
    </div>
  );
}

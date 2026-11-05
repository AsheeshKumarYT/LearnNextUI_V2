import { cn } from '@/utils/cn';

/**
 * Small label. tone: neutral | primary | success | warning | danger | info
 * variant: soft (default) | outline | solid. Optional `dot` and `icon`.
 */
const tones = {
  // Grey tint (not the sunken surface) so neutral badges stay visible on white/glass rows, like the coloured ones
  neutral: { soft: 'bg-text-muted/12 text-text-secondary', outline: 'border-border text-text-secondary', solid: 'bg-text text-surface', dot: 'bg-text-muted' },
  primary: { soft: 'bg-primary-soft text-primary-text', outline: 'border-primary/40 text-primary-text', solid: 'bg-primary text-primary-fg', dot: 'bg-primary' },
  success: { soft: 'bg-success-soft text-success', outline: 'border-success/40 text-success', solid: 'bg-success text-white', dot: 'bg-success' },
  warning: { soft: 'bg-warning-soft text-warning', outline: 'border-warning/40 text-warning', solid: 'bg-warning text-white', dot: 'bg-warning' },
  danger: { soft: 'bg-danger-soft text-danger', outline: 'border-danger/40 text-danger', solid: 'bg-danger text-white', dot: 'bg-danger' },
  info: { soft: 'bg-info-soft text-info', outline: 'border-info/40 text-info', solid: 'bg-info text-white', dot: 'bg-info' },
};

export function Badge({ tone = 'neutral', variant = 'soft', dot, icon: Icon, size = 'sm', className, children }) {
  const t = tones[tone] ?? tones.neutral;
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-md font-bold',
        size === 'sm' ? 'h-6 px-1.5 text-xs' : 'h-7 px-2 text-[13px]',
        variant === 'outline' ? cn('border', t.outline) : t[variant],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 shrink-0 rounded-full', t.dot)} aria-hidden="true" />}
      {Icon && <Icon className="size-3 shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

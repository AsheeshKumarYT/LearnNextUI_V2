import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

/**
 * Button — the only button primitive in the app.
 *
 * variant: primary | secondary | outline | ghost | destructive | success | link
 * size:    xs | sm | md | lg
 * Pass `as={Link} to="/x"` to render a router link with button styling.
 * Pass `leftIcon` / `rightIcon` as Lucide components (e.g. leftIcon={Plus}).
 */
export const buttonVariants = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover hover:shadow-[0_8px_16px_0_var(--ln-primary-shadow)] active:bg-primary-active',
  secondary:
    'bg-surface text-text border border-border-strong hover:bg-surface-sunken',
  outline: 'border border-primary/40 text-primary-text bg-transparent hover:bg-primary-soft hover:border-primary/60',
  ghost: 'text-text-secondary hover:text-text hover:bg-surface-sunken',
  destructive:
    'bg-danger text-white shadow-xs shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-danger-hover',
  success: 'bg-success text-white shadow-xs hover:brightness-110',
  soft: 'bg-primary-soft text-primary-text hover:bg-primary-soft-hover',
  link: 'text-primary-text underline-offset-4 hover:underline px-0 h-auto',
};

export const buttonSizes = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 [&_svg]:size-3.5',
  sm: 'h-8 px-3 text-[13px] gap-1.5 [&_svg]:size-4',
  md: 'h-10 sm:h-9 px-3.5 text-sm gap-2 [&_svg]:size-4',
  lg: 'h-11 px-5 text-sm gap-2 [&_svg]:size-[18px]',
};

export function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth,
  className,
  children,
  type,
  ...props
}) {
  const isButton = Comp === 'button';
  return (
    <Comp
      type={isButton ? type || 'button' : undefined}
      disabled={isButton ? disabled || loading : undefined}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-control font-bold',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        buttonVariants[variant],
        variant !== 'link' && buttonSizes[size],
        variant === 'link' && 'text-sm',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {/* Icons never shrink — in a tight row (e.g. drawer footers on phones) they used to get squashed to a dot */}
      {loading ? <Spinner size="sm" /> : LeftIcon && <LeftIcon aria-hidden="true" className="shrink-0" />}
      {children}
      {!loading && RightIcon && <RightIcon aria-hidden="true" className="shrink-0" />}
    </Comp>
  );
}

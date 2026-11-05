import { cn } from '@/utils/cn';
import { buttonVariants } from './Button';
import { Spinner } from './Spinner';
import { Tooltip } from './Tooltip';

const sizes = {
  xs: 'size-7 [&_svg]:size-3.5',
  sm: 'size-8 [&_svg]:size-4',
  md: 'size-10 sm:size-9 [&_svg]:size-[18px]',
  lg: 'size-11 [&_svg]:size-5',
};

/**
 * Square icon-only button. `label` is required: it becomes the aria-label
 * and (unless tooltip={false}) a hover tooltip.
 */
export function IconButton({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  loading,
  tooltip = true,
  tooltipSide = 'bottom',
  className,
  children,
  ...props
}) {
  const btn = (
    <button
      type="button"
      aria-label={label}
      disabled={props.disabled || loading}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-control transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  );
  return tooltip ? (
    <Tooltip content={label} side={tooltipSide}>
      {btn}
    </Tooltip>
  ) : (
    btn
  );
}

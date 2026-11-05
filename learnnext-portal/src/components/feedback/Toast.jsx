import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

// Per variant: icon, its soft tile, and the colour of the time line
const variants = {
  default: { icon: Bell, tile: 'bg-surface-sunken text-text-secondary dark:bg-surface-secondary', line: 'bg-text-muted/50' },
  success: { icon: CheckCircle2, tile: 'bg-success-soft text-success', line: 'bg-success-main/70' },
  error: { icon: XCircle, tile: 'bg-danger-soft text-danger', line: 'bg-danger-main/70' },
  warning: { icon: AlertTriangle, tile: 'bg-warning-soft text-warning', line: 'bg-warning-main/70' },
  info: { icon: Info, tile: 'bg-info-soft text-info', line: 'bg-info-main/70' },
};

/**
 * Single toast (picked from previews: "Pop + timer line"). Rendered by ToastContainer — use the useToast() hook to
 * show one. It rises in with a soft bounce, its icon tile pops in, and a thin line in its colour drains along the
 * bottom for as long as it stays. Hovering pauses the timer and the line; leaving carries on. Phones and desktop alike.
 */
export function Toast({ toast, onDismiss, onPause, onResume }) {
  const v = variants[toast.variant] ?? variants.default;
  const Icon = v.icon;
  const [held, setHeld] = useState(false);
  const timed = toast.duration > 0;
  const hold = () => {
    setHeld(true);
    onPause?.(toast.id);
  };
  const release = () => {
    setHeld(false);
    onResume?.(toast.id);
  };

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={release}
      className={cn(
        'pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-border bg-elevated py-3 pl-3 pr-2.5 shadow-pop',
        'transition-[opacity,transform] duration-[260ms] ease-in',
        // Phones: drops down from the top and lifts away; larger screens: rises from the bottom and slides off right
        toast.leaving
          ? '-translate-y-3 scale-95 opacity-0 sm:translate-x-6 sm:translate-y-0'
          : 'motion-safe:animate-toast-drop sm:motion-safe:animate-toast-in',
      )}
    >
      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-xl motion-safe:animate-toast-pop', v.tile)}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-5 text-text">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-[13px] leading-5 text-text-secondary">{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action.onClick?.();
              onDismiss(toast.id);
            }}
            className="mt-1.5 text-[13px] font-semibold text-primary-text hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="inline-flex size-7 shrink-0 items-center justify-center self-start rounded-lg text-text-muted transition-colors hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <X className="size-4" />
      </button>
      {/* Time line: drains along the bottom for the toast's duration; pauses while hovered */}
      {timed && (
        <span
          className={cn('pointer-events-none absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full', v.line)}
          style={{ animation: `ln-toast-drain ${toast.duration}ms linear forwards`, animationPlayState: held ? 'paused' : 'running' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

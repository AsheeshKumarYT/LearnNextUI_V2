import { createPortal } from 'react-dom';
import { phoneShort } from '@/utils/phoneCopy';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePresence } from '@/hooks/usePresence';
import { useOverlay } from '@/hooks/useOverlay';
import { useKeyboardViewport } from '@/hooks/useKeyboardViewport';
import { IconTile } from './CardHeader';

/**
 * Internal base for Modal / Drawer / Sheet: portal, backdrop, focus trap,
 * ESC + backdrop close, scroll lock and enter/exit animation.
 * Prefer the specific components over using this directly.
 */
export function Overlay({
  open,
  onClose,
  closeOnBackdrop = true,
  closeOnEsc = true,
  containerClassName,
  panelClassName,
  enterClassName,
  exitClassName,
  labelledBy,
  describedBy,
  role = 'dialog',
  children,
}) {
  const { mounted, closing } = usePresence(open, 180);
  const panelRef = useOverlay(open, onClose, { closeOnEsc });
  // Phones: with the keyboard up, fit the layer to the visible screen so bottom sheets, drawer footers and form fields
  // aren't hidden behind it
  const keyboardBox = useKeyboardViewport(mounted);
  if (!mounted) return null;

  return createPortal(
    <div className={cn('fixed inset-0 z-[80] flex', containerClassName)} style={keyboardBox}>
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className={cn(
          'absolute inset-0 bg-[var(--ln-backdrop)] backdrop-blur-[2px] transition-opacity duration-200',
          closing ? 'opacity-0' : 'animate-fade-in',
        )}
      />
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn(
          'relative flex flex-col bg-elevated text-text shadow-modal outline-none transition-[opacity,transform] duration-180 ease-in',
          closing ? exitClassName : enterClassName,
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Shared header used by Modal, Drawer and Sheet */
export function OverlayHeader({ id, descId, title, description, icon: Icon, onClose, className }) {
  return (
    // Same look as CardHeader (icon tile + title + one line)
    <div className={cn('flex items-center gap-3.5 px-5 pb-3 pt-5 sm:px-6', className)}>
      {Icon && <IconTile icon={Icon} />}
      <div className="min-w-0 flex-1">
        <h2 id={id} className="text-[17px] font-semibold leading-6 text-text">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-0.5 text-[13px] leading-5 text-text-secondary">
            {phoneShort(description)}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
        >
          <X className="size-[18px]" />
        </button>
      )}
    </div>
  );
}

export function OverlayFooter({ className, children }) {
  return (
    <div
      className={cn(
        // Phones: the buttons side by side, sharing the width (Cancel / Back left, the main action right); from sm: right-aligned
        'flex flex-row flex-wrap items-center gap-2 border-t border-border bg-surface-secondary/60 px-5 py-3.5 sm:justify-end sm:px-6',
        '[&>*]:min-w-0 [&>*]:flex-1 sm:[&>*]:flex-none',
        className,
      )}
    >
      {children}
    </div>
  );
}

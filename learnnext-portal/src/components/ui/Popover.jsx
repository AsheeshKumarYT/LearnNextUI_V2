import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useFloating } from '@/hooks/useFloating';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useKeyboardViewport } from '@/hooks/useKeyboardViewport';

/**
 * Anchored floating panel (portal, viewport-aware). Base for Dropdown, pickers and selects.
 *
 * <Popover trigger={<Button>Filters</Button>} placement="bottom-end" className="w-72">
 *   {({ close }) => <div>…</div>}
 * </Popover>
 *
 * Controlled usage: pass `open` and `onOpenChange`.
 * Phones (below md): rendered as a bottom sheet instead — every dropdown, menu and picker built on this follows.
 */
export function Popover({
  trigger,
  children,
  open: openProp,
  onOpenChange,
  placement = 'bottom-start',
  matchWidth = false,
  role = 'dialog',
  className,
  panelProps,
  closeOnEsc = true,
  triggerClassName,
  sheet = true,
}) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = useCallback(
    (v) => {
      if (openProp === undefined) setInner(v);
      onOpenChange?.(v);
    },
    [openProp, onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);

  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const id = useId();
  const { style } = useFloating(open, anchorRef, panelRef, { placement, matchWidth });

  // Phones: the sheet's own backdrop closes it on a full tap instead (see below). Closing on pointerdown here made the
  // sheet vanish mid-tap, so the rest of the tap landed on whatever was underneath (e.g. the drawer's ×)
  const mobile = useIsMobile();
  const asSheet = sheet && mobile;
  useClickOutside([anchorRef, panelRef], close, open && !asSheet);

  useEffect(() => {
    if (!open || !closeOnEsc) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        anchorRef.current?.querySelector('button, [tabindex], input')?.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close, closeOnEsc]);

  // Phones: the panel is a bottom sheet (full width, rising from the bottom, dimmed backdrop, grab handle) instead of a
  // small box hanging off its trigger — the same look as the More and Notifications sheets. `sheet={false}` opts out.
  const keyboardBox = useKeyboardViewport(open && asSheet);
  useEffect(() => {
    if (!open || !asSheet) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // the page behind doesn't scroll while the sheet is up
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, asSheet]);

  const triggerEl = cloneElement(trigger, {
    'aria-expanded': open,
    'aria-haspopup': role === 'menu' ? 'menu' : role === 'listbox' ? 'listbox' : 'dialog',
    'aria-controls': open ? id : undefined,
    onClick: (e) => {
      trigger.props.onClick?.(e);
      setOpen(!open);
    },
  });

  return (
    <>
      <span ref={anchorRef} className={cn('inline-flex', triggerClassName)}>
        {triggerEl}
      </span>
      {open &&
        asSheet &&
        createPortal(
          // While the keyboard is up (e.g. a search box in the sheet), the layer shrinks to the visible part of the screen,
          // so the sheet rises above the keyboard instead of hiding behind it
          <div className="fixed inset-0 z-[85] flex items-end" style={keyboardBox}>
            {/* A tap on the dimmed area only closes the sheet — the backdrop takes the whole tap, nothing behind reacts */}
            <div
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute inset-0 animate-fade-in bg-[var(--ln-backdrop)] backdrop-blur-[2px]" />
            <div
              ref={panelRef}
              id={id}
              role={role}
              className={cn(
                className,
                // After the caller's classes, so the sheet's own size wins over e.g. "w-72" / "min-w-48"
                'relative !w-full !min-w-0 !max-w-none max-h-[85%] animate-slide-in-bottom overflow-auto rounded-b-none rounded-t-3xl border border-b-0 border-border bg-elevated px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0 text-text shadow-modal',
              )}
              {...panelProps}
            >
              <div className="sticky top-0 z-10 -mx-2 mb-1 flex justify-center bg-elevated pb-2 pt-2.5" aria-hidden="true">
                <span className="h-1 w-10 rounded-full bg-border-strong" />
              </div>
              {typeof children === 'function' ? children({ close }) : children}
            </div>
          </div>,
          document.body,
        )}
      {open &&
        !asSheet &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role={role}
            style={style}
            className={cn(
              'z-[85] animate-scale-in overflow-auto rounded-pop border border-border bg-elevated text-text shadow-pop',
              className,
            )}
            {...panelProps}
          >
            {typeof children === 'function' ? children({ close }) : children}
          </div>,
          document.body,
        )}
    </>
  );
}

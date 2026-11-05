import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Overlay, OverlayHeader, OverlayFooter } from './Overlay';

/**
 * Bottom sheet — great for mobile actions/filters. On larger screens it is a
 * centered panel docked to the bottom edge.
 * <Sheet open onClose title="Quick actions">…</Sheet>
 */
export function Sheet({ open, onClose, title, description, footer, className, children }) {
  const id = useId();
  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy={`${id}-title`}
      containerClassName="items-end justify-center"
      panelClassName={cn('max-h-[85%] w-full overflow-hidden rounded-t-2xl border border-b-0 border-border sm:max-w-xl', className)}
      enterClassName="animate-slide-in-bottom"
      exitClassName="translate-y-full"
    >
      <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
      <OverlayHeader id={`${id}-title`} title={title} description={description} onClose={onClose} className="pt-3" />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-6">{children}</div>
      {footer && <OverlayFooter className="pb-[max(0.875rem,env(safe-area-inset-bottom))]">{footer}</OverlayFooter>}
    </Overlay>
  );
}

import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Overlay, OverlayHeader, OverlayFooter } from './Overlay';

const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl', full: 'sm:max-w-6xl' };

/**
 * Centered dialog (bottom-anchored full-width on phones).
 *
 * <Modal open={open} onClose={close} title="New course" description="…"
 *   footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button type="submit" form="course-form">Create</Button></>}>
 *   <form id="course-form">…</form>
 * </Modal>
 */
export function Modal({ open, onClose, title, description, icon, size = 'md', footer, closeOnBackdrop = true, bodyClassName, panelClassName, children }) {
  const id = useId();
  return (
    <Overlay
      open={open}
      onClose={onClose}
      closeOnBackdrop={closeOnBackdrop}
      labelledBy={`${id}-title`}
      describedBy={description ? `${id}-desc` : undefined}
      containerClassName="items-end justify-center sm:items-center sm:p-6"
      panelClassName={cn(
        // Heights are % of the overlay layer (not the screen), so when the phone keyboard shrinks the layer the modal shrinks
        // with it and its body scrolls — fields stay above the keyboard instead of behind it
        'max-h-[calc(100%-1.5rem)] w-full overflow-hidden rounded-t-2xl sm:max-h-full sm:rounded-2xl border border-border',
        sizes[size],
        panelClassName,
      )}
      enterClassName="animate-slide-in-bottom sm:animate-scale-in"
      exitClassName="opacity-0 translate-y-4 sm:translate-y-1 sm:scale-[0.98]"
    >
      <OverlayHeader id={`${id}-title`} descId={`${id}-desc`} title={title} description={description} icon={icon} onClose={onClose} />
      <div className={cn('min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-2 sm:px-6', bodyClassName)}>{children}</div>
      {footer && <OverlayFooter>{footer}</OverlayFooter>}
    </Overlay>
  );
}

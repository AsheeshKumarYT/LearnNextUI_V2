import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Overlay, OverlayHeader, OverlayFooter } from './Overlay';

const widths = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-xl', xl: 'sm:max-w-3xl' };

/**
 * Side panel — for detail views, filters and longer forms.
 * <Drawer open onClose title="Filters" side="right" size="md" footer={…}>…</Drawer>
 * Set `header={false}` to render fully custom content (e.g. the mobile nav).
 */
export function Drawer({ open, onClose, title, description, icon, side = 'right', size = 'md', footer, header = true, labelledBy, bodyClassName, panelClassName, children }) {
  const id = useId();
  const right = side === 'right';
  return (
    <Overlay
      open={open}
      onClose={onClose}
      // With a custom header (header={false}), pass the id of its heading as `labelledBy`
      labelledBy={labelledBy ?? (title ? `${id}-title` : undefined)}
      containerClassName={right ? 'justify-end' : 'justify-start'}
      panelClassName={cn(
        // Phones: the full screen width (a strip of dimmed page beside a narrow panel only wasted room); from sm: the size
        'h-full w-full border-border max-sm:border-0',
        right ? 'border-l' : 'border-r',
        widths[size],
        panelClassName,
      )}
      enterClassName={right ? 'animate-slide-in-right' : 'animate-slide-in-left'}
      exitClassName={right ? 'translate-x-full' : '-translate-x-full'}
    >
      {header && (
        <OverlayHeader id={`${id}-title`} title={title} description={description} icon={icon} onClose={onClose} className="border-b border-border pb-4" />
      )}
      <div className={cn('min-h-0 flex-1 overflow-y-auto', header && 'px-5 py-5 sm:px-6', bodyClassName)}>
        {children}
      </div>
      {footer && <OverlayFooter>{footer}</OverlayFooter>}
    </Overlay>
  );
}

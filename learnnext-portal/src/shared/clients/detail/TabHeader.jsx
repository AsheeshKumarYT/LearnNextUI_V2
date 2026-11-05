import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';
import { IconTile } from '@/components/ui';

/**
 * Header of a client-detail tab card: icon tile, title (+ optional count) and a one-line description on the left (the
 * same look as CardHeader); the tab's controls (`children` — search, filters, year stepper…) on the right, wrapping
 * below on small screens. Sits at the top of a padding="none" card.
 */
/** `hideTitleOnMobile`: on phones only the controls show (the section tabs above already name the tab) */
export function TabHeader({ icon, tone = 'primary', title, count, description, hideTitleOnMobile, children, className }) {
  return (
    // With no controls beside it, the whole header row hides on phones
    <div className={cn('flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-5 sm:px-6', className, hideTitleOnMobile && !children && 'max-sm:hidden')}>
      <div className={cn('flex min-w-0 items-center gap-3.5', hideTitleOnMobile && 'max-sm:hidden')}>
        <IconTile icon={icon} tone={tone} />
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-6 text-text">
            {title}
            {count != null && <span className="ml-1.5 text-sm font-medium tabular-nums text-text-muted">{count}</span>}
          </h3>
          {description && <p className="mt-0.5 text-[13px] text-text-secondary">{phoneShort(description)}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

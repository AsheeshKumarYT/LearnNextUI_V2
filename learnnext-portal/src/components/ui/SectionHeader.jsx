import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';

/** Heading for a page section that is NOT inside a card. */
export function SectionHeader({ title, description, action, className }) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-[-0.01em] text-text">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-text-muted">{phoneShort(description)}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

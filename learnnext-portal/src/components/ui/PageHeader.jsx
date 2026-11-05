import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';
import { IconTile } from './CardHeader';

/**
 * Top of every page: title, description, primary actions, optional meta row and tabs.
 * <PageHeader title="Courses" description="…" actions={<Button leftIcon={Plus}>New course</Button>} />
 * On mobile, actions wrap below the title and stretch.
 */
export function PageHeader({ title, description, eyebrow, icon: Icon, media, actions, meta, children, className }) {
  return (
    <header className={cn('mb-6 sm:mb-8', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Visual pinned to the top on phones (a long title wraps), centred from sm */}
        <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
          {/* Optional leading visual: `media` (e.g. a client's logo) or a soft icon tile (same style as the dashboard KPI tiles) */}
          {media ?? (Icon && <IconTile icon={Icon} />)}

          <div className="min-w-0">
            {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-text">{eyebrow}</p>}
            <h1 className={cn('font-bold text-text', Icon || media ? 'text-lg leading-6 sm:text-xl sm:leading-7' : 'text-[22px] leading-8 sm:text-2xl')}>{title}</h1>
            {description && <p className={cn('max-w-2xl text-text-secondary', Icon || media ? 'mt-0.5 text-[13px] leading-5' : 'mt-1 text-sm leading-6')}>{phoneShort(description)}</p>}
            {meta && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-text-muted">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}

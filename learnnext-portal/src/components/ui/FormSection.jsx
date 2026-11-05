import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';

/**
 * Groups related fields with a title/description column on wide screens.
 * <FormSection title="Basics" description="Shown on the course page."> fields… </FormSection>
 */
export function FormSection({ title, description, actions, className, children }) {
  return (
    <section className={cn('grid gap-5 py-6 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10', className)}>
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {description && <p className="mt-1 text-[13px] leading-5 text-text-muted">{phoneShort(description)}</p>}
        {actions && <div className="mt-3">{actions}</div>}
      </div>
      <div className="grid min-w-0 gap-4">{children}</div>
    </section>
  );
}

/** Responsive 1→2 column grid for side-by-side fields */
export function FormGrid({ cols = 2, className, children }) {
  return (
    <div className={cn('grid gap-4', cols === 2 && 'sm:grid-cols-2', cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3', className)}>
      {children}
    </div>
  );
}

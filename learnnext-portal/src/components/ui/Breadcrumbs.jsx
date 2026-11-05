import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * <Breadcrumbs items={[{ label: 'Workspace' }, { label: 'Courses', to: '/courses' }]} /> — last item is current page.
 * Links pass through `onLinkClick(event, to)` (e.g. to let a page with unsaved changes intercept them).
 */
export function Breadcrumbs({ items = [], onLinkClick, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={cn('flex min-w-0 items-center gap-1.5', !last && 'shrink-0')}>
              {item.to && !last ? (
                <Link to={item.to} onClick={(e) => onLinkClick?.(e, item.to)} className="rounded-sm text-text-muted transition-colors hover:text-text hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  {item.label}
                </Link>
              ) : (
                <span className={cn('truncate', last ? 'font-medium text-text' : 'text-text-muted')} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 shrink-0 text-text-muted/70" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

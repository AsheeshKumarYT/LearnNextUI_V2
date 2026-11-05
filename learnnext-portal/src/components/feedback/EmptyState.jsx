import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Designed empty state — never leave a blank area.
 * <EmptyState icon={BookOpen} title="No courses yet" description="…" action={<Button>Create course</Button>} />
 * compact: tighter spacing for inside cards / dropdowns.
 */
export function EmptyState({ icon: Icon = Inbox, title, description, action, secondaryAction, compact, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <div className="relative mb-4">
        <div className="absolute inset-0 -m-3 rounded-full bg-primary-soft/60 blur-xl" aria-hidden="true" />
        <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-border bg-surface text-primary-text shadow-raised">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-text">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-text-muted">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction}
          {action}
        </div>
      )}
    </div>
  );
}

import { cn } from '@/utils/cn';

/** A bordered sub-panel inside a step: a header row (icon + title + extras, optional action) and its body */
export function Panel({ icon: Icon, title, extra, action, className, bodyClassName, children }) {
  return (
    <section className={cn('rounded-xl border border-border-strong bg-surface/70 dark:bg-surface-sunken/40', className)}>
      <div className="flex min-h-11 flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-border px-4 py-2">
        {Icon && <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
        <h3 className="text-[13px] font-semibold text-text">{title}</h3>
        {extra}
        {action && <div className="ml-auto flex items-center gap-2">{action}</div>}
      </div>
      <div className={cn('px-4 py-4', bodyClassName)}>{children}</div>
    </section>
  );
}

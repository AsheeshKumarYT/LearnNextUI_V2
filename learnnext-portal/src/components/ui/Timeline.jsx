import { cn } from '@/utils/cn';

const tones = {
  primary: 'bg-primary-soft text-primary-text',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-sunken text-text-secondary',
};

/**
 * Vertical timeline with connecting rail.
 * <Timeline items={[{ id, icon, tone, title, description, time }]} />
 * Or pass custom children wrapped in <TimelineItem>.
 */
export function Timeline({ items, className, children }) {
  return (
    <ol className={cn('relative', className)}>
      {items
        ? items.map((it, i) => <TimelineItem key={it.id ?? i} {...it} last={i === items.length - 1} />)
        : children}
    </ol>
  );
}

export function TimelineItem({ icon: Icon, tone = 'neutral', title, description, time, last, children }) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!last && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border" aria-hidden="true" />}
      <span className={cn('relative z-[1] inline-flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface', tones[tone])}>
        {Icon ? <Icon className="size-4" aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <div className="min-w-0 flex-1 pt-1">
        {children ?? (
          <>
            <div className="text-[13px] leading-5 text-text">{title}</div>
            {description && <div className="mt-0.5 text-xs text-text-muted">{description}</div>}
          </>
        )}
        {time && <div className="mt-1 text-xs text-text-muted">{time}</div>}
      </div>
    </li>
  );
}

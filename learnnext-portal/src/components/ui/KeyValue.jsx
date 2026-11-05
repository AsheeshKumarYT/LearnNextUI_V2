import { cn } from '@/utils/cn';

/**
 * Description list for detail panels.
 * <KeyValueList items={[{ label: 'Email', value: 'a@b.com' }]} columns={2} />
 */
export function KeyValueList({ items = [], columns = 1, className }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-xs font-medium text-text-muted">{it.label}</dt>
          <dd className="mt-1 break-words text-[13.5px] text-text">{it.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Horizontal label/value row with divider — for compact summaries */
export function KeyValueRow({ label, value, className }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 border-b border-border py-2.5 text-[13px] last:border-0', className)}>
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
}

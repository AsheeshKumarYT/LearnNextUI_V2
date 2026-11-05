import { useId } from 'react';
import { phoneShort } from '@/utils/phoneCopy';
import { cn } from '@/utils/cn';

/**
 * Toggle switch. <Switch checked={on} onChange={setOn} label="Email alerts" description="…" />
 * onChange receives the new boolean. Without a visible label, pass `aria-label` so it still has a name.
 */
export function Switch({ checked, onChange, label, description, disabled, size = 'md', className, id: idProp, 'aria-label': ariaLabel }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const track = size === 'sm' ? 'h-4 w-7' : 'h-5 w-9';
  const thumb = size === 'sm' ? 'size-3 data-[on=true]:translate-x-3' : 'size-4 data-[on=true]:translate-x-4';

  const control = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={Boolean(checked)}
      aria-label={label ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-border-strong',
        track,
      )}
    >
      <span
        data-on={Boolean(checked)}
        className={cn('block rounded-full bg-white shadow-sm transition-transform duration-200', thumb)}
      />
    </button>
  );

  if (!label) return control;
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-[13px] font-medium text-text">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-5 text-text-muted">{phoneShort(description)}</span>}
      </label>
      <span className="pt-0.5">{control}</span>
    </div>
  );
}

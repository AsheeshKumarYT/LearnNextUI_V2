import { useId } from 'react';
import { phoneShort } from '@/utils/phoneCopy';
import { cn } from '@/utils/cn';

/**
 * RadioGroup — <RadioGroup name="plan" value={v} onChange={setV} options={[{ value, label, description }]} />
 * variant="cards" renders selectable cards (good for plans / appearance pickers).
 */
export function RadioGroup({ name, value, onChange, options = [], variant = 'default', orientation = 'vertical', label, className }) {
  const autoName = useId();
  const groupName = name ?? autoName;
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        variant === 'cards' ? 'grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]' : 'flex gap-3',
        variant !== 'cards' && (orientation === 'vertical' ? 'flex-col' : 'flex-wrap gap-x-6'),
        className,
      )}
    >
      {options.map((o) => (
        <Radio
          key={o.value}
          name={groupName}
          value={o.value}
          checked={value === o.value}
          onChange={() => onChange?.(o.value)}
          label={o.label}
          description={o.description}
          icon={o.icon}
          disabled={o.disabled}
          variant={variant}
        />
      ))}
    </div>
  );
}

export function Radio({ label, description, icon: Icon, variant = 'default', className, ...props }) {
  const id = useId();
  const dot = (
    <input
      id={id}
      type="radio"
      className={cn(
        'size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-control-border-hover bg-control shadow-xs transition-all',
        'checked:border-[5px] checked:border-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
      {...props}
    />
  );

  if (variant === 'cards') {
    return (
      <label
        htmlFor={id}
        className={cn(
          'relative flex cursor-pointer items-start gap-3 rounded-card border bg-surface p-3.5 transition-[border-color,box-shadow,background-color]',
          props.checked ? 'border-primary ring-[3px] ring-focus/60 bg-primary-soft/40' : 'border-border hover:border-border-strong',
          className,
        )}
      >
        {Icon && (
          <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-lg', props.checked ? 'bg-primary text-primary-fg' : 'bg-surface-sunken text-text-secondary')}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-medium text-text">{label}</span>
          {description && <span className="mt-0.5 block text-xs text-text-muted">{phoneShort(description)}</span>}
        </span>
        <span className="mt-0.5">{dot}</span>
      </label>
    );
  }

  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer items-start gap-2.5', className)}>
      <span className="mt-0.5 inline-flex">{dot}</span>
      <span>
        <span className="block text-[13px] font-medium text-text">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-text-muted">{phoneShort(description)}</span>}
      </span>
    </label>
  );
}

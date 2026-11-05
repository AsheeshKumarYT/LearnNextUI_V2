import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { controlBase, controlBorder } from './formStyles';
import { useFormField } from './FormFieldContext';

/**
 * Button styled like an input — the trigger for custom pickers
 * (SearchableSelect, MultiSelect, DatePicker, DateRangePicker, TimePicker).
 */
export function SelectTrigger({
  icon: Icon,
  placeholder,
  children,
  invalid: invalidProp,
  onClear,
  disabled,
  className,
  ...props
}) {
  const field = useFormField();
  const invalid = invalidProp ?? field.invalid;
  const empty = children == null || children === '' || (Array.isArray(children) && !children.length);
  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        id={field.id}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(
          controlBase,
          controlBorder(invalid),
          'flex min-h-10 items-center gap-2 py-1 pl-3 text-left sm:min-h-9',
          onClear && !empty ? 'pr-14' : 'pr-9',
        )}
        {...props}
      >
        {Icon && <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
        <span className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-1', empty && 'text-text-muted')}>
          {empty ? <span className="truncate">{placeholder}</span> : children}
        </span>
      </button>
      {onClear && !empty && !disabled && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="absolute right-8 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded text-text-muted hover:bg-surface-sunken hover:text-text"
        >
          <X className="size-3.5" />
        </button>
      )}
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </div>
  );
}

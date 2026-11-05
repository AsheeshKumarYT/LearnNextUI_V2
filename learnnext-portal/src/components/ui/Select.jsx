import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { controlBase, controlBorder, controlHeight } from './formStyles';
import { useFormField } from './FormFieldContext';

/**
 * Native select (best on mobile, fully accessible). For search or multi-select
 * use SearchableSelect / MultiSelect.
 * options: [{ value, label, disabled }] or strings. leftIcon: Lucide icon (matches Input).
 */
export function Select({ options = [], placeholder, invalid: invalidProp, size = 'md', leftIcon: LeftIcon, className, ...props }) {
  const field = useFormField();
  const invalid = invalidProp ?? field.invalid;
  return (
    <div className={cn('relative w-full', className)}>
      {LeftIcon && <LeftIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />}
      <select
        id={field.id}
        aria-invalid={invalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(
          controlBase,
          controlBorder(invalid),
          size === 'sm' ? 'h-8 text-[13px]' : controlHeight,
          'appearance-none pr-9',
          LeftIcon ? 'pl-9' : 'pl-3',
          props.value === '' && 'text-text-muted',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </div>
  );
}

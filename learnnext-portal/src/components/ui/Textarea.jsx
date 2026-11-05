import { cn } from '@/utils/cn';
import { controlBase, controlBorder } from './formStyles';
import { useFormField } from './FormFieldContext';

/**
 * Multi-line text. Shows a character counter when `maxLength` and `showCount` are set.
 * `fill` grows the box to the height of a flex parent (pair with <FormField fill>); `rows` is then the minimum.
 */
export function Textarea({ invalid: invalidProp, rows = 4, showCount, fill, className, value, maxLength, ...props }) {
  const field = useFormField();
  const invalid = invalidProp ?? field.invalid;
  return (
    <div className={cn('relative', fill && 'flex flex-1 flex-col')}>
      <textarea
        id={field.id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        aria-describedby={field.describedBy}
        className={cn(controlBase, controlBorder(invalid), 'px-3 py-2 leading-relaxed', fill ? 'flex-1 resize-none' : 'resize-y', showCount && 'pb-6', className)}
        {...props}
      />
      {showCount && maxLength && (
        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-text-muted">
          {String(value ?? '').length}/{maxLength}
        </span>
      )}
    </div>
  );
}

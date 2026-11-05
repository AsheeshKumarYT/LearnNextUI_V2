import { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Label } from './Label';
import { FormFieldContext } from './FormFieldContext';

/**
 * Standard field wrapper: label + control + helper text + error.
 * Controls inside automatically receive id, aria-describedby and invalid state.
 *
 * <FormField label="Email" required error={errors.email} helper="We never share it.">
 *   <Input type="email" value={v} onChange={…} />
 * </FormField>
 *
 * layout="horizontal" puts the label on the left from the md breakpoint up.
 * `fill` lets the field (and its control) grow to fill a flex column, e.g. a Textarea with `fill`.
 */
export function FormField({
  label,
  helper,
  error,
  required,
  optional,
  id: idProp,
  layout = 'vertical',
  labelAction,
  fill,
  className,
  children,
}) {
  const autoId = useId();
  const id = idProp || `f-${autoId}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <FormFieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required }}>
      <div
        className={cn(
          layout === 'horizontal' ? 'grid gap-1.5 md:grid-cols-[200px_1fr] md:gap-6' : 'flex flex-col gap-1.5',
          fill && 'flex-1',
          className,
        )}
      >
        {(label || labelAction) && (
          <div className={cn('flex items-center justify-between gap-2', layout === 'horizontal' && 'md:pt-2 md:items-start')}>
            {label && (
              <Label htmlFor={id} required={required} optional={optional}>
                {label}
              </Label>
            )}
            {labelAction}
          </div>
        )}
        <div className={cn('flex min-w-0 flex-col gap-1.5', fill && 'flex-1')}>
          {children}
          {error ? (
            <p id={errorId} className="flex items-start gap-1.5 text-xs text-danger" role="alert">
              <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : (
            helper && (
              <p id={helperId} className="text-xs text-text-muted">
                {helper}
              </p>
            )
          )}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}

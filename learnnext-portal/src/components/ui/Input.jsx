import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import { controlBase, controlBorder, controlHeight } from './formStyles';
import { useFormField } from './FormFieldContext';
import { Spinner } from './Spinner';

/**
 * Text input. type="password" automatically adds a show/hide toggle.
 * leftIcon: Lucide icon; rightSlot: any node (e.g. a unit or Kbd); loading shows a spinner.
 */
export function Input({
  type = 'text',
  leftIcon: LeftIcon,
  rightSlot,
  loading,
  invalid: invalidProp,
  size = 'md',
  className,
  inputClassName,
  id: idProp,
  ...props
}) {
  const field = useFormField();
  const [reveal, setReveal] = useState(false);
  const invalid = invalidProp ?? field.invalid;
  const isPassword = type === 'password';
  const hasRight = isPassword || rightSlot || loading;

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      {LeftIcon && (
        <LeftIcon className="pointer-events-none absolute left-3 size-4 text-text-muted" aria-hidden="true" />
      )}
      <input
        id={idProp ?? field.id}
        type={isPassword && reveal ? 'text' : type}
        aria-invalid={invalid || undefined}
        aria-describedby={field.describedBy}
        aria-required={field.required || undefined}
        className={cn(
          controlBase,
          controlBorder(invalid),
          size === 'sm' ? 'h-8 text-[13px]' : size === 'lg' ? 'h-11' : controlHeight,
          'px-3',
          LeftIcon && 'pl-9',
          hasRight && 'pr-10',
          inputClassName,
        )}
        {...props}
      />
      {hasRight && (
        <div className="absolute right-1.5 flex items-center gap-1 text-text-muted">
          {loading && <Spinner size="sm" className="mr-1.5" />}
          {rightSlot}
          {isPassword && (
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="inline-flex size-7 items-center justify-center rounded-md hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-label={reveal ? 'Hide password' : 'Show password'}
              aria-pressed={reveal}
            >
              {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

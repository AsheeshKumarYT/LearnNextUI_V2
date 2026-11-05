import { useEffect, useId, useRef } from 'react';
import { phoneShort } from '@/utils/phoneCopy';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Checkbox with optional label/description. Supports `indeterminate`.
 * <Checkbox checked={v} onChange={(e) => set(e.target.checked)} label="Remember me" />
 */
export function Checkbox({ label, description, indeterminate, className, id: idProp, ...props }) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  const box = (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          'peer size-4 cursor-pointer appearance-none rounded-[5px] border border-control-border-hover bg-control shadow-xs transition-colors',
          'checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary',
          'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      {indeterminate ? (
        <Minus className="pointer-events-none absolute size-3 text-white" strokeWidth={3} aria-hidden="true" />
      ) : (
        <Check className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden="true" />
      )}
    </span>
  );

  if (!label) return <span className={cn('inline-flex', className)}>{box}</span>;
  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer items-start gap-2.5', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      {/* The box and the label's first line share one 20px line, so the box sits centred on the text */}
      <span className="flex h-5 items-center">{box}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium leading-5 text-text">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-text-muted">{phoneShort(description)}</span>}
      </span>
    </label>
  );
}

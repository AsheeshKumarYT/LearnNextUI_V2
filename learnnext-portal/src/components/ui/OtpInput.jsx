import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { useFormField } from './FormFieldContext';

/**
 * One-time code input: N single-digit boxes with auto-advance, backspace, arrow keys and paste.
 * <OtpInput value={code} onChange={setCode} length={6} onComplete={verify} invalid={!!error} />
 * Works inside FormField (the first box gets the field id / aria wiring).
 */
export function OtpInput({ value = '', onChange, length = 6, onComplete, invalid: invalidProp, disabled, autoFocus, className }) {
  const field = useFormField();
  const invalid = invalidProp ?? field.invalid;
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const focus = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  // After a rejected code is cleared (and the boxes are enabled again), put the cursor back in the first box
  useEffect(() => {
    if (invalid && !disabled && !value) refs.current[0]?.focus();
  }, [invalid, disabled, value]);

  const commit = (next) => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const setAt = (i, d) => {
    const arr = [...digits];
    arr[i] = d;
    // Joining keeps the code contiguous (an emptied box closes the gap)
    commit(arr.join(''));
  };

  const onInput = (i, e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) {
      // Autofill (SMS one-time-code) or fast typing — spread across boxes from here
      commit((value.slice(0, i) + typed).slice(0, length));
      focus(i + typed.length);
      return;
    }
    const at = Math.min(i, value.length);
    setAt(at, typed);
    focus(at + 1);
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[i]) setAt(i, '');
      else if (i > 0) {
        setAt(i - 1, '');
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focus(i + 1);
    }
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();
    commit(pasted);
    focus(pasted.length);
  };

  return (
    <div className={cn('flex gap-2 sm:gap-2.5', className)} role="group" aria-label={`${length}-digit code`}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          id={i === 0 ? field.id : undefined}
          aria-describedby={i === 0 ? field.describedBy : undefined}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'size-11 min-w-0 flex-1 rounded-control border bg-control text-center text-lg font-bold tabular-nums text-text shadow-xs transition-[border-color,box-shadow] sm:size-12 sm:flex-none',
            'focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-focus disabled:opacity-60',
            invalid ? 'border-danger' : d ? 'border-primary/50' : 'border-control-border hover:border-control-border-hover',
          )}
        />
      ))}
    </div>
  );
}

import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Progress through a multi-step workflow.
 * <Stepper steps={[{ label: 'Details', description: '…' }, …]} current={1} onStepClick={setStep} />
 * Horizontal at every size: the step circles in a row joined by a line (filled up to the current step), each step's
 * name under its circle. orientation="vertical" stacks them instead (circle beside its name).
 * `reachable` = the furthest step that can be clicked (defaults to `current`), e.g. every step when editing.
 */
export function Stepper({ steps = [], current = 0, reachable = current, onStepClick, orientation = 'horizontal', className }) {
  const horizontal = orientation !== 'vertical';
  return (
    <ol className={cn('flex', horizontal ? 'flex-row items-start' : 'flex-col gap-4', className)}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        const clickable = onStepClick && i !== current && i <= Math.max(current, reachable);
        const last = i === steps.length - 1;
        return (
          <li key={s.label} className={cn('flex min-w-0', horizontal ? cn('flex-col gap-2', !last && 'flex-1') : 'items-start gap-3')}>
            <div className={cn('flex items-center', horizontal && !last && 'w-full')}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(i)}
                aria-current={state === 'current' ? 'step' : undefined}
                className={cn(
                  'inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors disabled:cursor-default',
                  state === 'done' && 'bg-primary text-primary-fg',
                  state === 'current' && 'bg-primary-soft text-primary-text ring-2 ring-primary',
                  state === 'upcoming' && 'bg-surface text-text-secondary ring-1 ring-inset ring-border-strong',
                )}
              >
                {state === 'done' ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </button>
              {/* The line to the next step: blue once this step is done */}
              {horizontal && !last && <span className={cn('mx-2 h-0.5 flex-1 rounded-full', i < current ? 'bg-primary' : 'bg-border-strong')} aria-hidden="true" />}
            </div>
            <div className={cn('min-w-0', horizontal && !last && 'pr-3')}>
              <p className={cn('text-xs font-medium leading-snug sm:text-[13px]', state === 'upcoming' ? 'text-text-secondary' : 'text-text')}>{s.label}</p>
              {s.description && <p className="mt-0.5 hidden text-xs text-text-muted sm:block">{s.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

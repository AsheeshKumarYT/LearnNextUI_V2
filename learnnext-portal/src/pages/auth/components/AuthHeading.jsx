import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';

export function AuthHeading({ icon: Icon, title, description, tone = 'primary', className }) {
  return (
    <div className={cn('mb-8 max-lg:mb-6 short:max-lg:mb-5', className)}>
      {Icon && (
        <span
          className={cn(
            'mb-5 inline-flex size-11 items-center justify-center rounded-xl border shadow-xs',
            tone === 'success' ? 'border-success/20 bg-success-soft text-success' : 'border-border bg-surface-secondary text-primary-text',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <h1 className="text-2xl font-semibold tracking-[-0.025em] text-text">{title}</h1>
      {description && <p className="mt-2 text-sm leading-6 text-text-secondary max-lg:mt-1.5">{phoneShort(description)}</p>}
    </div>
  );
}

import { AlertOctagon, RotateCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

/** <ErrorState title="Couldn’t load courses" description={error.message} onRetry={reload} /> */
export function ErrorState({ title = 'Something went wrong', description = 'We couldn’t load this content. Please try again.', onRetry, compact, className }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-danger/20 bg-danger-soft text-danger">
        <AlertOctagon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-[15px] font-semibold text-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" leftIcon={RotateCw} className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

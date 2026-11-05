import { cn } from '@/utils/cn';
import { Spinner } from '@/components/ui/Spinner';

/** Centered spinner with optional label — for whole-region loads (use skeletons for known layouts). */
export function LoadingState({ label = 'Loading…', className, fullPage }) {
  return (
    <div role="status" className={cn('flex flex-col items-center justify-center gap-3 text-text-muted', fullPage ? 'min-h-[60vh]' : 'py-14', className)}>
      <Spinner size="md" className="text-primary" />
      <span className="text-[13px]">{label}</span>
    </div>
  );
}

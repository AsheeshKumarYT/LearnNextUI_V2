import { cn } from '@/utils/cn';

export function Kbd({ className, children }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface-secondary px-1 font-sans text-[11px] font-medium text-text-muted',
        className,
      )}
    >
      {children}
    </kbd>
  );
}

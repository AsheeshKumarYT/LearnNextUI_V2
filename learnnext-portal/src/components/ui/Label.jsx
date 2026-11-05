import { cn } from '@/utils/cn';

export function Label({ htmlFor, required, optional, className, children, ...props }) {
  return (
    <label htmlFor={htmlFor} className={cn('inline-flex items-center gap-1 text-[13px] font-medium text-text', className)} {...props}>
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      )}
      {optional && <span className="font-normal text-text-muted">(optional)</span>}
    </label>
  );
}

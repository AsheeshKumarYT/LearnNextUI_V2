import { cn } from '@/utils/cn';

/**
 * Visually joins adjacent Buttons: <ButtonGroup><Button variant="secondary"/>...</ButtonGroup>
 */
export function ButtonGroup({ className, children, ...props }) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex isolate shadow-xs rounded-control',
        '[&>*]:rounded-none [&>*]:shadow-none [&>*:first-child]:rounded-l-control [&>*:last-child]:rounded-r-control',
        '[&>*:not(:first-child)]:-ml-px [&>*:focus-visible]:z-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

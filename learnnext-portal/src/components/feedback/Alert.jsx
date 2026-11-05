import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const tones = {
  info: { icon: Info, cls: 'border-info/25 bg-info-soft', iconCls: 'text-info' },
  success: { icon: CheckCircle2, cls: 'border-success/25 bg-success-soft', iconCls: 'text-success' },
  warning: { icon: AlertTriangle, cls: 'border-warning/25 bg-warning-soft', iconCls: 'text-warning' },
  danger: { icon: XCircle, cls: 'border-danger/25 bg-danger-soft', iconCls: 'text-danger' },
  primary: { icon: Info, cls: 'border-primary/25 bg-primary-soft', iconCls: 'text-primary-text' },
};

/** Inline message. <Alert tone="warning" title="Heads up" action={<Button size="sm">Fix</Button>} onDismiss={…}>Body</Alert> */
export function Alert({ tone = 'info', title, children, action, onDismiss, icon, className }) {
  const t = tones[tone];
  const Icon = icon ?? t.icon;
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-card border p-3.5', t.cls, className)}>
      <Icon className={cn('mt-0.5 size-[18px] shrink-0', t.iconCls)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-[13px] font-semibold text-text">{title}</p>}
        {children && <div className={cn('text-[13px] leading-5 text-text-secondary', title && 'mt-0.5')}>{children}</div>}
        {action && <div className="mt-2.5 flex flex-wrap gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-black/5 hover:text-text dark:hover:bg-white/5">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

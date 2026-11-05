import { AlertTriangle, Bell, ClipboardCheck, MessageSquare, UserPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/formatDate';

export const NOTIFICATION_TYPES = {
  enrollment: { icon: UserPlus, cls: 'bg-success-soft text-success' },
  review: { icon: ClipboardCheck, cls: 'bg-warning-soft text-warning' },
  message: { icon: MessageSquare, cls: 'bg-primary-soft text-primary-text' },
  alert: { icon: AlertTriangle, cls: 'bg-danger-soft text-danger' },
  system: { icon: Bell, cls: 'bg-surface-sunken text-text-secondary' },
};

/** Shared by the header dropdown and the Notifications page. */
export function NotificationItem({ notification: n, onClick, actions, compact, className }) {
  const t = NOTIFICATION_TYPES[n.type] ?? NOTIFICATION_TYPES.system;
  const Icon = t.icon;
  return (
    <div
      className={cn(
        'group relative flex gap-3 transition-colors',
        compact ? 'rounded-lg p-2.5' : 'px-4 py-4 sm:px-5',
        onClick && 'cursor-pointer hover:bg-surface-secondary',
        !n.read && !compact && 'bg-primary-soft/25',
        className,
      )}
      onClick={onClick}
    >
      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full', t.cls)}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className={cn('min-w-0 flex-1 text-[13px] leading-5', n.read ? 'text-text-secondary' : 'font-semibold text-text')}>{n.title}</p>
          {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
        </div>
        <p className={cn('mt-0.5 text-[13px] leading-5 text-text-muted', compact && 'line-clamp-1')}>{n.body}</p>
        <p className="mt-1 text-xs text-text-muted">{formatRelative(n.at)}</p>
      </div>
      {actions && <div className="flex shrink-0 items-start">{actions}</div>}
    </div>
  );
}

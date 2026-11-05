import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/formatDate';
import { Avatar } from './Avatar';

/**
 * Feed row: avatar + "<actor> <action> <target>" + relative time.
 * <ActivityItem actor="Maya" action="published" target="Design 101" at={iso} />
 */
export function ActivityItem({ actor, action, target, at, avatar, meta, className }) {
  return (
    <div className={cn('flex gap-3 py-3 first:pt-0 last:pb-0', className)}>
      <Avatar name={actor} src={avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-5 text-text-secondary">
          <span className="font-medium text-text">{actor}</span> {action}{' '}
          {target && <span className="font-medium text-text">{target}</span>}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {formatRelative(at)}
          {meta && <> · {meta}</>}
        </p>
      </div>
    </div>
  );
}

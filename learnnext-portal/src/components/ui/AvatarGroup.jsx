import { cn } from '@/utils/cn';
import { Avatar } from './Avatar';
import { Tooltip } from './Tooltip';

/**
 * <AvatarGroup people={[{ name, src }]} max={4} />
 * Light overlap (-6px) with a 2px ring in the surface colour so initials never get clipped;
 * each avatar has a name tooltip, and the "+N" chip lists the hidden names.
 */
export function AvatarGroup({ people = [], max = 4, size = 'sm', className }) {
  const shown = people.slice(0, max);
  const hidden = people.slice(max);
  return (
    <div className={cn('flex -space-x-1.5', className)}>
      {shown.map((p) => (
        <Tooltip key={p.id ?? p.name} content={p.name} delay={120}>
          <span className="inline-flex rounded-full ring-2 ring-surface">
            <Avatar name={p.name} src={p.src} size={size} />
          </span>
        </Tooltip>
      ))}
      {hidden.length > 0 && (
        <Tooltip content={hidden.map((p) => p.name).join(', ')} delay={120}>
          <span
            aria-label={`${hidden.length} more: ${hidden.map((p) => p.name).join(', ')}`}
            className={cn(
              'inline-flex items-center justify-center rounded-full bg-surface-sunken font-semibold tabular-nums text-text-secondary ring-2 ring-surface',
              // min-width + padding so "+12" never clips at small sizes
              size === 'xs' ? 'h-6 min-w-6 px-1 text-[10px]' : size === 'sm' ? 'h-8 min-w-8 px-1 text-xs' : 'h-9 min-w-9 px-1 text-xs',
            )}
          >
            +{hidden.length}
          </span>
        </Tooltip>
      )}
    </div>
  );
}

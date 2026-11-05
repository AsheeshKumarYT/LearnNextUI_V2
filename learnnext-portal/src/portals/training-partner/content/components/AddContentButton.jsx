import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * The program's main action — highlighted, but calm (the app's soft blue only, nothing bright): a softly filled pill
 * with a dashed blue outline (an "empty slot" waiting for content), a solid blue circle with a white plus, and the
 * label. Hover / focus: the dashed outline turns solid, the plus turns a quarter and a soft shine sweeps across once.
 * The colours don't change (a darker fill on hover read as cheap). Used in the program table and on the cards.
 */
export function AddContentButton({ onClick, className, label = 'Add content' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group/add relative inline-flex h-8 shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border border-dashed border-primary/45 bg-primary-soft/80 pl-1 pr-3 text-[13px] font-semibold text-primary-text shadow-xs',
        'hover:border-solid focus-visible:border-solid',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
        className,
      )}
    >
      {/* Shine: a soft light band that crosses once on hover */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover/add:translate-x-[300%] group-hover/add:opacity-100 dark:via-white/15"
        aria-hidden="true"
      />
      <span
        className="relative inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-fg shadow-xs transition-transform duration-300 ease-out group-hover/add:rotate-90 group-focus-visible/add:rotate-90"
        aria-hidden="true"
      >
        <Plus className="size-3.5" strokeWidth={2.75} />
      </span>
      <span className="relative">{label}</span>
    </button>
  );
}

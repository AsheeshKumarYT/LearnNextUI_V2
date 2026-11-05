import { Eye, FileText, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';

export const isImage = (f) => f.type?.startsWith('image/');

/**
 * A file on a ticket — a thumbnail for images, a document icon otherwise, with its name and size. Click to view it
 * (onOpen → the file preview). `onRemove` adds an ✕ (files waiting to be sent). `tone="onBrand"` for use inside our
 * solid-blue chat bubbles.
 */
export function TicketFile({ file, onOpen, onRemove, tone = 'default', className }) {
  const onBrand = tone === 'onBrand';
  return (
    <span
      className={cn(
        'group relative inline-flex max-w-full items-center gap-2 rounded-xl p-1.5 pr-3 text-left transition-colors',
        onBrand ? 'bg-white/15 text-white ring-1 ring-inset ring-white/25 hover:bg-white/25' : 'bg-surface text-text ring-1 ring-inset ring-border-strong hover:ring-primary/40 dark:bg-surface-secondary',
        className,
      )}
    >
      <button type="button" onClick={() => onOpen?.(file)} className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" aria-label={`View ${file.name}`} />
      {isImage(file) ? (
        <img src={file.url} alt="" className="size-9 shrink-0 rounded-lg object-cover" loading="lazy" />
      ) : (
        <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg', onBrand ? 'bg-white/20' : 'bg-danger-soft text-danger')}>
          <FileText className="size-4" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block max-w-[11rem] truncate text-xs font-medium">{file.name}</span>
        <span className={cn('flex items-center gap-1 text-[11px]', onBrand ? 'text-white/75' : 'text-text-muted')}>
          {file.size ? formatFileSize(file.size) : 'File'}
          <Eye className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(file)}
          aria-label={`Remove ${file.name}`}
          className="relative z-10 -mr-1 ml-1 inline-flex size-6 items-center justify-center rounded-full text-text-muted hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

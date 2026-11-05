import { FileText, FileImage, FileVideo, FileArchive, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';
import { ProgressBar } from './ProgressBar';

const iconFor = (type = '') => {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.includes('zip') || type.includes('compressed')) return FileArchive;
  if (type.includes('pdf') || type.startsWith('text/')) return FileText;
  return FileIcon;
};

/**
 * One row in a file list. file: { name, size, type, progress?, error? }
 */
export function FilePreview({ file, onRemove, className }) {
  const Icon = iconFor(file.type);
  const uploading = typeof file.progress === 'number' && file.progress < 100;
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 pr-2', file.error && 'border-danger/50', className)}>
      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-md', file.error ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-text')}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-text">{file.name}</p>
        {file.error ? (
          <p className="text-xs text-danger">{file.error}</p>
        ) : uploading ? (
          <ProgressBar value={file.progress} size="xs" className="mt-1.5" />
        ) : (
          <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

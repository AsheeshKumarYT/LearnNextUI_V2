import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Thumbnail with optional remove button. shape: square | circle */
export function ImagePreview({ src, alt = '', onRemove, shape = 'square', className }) {
  return (
    <div className={cn('group relative overflow-hidden border border-border bg-surface-sunken', shape === 'circle' ? 'rounded-full' : 'rounded-lg', className)}>
      <img src={src} alt={alt} className="size-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

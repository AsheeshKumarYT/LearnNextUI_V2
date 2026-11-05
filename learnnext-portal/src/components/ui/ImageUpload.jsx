import { useId, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';
import { ImagePreview } from './ImagePreview';
import { Avatar } from './Avatar';
import { Button } from './Button';

/**
 * Single image picker that yields a data URL (works offline, easy to persist).
 *
 * variant="avatar": round avatar + Change/Remove buttons (profile pages)
 * variant="cover":  wide drop area with preview (course thumbnails)
 * <ImageUpload value={dataUrl} onChange={setDataUrl} variant="avatar" name="Atul Mehta" />
 * Cover variant: `preview={false}` keeps the drop area visible (the parent shows the result), `hint` replaces the size line,
 * `compact` makes it one slim drag-and-drop row.
 */
export function ImageUpload({ value, onChange, variant = 'cover', name, maxSize = 2 * 1024 * 1024, onError, preview = true, hint, compact = false, className }) {
  const id = useId();
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const read = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return fail('Please choose an image file.');
    if (file.size > maxSize) return fail(`Image must be under ${formatFileSize(maxSize)}.`);
    const reader = new FileReader();
    reader.onload = () => {
      setError('');
      onChange?.(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const fail = (msg) => {
    setError(msg);
    onError?.(msg);
  };

  const input = (
    <input id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => { read(e.target.files?.[0]); e.target.value = ''; }} />
  );

  if (variant === 'avatar') {
    return (
      <div className={cn('flex flex-wrap items-center gap-4', className)}>
        <Avatar src={value} name={name} size="xl" className="ring-4 ring-surface shadow-raised rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button as="label" htmlFor={id} variant="secondary" size="sm" className="cursor-pointer focus-within:ring-[3px] focus-within:ring-focus">
              Change photo
              {input}
            </Button>
            {value && (
              <Button variant="ghost" size="sm" onClick={() => onChange?.(null)}>
                Remove
              </Button>
            )}
          </div>
          <p className={cn('text-xs', error ? 'text-danger' : 'text-text-muted')}>{error || `JPG, PNG or WebP. Max ${formatFileSize(maxSize)}.`}</p>
        </div>
      </div>
    );
  }

  // compact: one slim drag-and-drop row (icon, "Drag & drop or browse", hint) that lights up while a file is dragged over it
  if (compact) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <label
          htmlFor={id}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            read(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3.5 rounded-card border border-dashed px-4 py-3.5 text-left transition-colors focus-within:ring-[3px] focus-within:ring-focus',
            dragging ? 'border-primary bg-primary-soft/60' : 'border-border-strong bg-surface-secondary hover:border-primary/60 hover:bg-primary-soft/40',
          )}
        >
          <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors', dragging ? 'bg-primary text-primary-fg' : 'bg-surface text-text-muted dark:bg-surface-secondary')}>
            <ImagePlus className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-medium text-text">
              {dragging ? 'Drop to upload' : (
                <>
                  Drag &amp; drop a photo, or <span className="font-semibold text-primary-text underline-offset-2 hover:underline">browse</span>
                </>
              )}
            </span>
            <span className="mt-0.5 block text-xs text-text-muted">{hint ?? `JPG, PNG or WebP · max ${formatFileSize(maxSize)}`}</span>
          </span>
          {input}
        </label>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {value && preview ? (
        <ImagePreview src={value} alt="Selected image" onRemove={() => onChange?.(null)} className="aspect-video w-full" />
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            read(e.dataTransfer.files?.[0]);
          }}
          className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border-strong bg-surface-secondary text-center transition-colors hover:border-primary/60 hover:bg-primary-soft/40 focus-within:ring-[3px] focus-within:ring-focus"
        >
          <ImagePlus className="size-6 text-text-muted" aria-hidden="true" />
          <span className="text-[13px] font-medium text-text">Upload image</span>
          <span className="text-xs text-text-muted">{hint ?? `16:9 recommended · max ${formatFileSize(maxSize)}`}</span>
          {input}
        </label>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

import { useId, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';
import { FilePreview } from './FilePreview';

/**
 * Drag & drop file picker with validation and a file list.
 *
 * <FileUpload value={files} onChange={setFiles} accept=".pdf,.docx" maxSize={10 * 1024 * 1024} multiple />
 * `value` is an array of { id, file, name, size, type, error? }. Upload itself is up to the caller.
 */
export function FileUpload({
  value = [],
  onChange,
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 10,
  hint,
  disabled,
  className,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const id = useId();

  const addFiles = (fileList) => {
    const incoming = [...fileList].map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      error: file.size > maxSize ? `Exceeds ${formatFileSize(maxSize)} limit` : undefined,
    }));
    const merged = multiple ? [...value, ...incoming.filter((f) => !value.some((v) => v.id === f.id))] : incoming.slice(0, 1);
    onChange?.(merged.slice(0, maxFiles));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed px-4 py-7 text-center transition-colors',
          'focus-within:ring-[3px] focus-within:ring-focus',
          dragging ? 'border-primary bg-primary-soft' : 'border-border-strong bg-surface-secondary hover:border-primary/60 hover:bg-primary-soft/40',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-primary-text shadow-xs transition-transform group-hover:-translate-y-0.5">
          <UploadCloud className="size-5" aria-hidden="true" />
        </span>
        <span className="text-[13px] text-text">
          <span className="font-semibold text-primary-text">Click to upload</span> or drag and drop
        </span>
        <span className="text-xs text-text-muted">{hint ?? `Up to ${formatFileSize(maxSize)} per file`}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>
      {value.length > 0 && (
        <div className="grid gap-2">
          {value.map((f) => (
            <FilePreview key={f.id} file={f} onRemove={() => onChange?.(value.filter((x) => x.id !== f.id))} />
          ))}
        </div>
      )}
    </div>
  );
}

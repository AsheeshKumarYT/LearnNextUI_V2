import { useId } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Overlay, OverlayFooter } from './Overlay';
import { Button } from './Button';

/**
 * Replacement for window.confirm().
 * <ConfirmDialog open={!!target} onClose={…} onConfirm={async () => …} tone="danger"
 *   title="Delete course?" description="This cannot be undone." confirmLabel="Delete" loading={busy} />
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading,
  children,
}) {
  const id = useId();
  const Icon = tone === 'danger' ? AlertTriangle : Info;
  return (
    <Overlay
      open={open}
      onClose={loading ? undefined : onClose}
      role="alertdialog"
      labelledBy={`${id}-t`}
      describedBy={`${id}-d`}
      containerClassName="items-end justify-center sm:items-center sm:p-6"
      panelClassName="w-full overflow-hidden rounded-t-2xl border border-border sm:max-w-md sm:rounded-2xl"
      enterClassName="animate-slide-in-bottom sm:animate-scale-in"
      exitClassName="opacity-0 translate-y-4 sm:translate-y-1 sm:scale-[0.98]"
    >
      <div className="flex gap-4 px-5 pb-5 pt-6 sm:px-6">
        <span
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-full',
            tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-text',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 id={`${id}-t`} className="text-base font-semibold text-text">
            {title}
          </h2>
          <div id={`${id}-d`} className="mt-1.5 text-[13px] leading-5 text-text-secondary">
            {description}
          </div>
          {children}
        </div>
      </div>
      <OverlayFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading} data-autofocus>
          {cancelLabel}
        </Button>
        <Button variant={tone === 'danger' ? 'destructive' : 'primary'} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </OverlayFooter>
    </Overlay>
  );
}

import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpDown, ExternalLink, Eye, Link2, Pencil, PlayCircle, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { formatFileSize } from '@/utils/formatNumber';
import { useAuth } from '@/hooks/useAuth';
import { useRetained } from '@/hooks/useRetained';
import { useToast } from '@/hooks/useToast';
import { programsApi } from '@/services/api';
import { Button, ConfirmDialog, Drawer, IconButton, Popover, Select } from '@/components/ui';
import { FilePreviewModal, embedUrl } from '@/shared/clients/components/FilePreview';
import { FILE_KINDS, KIND_ORDER, plural, smartTitle, stageIn, videoHost } from './contentStages';

/**
 * "Move" (drawer footer): a small panel with two choices — Module and Position — and a Move button, so any spot (e.g. 1st →
 * 3rd, or 2nd in another module) is one go. (A menu of single steps closed after every step and read confusingly.)
 * `onMove(stage, index)` takes the index as if the element were still in place, so a later spot in its own module is +1.
 */
function MovePanel({ name, stages, stage, position, stageCounts, onMove }) {
  const [to, setTo] = useState(stage);
  const [at, setAt] = useState(position.index);
  const same = to === stage;
  const slots = same ? position.count : (stageCounts?.[to] ?? 0) + 1;
  const pick = (key) => {
    setTo(key);
    setAt(key === stage ? position.index : (stageCounts?.[key] ?? 0)); // another module: its end by default
  };
  const changed = !same || at !== position.index;
  return (
    <Popover
      placement="top-end"
      className="w-72 p-4"
      triggerClassName="max-sm:w-full"
      trigger={
        <Button variant="secondary" leftIcon={ArrowUpDown} className="max-sm:w-full">
          Move
        </Button>
      }
    >
      {({ close }) => (
        <div className="flex flex-col gap-3">
          <p className="truncate text-[13px] font-semibold text-text" title={name}>
            Move “{name}”
          </p>
          <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            Module
            <Select size="sm" value={to} onChange={(ev) => pick(ev.target.value)} options={(stages ?? []).map((x) => ({ value: x.key, label: x.key === stage ? `${x.label} (now)` : x.label }))} />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
            Position
            <Select
              size="sm"
              value={String(at)}
              onChange={(ev) => setAt(Number(ev.target.value))}
              options={Array.from({ length: slots }, (_, i) => ({
                value: String(i),
                label: `${ordinal(i + 1)}${i === 0 ? ' · first' : i === slots - 1 ? ' · last' : ''}${same && i === position.index ? ' (now)' : ''}`,
              }))}
            />
          </label>
          <div className="mt-1 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!changed}
              onClick={() => {
                onMove(to, same && at > position.index ? at + 1 : at);
                close();
              }}
            >
              Move
            </Button>
          </div>
        </div>
      )}
    </Popover>
  );
}

/**
 * The element's description (the card on the board cuts it at two lines; here it's in full). A long one stops at three
 * lines with "Show more" — shown only when it actually runs over — so it never pushes the files far down.
 */
function Description({ text }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setLong(el.scrollHeight > el.clientHeight + 1);
  }, [text, open]);
  return (
    // Plain text (a "DESCRIPTION" heading and a tinted panel were both tried and rejected)
    <section aria-label="Description">
      <p ref={ref} className={cn('whitespace-pre-line text-[13px] leading-6 text-text-secondary', !open && 'line-clamp-3')}>
        {text}
      </p>
      {(long || open) && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-1 rounded text-xs font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {open ? 'Show less' : 'Show more'}
        </button>
      )}
    </section>
  );
}

/** 1 → "1st", 2 → "2nd", 11 → "11th" … */
const ordinal = (n) => {
  const t = n % 100;
  return `${n}${t >= 11 && t <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

/**
 * One element in full (opened from its card): which stage it's in and who added it, and at the very end one slim
 * line with its place in that stage, ↑ ↓ and "Move to" (`position` = { index, count }; `stageCounts` = elements per stage key; `onMove(stage, index)`), the description, then its files grouped by kind
 * (documents, videos, links) as calm rows — documents open in the preview, videos play in it, links open in a new tab.
 * `stages` = the program's stages (its modules). The footer has Delete (asks first), Move and "Edit element" (`onEdit` — opens the element modal).
 */
export function ElementDrawer({ open, stages, stage, element, program, position, stageCounts, onMove, onClose, onEdit, onRemoved }) {
  const toast = useToast();
  const { user } = useAuth();
  const e = useRetained(element); // keep the content while the drawer slides out
  const s = stageIn(stages, stage);
  const [preview, setPreview] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const movable = Boolean(e && position && position.index >= 0 && (position.count > 1 || stages?.length > 1));

  const remove = async () => {
    setRemoving(true);
    try {
      await programsApi.removeElement(program.id, stage, e.id, user?.name ?? 'You');
      toast.success('Element deleted', {
        description: `${e.name} · ${s.label}`,
      });
      setConfirm(false);
      onRemoved?.();
    } catch (er) {
      toast.error('Couldn’t delete the element', { description: er.message });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        icon={s.icon}
        title={e?.name ?? ''}
        // Where it sits is the header line ("During · 2nd of 3" — short, one line); moving it is an action, so it lives in
        // the footer ("Move"). Who added it is a quiet caption at the end of the body. (Earlier tries put the position in
        // the body and read as content; "added by … on …" in the header made it wrap.)
        description={e ? [s.label, movable ? `${ordinal(position.index + 1)} of ${position.count}` : null].filter(Boolean).join(' · ') : ''}
        footer={
          <>
            {/* Phones: Delete shrinks to its bin icon (it still asks first), so Move and Edit element get the room */}
            <Button
              variant="ghost"
              leftIcon={Trash2}
              aria-label="Delete element"
              onClick={() => setConfirm(true)}
              className="mr-auto text-danger hover:bg-danger-soft hover:text-danger max-sm:!flex-none max-sm:px-3 max-sm:[&>svg]:m-0"
            >
              <span className="max-sm:sr-only">Delete</span>
            </Button>
            {movable && <MovePanel key={`${stage}-${position.index}`} name={e.name} stages={stages} stage={stage} position={position} stageCounts={stageCounts} onMove={onMove} />}
            {/* No Close button — the × in the header (and Esc) already closes the drawer */}
            <Button leftIcon={Pencil} onClick={onEdit}>
              Edit element
            </Button>
          </>
        }
      >
        {e && (
          <div className="flex flex-col gap-6">
            {e.description && <Description key={e.id} text={e.description} />}

            {KIND_ORDER.map((k) => {
              const files = e.files.filter((f) => f.kind === k);
              if (!files.length) return null;
              const K = FILE_KINDS[k];
              return (
                <section key={k} aria-label={K.plural}>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                    {K.plural} <span className="ml-1 font-medium tabular-nums">{files.length}</span>
                  </h3>
                  <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border-strong bg-surface dark:bg-surface-secondary">
                    {files.map((f) => {
                      const linked = k === 'url' || f.source === 'link';
                      // A pasted video plays here when it's YouTube / Vimeo or a direct video file; other pages open in a tab
                      const playable = k === 'video' && f.url && (f.source !== 'link' || embedUrl(f.url) || /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(f.url));
                      return (
                        <li key={f.id} className="flex items-center gap-3 px-3 py-2.5">
                          <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg', K.tile)} aria-hidden="true">
                            <K.icon className="size-[18px]" />
                          </span>
                          {/* Its name (what participants see), then the original file name · size, or the link */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-text" title={f.title ?? smartTitle(f)}>
                              {f.title ?? smartTitle(f)}
                            </p>
                            <p className="flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
                              {f.source === 'link' && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded bg-chart-2/12 px-1 py-px text-[10px] font-semibold text-info">
                                  <Link2 className="size-3" aria-hidden="true" />
                                  {videoHost(f.url) ?? 'Link'}
                                </span>
                              )}
                              <span className="truncate" title={linked ? f.url : f.name}>
                                {linked ? f.url : `${f.name} · ${formatFileSize(f.size)}`}
                              </span>
                            </p>
                          </div>
                          {k === 'document' || playable ? (
                            <IconButton
                              icon={k === 'video' ? PlayCircle : Eye}
                              label={`${k === 'video' ? 'Play' : 'View'} ${f.title ?? f.name}`}
                              size="sm"
                              // Uploaded files keep their file name (downloads need it); a pasted video shows its given name
                              onClick={() => setPreview(f.source === 'link' ? { ...f, name: f.title ?? smartTitle(f) } : f)}
                            />
                          ) : f.url ? (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open ${f.title ?? smartTitle(f)} in a new tab`}
                              title="Open in a new tab"
                              className="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            >
                              <ExternalLink className="size-4" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="shrink-0 text-[11px] text-text-muted" title="Demo file — nothing to play">
                              Demo
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}

            {/* Who added / last edited it — a quiet caption at the end (in the header it made the line wrap) */}
            <p className="text-xs text-text-muted">
              {e.updatedAt ? `Edited by ${e.updatedBy} on ${formatDate(e.updatedAt)}` : `Added by ${e.createdBy} on ${formatDate(e.createdAt)}`}
            </p>
          </div>
        )}
      </Drawer>

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={remove}
        loading={removing}
        title="Delete this element?"
        description={e ? `${e.name} and its ${plural(e.files.length, 'file')} will be removed from ${s.label}.` : ''}
        confirmLabel="Delete"
        tone="danger"
      />
    </>
  );
}

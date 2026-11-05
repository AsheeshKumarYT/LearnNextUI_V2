import { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Paperclip, RotateCcw, SendHorizontal, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, formatRelative, formatTime, isSameDay } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Avatar, Button, IconButton, StatusBadge } from '@/components/ui';
import { Drawer } from '@/components/ui/Drawer';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { TicketFile } from './TicketFile';
import { supportActions } from './supportStore';

export const FROM_LABEL = { participant: 'Participant', facilitator: 'Facilitator' };
const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB each

/**
 * A ticket's chat — picked from previews: "Messenger". A plain header line with the person (photo, name, who they are),
 * a labelled Close ticket and ✕; the ticket (subject, number, status) on a quiet strip below it; the conversation on a faint dotted backdrop — their messages in white bubbles
 * on the left, ours in solid brand-blue bubbles on the right, files inside the bubbles (click to view), day
 * separators; at the bottom a round attach button (files wait as removable chips), a rounded message box (Enter
 * sends, Shift + Enter for a new line — no hint shown) and a round send button. A closed ticket shows who closed it
 * and can be reopened.
 */
export function TicketChatDrawer({ ticket: t, onClose }) {
  const { user } = useAuth();
  const toast = useToast();
  const me = user?.name ?? 'Training Partner';
  const titleId = useId();
  const [draft, setDraft] = useState('');
  const [files, setFiles] = useState([]); // waiting to be sent: { name, type, size, url }
  const [preview, setPreview] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  // Start at the newest message, and follow new ones
  useEffect(() => {
    if (t) setTimeout(() => endRef.current?.scrollIntoView({ block: 'end' }), 60);
  }, [t?.id, t?.messages.length]);
  useEffect(() => {
    setDraft('');
    setFiles([]);
  }, [t?.id]);

  const pick = (list) => {
    const chosen = [...list];
    const tooBig = chosen.filter((f) => f.size > MAX_SIZE);
    if (tooBig.length) toast.error('File too large', { description: `${tooBig.map((f) => f.name).join(', ')} — up to 10 MB each.` });
    const ok = chosen.filter((f) => f.size <= MAX_SIZE).map((f) => ({ name: f.name, type: f.type, size: f.size, url: URL.createObjectURL(f) }));
    setFiles((cur) => {
      const next = [...cur, ...ok];
      if (next.length > MAX_FILES) toast.error(`Up to ${MAX_FILES} files per reply`);
      return next.slice(0, MAX_FILES);
    });
  };

  const send = () => {
    const text = draft.trim();
    if ((!text && !files.length) || !t) return;
    supportActions.reply(t.id, me, text, files);
    setDraft('');
    setFiles([]);
    inputRef.current?.focus();
  };
  const close = () => {
    supportActions.close(t.id, me);
    toast.success('Ticket closed', { description: `${t.number} · ${t.name}` });
  };

  const closed = t?.status === 'closed';

  return (
    <Drawer open={!!t} onClose={onClose} size="lg" header={false} labelledBy={titleId}>
      {t && (
        <div className="relative isolate flex h-full flex-col">
          {/* A light brand wash from the top-left corner, behind the header and the ticket strip */}
          <span
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-br from-primary/[0.10] via-chart-2/[0.04] via-40% to-transparent to-70%"
            aria-hidden="true"
          />
          {/* Who we're talking to — one calm line: photo, name, who they are; Close ticket (labelled) and ✕ */}
          <header className="flex shrink-0 items-center gap-3 border-b border-border/70 px-5 py-3.5 sm:px-6">
            <Avatar name={t.name} src={t.photo} size="md" />
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="truncate text-sm font-semibold text-text">
                {t.name}
              </h2>
              <p className="truncate text-xs text-text-muted">
                {FROM_LABEL[t.from]}
                {t.org && ` · ${t.org}`}
              </p>
            </div>
            {!closed && (
              <Button variant="secondary" size="sm" leftIcon={CheckCircle2} onClick={close}>
                Close ticket
              </Button>
            )}
            <IconButton icon={X} label="Close chat" onClick={onClose} />
          </header>
          {/* The ticket, on its own quiet strip: subject, number and status */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border/70 px-5 py-2.5 sm:px-6">
            <p className="min-w-0 flex-1 truncate text-[13px] text-text-secondary">
              <span className="font-medium text-text">{t.subject}</span>
              <span className="text-text-muted"> · {t.number}</span>
            </p>
            <StatusBadge status={t.status} />
          </div>

          {/* The conversation, on a faint dotted backdrop */}
          <div className="relative min-h-0 flex-1 overflow-y-auto">
            <span
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-chart-1)_1px,transparent_1.3px)] bg-[length:16px_16px] opacity-[0.10]"
              aria-hidden="true"
            />
            <ol className="relative flex flex-col gap-3 px-5 py-5 sm:px-6" aria-label="Conversation">
              {t.messages.map((m, i) => {
                const newDay = i === 0 || !isSameDay(m.at, t.messages[i - 1].at);
                const ours = m.by === 'admin';
                return (
                  <li key={m.id} className="flex flex-col gap-3">
                    {newDay && (
                      <span className="mx-auto rounded-full bg-surface/90 px-3 py-0.5 text-[11px] font-medium text-text-muted shadow-xs ring-1 ring-border dark:bg-surface-secondary" aria-hidden="true">
                        {formatDate(m.at)}
                      </span>
                    )}
                    <div className={cn('flex items-end gap-2', ours && 'flex-row-reverse')}>
                      {!ours && <Avatar name={t.name} src={t.photo} size="xs" className="mb-5 rounded-full" />}
                      <div className={cn('flex max-w-[82%] flex-col', ours ? 'items-end' : 'items-start')}>
                        <div
                          className={cn(
                            'flex flex-col gap-2 rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 shadow-xs',
                            ours ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-surface text-text ring-1 ring-inset ring-border-strong dark:bg-surface-secondary',
                          )}
                        >
                          {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
                          {m.files?.length > 0 && (
                            <div className="flex flex-col gap-1.5">
                              {m.files.map((f) => (
                                <TicketFile key={f.id} file={f} onOpen={setPreview} tone={ours ? 'onBrand' : 'default'} className={ours ? '' : 'bg-surface-secondary dark:bg-surface-sunken'} />
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="mt-1 px-1 text-[11px] text-text-muted">
                          {ours ? `${m.author} · ` : ''}
                          {formatTime(m.at)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div ref={endRef} />
          </div>

          {/* Reply — or, when closed, who closed it and Reopen */}
          <footer className="shrink-0 border-t border-border bg-surface px-4 py-3 sm:px-5 dark:bg-surface-secondary">
            {closed ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-text-secondary">
                  Closed by <span className="font-medium text-text">{t.closedBy}</span>
                  {t.closedAt && <span className="text-text-muted"> · {formatRelative(t.closedAt)}</span>}
                </p>
                <Button variant="secondary" size="sm" leftIcon={RotateCcw} onClick={() => supportActions.reopen(t.id)}>
                  Reopen ticket
                </Button>
              </div>
            ) : (
              <>
                {files.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {files.map((f, i) => (
                      <TicketFile key={f.url} file={f} onOpen={setPreview} onRemove={() => setFiles((cur) => cur.filter((_, j) => j !== i))} />
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    className="hidden"
                    onChange={(e) => {
                      pick(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Attach files"
                    title="Attach files (up to 5, 10 MB each)"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary shadow-xs ring-1 ring-inset ring-border-strong transition-colors hover:text-primary-text hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus dark:bg-surface-sunken"
                  >
                    <Paperclip className="size-[18px]" aria-hidden="true" />
                  </button>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder={`Reply to ${t.name.split(' ')[0]}…`}
                    aria-label={`Reply to ${t.name}`}
                    className="max-h-32 min-h-10 flex-1 resize-none rounded-[20px] border border-border-strong bg-surface px-4 py-2.5 text-sm text-text outline-none field-sizing-content placeholder:text-text-muted focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(42_105_178/0.08)] dark:bg-surface-sunken"
                  />
                  <button
                    type="button"
                    onClick={send}
                    disabled={!draft.trim() && !files.length}
                    aria-label="Send reply"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:bg-primary/30 disabled:shadow-none"
                  >
                    <SendHorizontal className="size-[18px]" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </footer>
        </div>
      )}
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </Drawer>
  );
}

import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, MessagesSquare, Reply, RotateCcw, Tag, TicketCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDateTime, formatRelative } from '@/utils/formatDate';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Avatar, Button, Modal, StatusBadge } from '@/components/ui';
import { FilePreviewModal } from '@/shared/clients/components/FilePreview';
import { FROM_LABEL } from './TicketChatDrawer';
import { TicketFile } from './TicketFile';
import { awaitingReply, lastMessage, supportActions, ticketFiles } from './supportStore';

/**
 * A ticket's details — the modal clicking a row on the Support desk opens. Its status, who raised it, when, the
 * category, the requester's description and the files they attached (click to view); then Open chat (to reply) and
 * Close / Reopen in the footer.
 */
export function TicketDetailsModal({ ticket: t, onClose, onOpenChat }) {
  const { user } = useAuth();
  const toast = useToast();
  const me = user?.name ?? 'Training Partner';
  const [preview, setPreview] = useState(null);

  const files = t ? ticketFiles(t, 'user') : [];
  const repliers = t ? [...new Set(t.messages.filter((m) => m.by === 'admin').map((m) => m.author))] : [];
  const last = t && lastMessage(t);

  return (
    <Modal
      open={!!t}
      onClose={onClose}
      size="md"
      panelClassName="relative isolate"
      icon={TicketCheck}
      title={t?.subject}
      description={t?.number}
      footer={
        t && (
          <>
            {t.status === 'open' ? (
              <Button
                variant="ghost"
                leftIcon={CheckCircle2}
                onClick={() => {
                  supportActions.close(t.id, me);
                  toast.success('Ticket closed', { description: `${t.number} · ${t.name}` });
                }}
              >
                Close ticket
              </Button>
            ) : (
              <Button variant="ghost" leftIcon={RotateCcw} onClick={() => supportActions.reopen(t.id)}>
                Reopen ticket
              </Button>
            )}
            <Button leftIcon={MessagesSquare} onClick={() => onOpenChat(t)}>
              Open chat · {t.messages.length}
            </Button>
          </>
        )
      }
    >
      {t && (
        // Calm, three parts (the boxed person card and the label grid were "so congested"): who raised it with the
        // status; what they wrote (+ files, only if any); one quiet line with the category, dates and who replied
        <div className="flex flex-col gap-5">
          {/* A light brand wash from the top-left corner of the window (behind everything) */}
          <span
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-primary/[0.09] via-chart-2/[0.03] via-35% to-transparent to-60%"
            aria-hidden="true"
          />
          {/* Who raised it — one line, status on the right */}
          <div className="flex items-center gap-3">
            <Avatar name={t.name} src={t.photo} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{t.name}</p>
              <p className="truncate text-xs text-text-muted" title={t.email}>
                {FROM_LABEL[t.from]}
                {t.org && ` · ${t.org}`}
              </p>
            </div>
            <StatusBadge status={t.status} />
          </div>

          {/* What they wrote — set off by a slim accent line, like a quoted message */}
          <p className="whitespace-pre-wrap border-l-2 border-primary/30 pl-4 text-sm leading-6 text-text">{t.description}</p>

          {/* What they attached — only when there's something */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f) => (
                <TicketFile key={f.id} file={f} onOpen={setPreview} />
              ))}
            </div>
          )}

          {/* The facts, as one quiet line */}
          {/* Each fact with a small icon; stays whole when the line wraps */}
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-4 text-xs text-text-muted">
            <Meta icon={Tag}>
              {t.category} › {t.subCategory}
            </Meta>
            <Meta icon={CalendarDays}>Raised {formatDateTime(t.createdAt)}</Meta>
            {awaitingReply(t) ? (
              <Meta icon={Clock} className="font-medium text-warning">
                Awaiting our reply
              </Meta>
            ) : t.status === 'closed' ? (
              <Meta icon={CheckCircle2}>
                Closed by {t.closedBy} · {formatRelative(t.closedAt)}
              </Meta>
            ) : (
              <Meta icon={Reply}>Replied by {repliers.join(', ') || last.author}</Meta>
            )}
          </p>
        </div>
      )}
      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </Modal>
  );
}

/** One fact on the meta line: a small icon + text, kept on one line */
function Meta({ icon: Icon, className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap', className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

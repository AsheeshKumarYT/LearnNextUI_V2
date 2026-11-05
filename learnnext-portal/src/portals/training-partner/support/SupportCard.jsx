import { useLocation } from 'react-router-dom';
import { ArrowRight, CheckCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui';
import { awaitingReply, lastMessage, useTickets } from '@/portals/training-partner/support/supportStore';

/**
 * "Support desk" card for the sidebar footer — the admin side of support (requests from clients and facilitators we
 * answer). Picked from previews: "Chat bubble". The card is a message bubble (one squared-off corner bottom-left) in the
 * theme's soft brand wash (same as before), with three "typing" dots by the title; up to three circles of who's waiting
 * ("+N" as the third when more) with "N waiting", and a round brand arrow button. The whole card opens the Support desk page.
 */
export function SupportCard({ onOpen }) {
  const here = useLocation().pathname.startsWith('/support');
  // Waiting on us: open tickets whose last word is the requester's — newest first
  const waiting = useTickets()
    .filter(awaitingReply)
    .sort((a, b) => lastMessage(b).at.localeCompare(lastMessage(a).at));
  // Three circles at most: three faces, or two faces + a "+N" circle
  const faces = waiting.slice(0, waiting.length > 3 ? 2 : 3);
  const more = waiting.length - faces.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={here ? 'page' : undefined}
      aria-label={`Support desk — ${waiting.length ? `${waiting.length} waiting` : 'all caught up'}`}
      // On the Support desk page it stays in its hover look (firmer edge + soft shadow) so it reads as the current page
      className={cn(
        'group relative w-full rounded-2xl rounded-bl-[5px] border bg-gradient-to-br from-primary/[0.07] to-chart-2/[0.12] p-3 text-left transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
        here ? 'border-primary/30 shadow-sm' : 'border-primary/15',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-text">Support desk</span>
        {/* "Typing" dots — someone's waiting for an answer (green tick when all caught up) */}
        {waiting.length ? (
          <span className="flex gap-[3px]" aria-hidden="true">
            <span className="size-1 rounded-full bg-primary/70" />
            <span className="size-1 rounded-full bg-primary/45" />
            <span className="size-1 rounded-full bg-primary/25" />
          </span>
        ) : (
          <CheckCheck className="size-4 text-success" aria-hidden="true" />
        )}
      </span>

      <span className="mt-2.5 flex items-center justify-between gap-2">
        {waiting.length ? (
          <span className="flex min-w-0 items-center gap-2">
            {/* Who's waiting: initials overlapped (up to three circles, the third "+N" when more) */}
            {/* 22px circles, overlapped well — each one sits over the one before (the "+N" on top of the middle face) */}
            <span className="flex -space-x-2">
              {faces.map((r) => (
                <Avatar key={r.id} name={r.name} src={r.photo} size="xs" className="relative rounded-full ring-2 ring-surface dark:ring-surface-secondary [&>*]:size-[22px] [&>*]:text-[9px]" />
              ))}
              {more > 0 && (
                <span className="relative z-10 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-surface px-1 text-[9px] font-semibold tabular-nums text-text-secondary ring-2 ring-surface dark:bg-surface-secondary dark:ring-surface-secondary">
                  +{more}
                </span>
              )}
            </span>
            <span className="whitespace-nowrap text-xs text-text-secondary">
              <span className="font-semibold tabular-nums text-text">{waiting.length}</span> waiting
            </span>
          </span>
        ) : (
          <span className="text-xs text-text-secondary">All caught up</span>
        )}
        {/* The way in: a soft round arrow button. Hover: the card's edge firms up with a soft shadow, this ring deepens
            and the arrow glides forward. On the Support desk page the arrow becomes a small brand dot — "you're here" */}
        <span
          className={cn(
            'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-primary-text shadow-xs ring-1 transition-[box-shadow] duration-200 dark:bg-surface-secondary',
            here ? 'ring-primary/45' : 'ring-primary/20 group-hover:ring-primary/45',
          )}
          aria-hidden="true"
        >
          {here ? (
            // A soft ripple keeps spreading out from the dot and fading
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
          ) : (
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-[3px]" />
          )}
        </span>
      </span>
    </button>
  );
}

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, MessageSquareText, Paperclip, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/formatDate';
import { Avatar } from '@/components/ui';
import { FROM_LABEL } from './TicketChatDrawer';
import { awaitingReply, lastMessage, ticketFiles } from './supportStore';

// The lanes, in the order work flows: waiting on us → waiting on them → done. Soft tints (static class names for Tailwind).
const LANES = [
  {
    key: 'awaiting',
    label: 'Awaiting reply',
    hint: 'The last word is theirs',
    test: awaitingReply,
    lane: 'bg-chart-3/[0.07] ring-chart-3/15',
    dot: 'bg-chart-3 ring-chart-3/25',
    count: 'text-warning',
  },
  {
    key: 'waiting',
    label: 'Waiting on them',
    hint: 'We’ve replied',
    test: (t) => t.status === 'open' && !awaitingReply(t),
    lane: 'bg-chart-1/[0.05] ring-chart-1/12',
    dot: 'bg-chart-1 ring-chart-1/20',
    count: 'text-primary-text',
  },
  {
    key: 'closed',
    label: 'Closed',
    hint: 'Sorted',
    test: (t) => t.status === 'closed',
    lane: 'bg-text-muted/[0.06] ring-text-muted/12',
    dot: 'bg-text-muted ring-text-muted/20',
    count: 'text-text-secondary',
  },
];

/**
 * The Support desk as a board — picked from previews: "Board". Three softly tinted lanes in the order work flows:
 * Awaiting reply (the last word is theirs) → Waiting on them (we've replied) → Closed, each with its count; newest
 * activity on top. A card: who (photo, name, how long ago), the subject, category, who they are and any files.
 * Clicking a card opens the ticket's details; the chat button (on hover / focus) opens the conversation.
 * Drag and drop: an open ticket into Closed closes it; a closed one into an open lane reopens it (it lands in the lane
 * its last message puts it). While dragging, the lane that would take it lights up with what dropping does.
 * The lane headings stick under the app header while the page scrolls.
 * `tickets` = what the page's pills, search and filters leave.
 */
export function TicketBoard({ tickets, onOpen, onChat, onCloseTicket, onReopen }) {
  const byActivity = [...tickets].sort((a, b) => lastMessage(b).at.localeCompare(lastMessage(a).at));
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const dragged = tickets.find((t) => t.id === dragId);
  // What dropping the dragged ticket on a lane would do (null = this lane doesn't take it)
  const dropAction = (laneKey) => {
    if (!dragged) return null;
    if (laneKey === 'closed') return dragged.status === 'open' ? 'close' : null;
    return dragged.status === 'closed' ? 'reopen' : null;
  };
  const endDrag = () => {
    setDragId(null);
    setOver(null);
  };

  // Pinned? = the board's top has scrolled up under the app header (its height, or 0 while it has slid away)
  const gridRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const update = () => {
      const el = gridRef.current;
      if (!el) return;
      const top = document.documentElement.hasAttribute('data-header-hidden') ? 0 : (document.querySelector('header.sticky')?.offsetHeight ?? 64);
      setStuck(el.getBoundingClientRect().top + 12 < top);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 gap-x-4 p-4 sm:p-5 md:grid-cols-3">
      {/* Pinned: a soft band across the board behind the lane headings, its lower edge fading out — so the cards
          disappear under it (as on the client details page). Zero height in the flow — the grid has no row gap (a zero-height
          row still got one, adding space above the lanes), so stacked lanes space themselves instead. */}
      <div className="sticky top-[var(--app-header-h)] z-[9] h-0 transition-[top] duration-300 ease-out md:col-span-3" aria-hidden="true">
        <div
          className={cn(
            // The page's own colour (its soft blue-grey), fading out downwards. No blur, no extra tint — white read as
            // "so whitish", a brand-blue mix as "too bluish"
            'pointer-events-none absolute -inset-x-3 top-0 h-[4.5rem] bg-background opacity-95 transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] sm:-inset-x-5',
            !stuck && 'opacity-0',
          )}
        />
      </div>
      {LANES.map((lane) => {
        const items = byActivity.filter(lane.test);
        const action = dropAction(lane.key);
        const isOver = over === lane.key && action;
        return (
          <section
            key={lane.key}
            aria-label={lane.label}
            onDragOver={(e) => {
              if (!action) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (over !== lane.key) setOver(lane.key);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOver((o) => (o === lane.key ? null : o));
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragged && action === 'close') onCloseTicket(dragged);
              if (dragged && action === 'reopen') onReopen(dragged);
              endDrag();
            }}
            className={cn(
              'flex min-w-0 flex-col rounded-2xl p-2.5 ring-1 ring-inset transition-[box-shadow,background-color] duration-150 max-md:mt-4 max-md:first-of-type:mt-0',
              lane.lane,
              action && 'ring-2 ring-primary/25',
              isOver && 'ring-primary/55 bg-primary-soft/40',
            )}
          >
            {/* Sticks under the app header while the page scrolls. At rest it's the plain lane heading; once pinned it
                turns into a frosted pill (same height, so nothing jumps) over the faded band below */}
            <header
              className={cn(
                'sticky top-[calc(var(--app-header-h)+0.5rem)] z-10 flex items-center gap-2 rounded-xl px-1.5 pb-2.5 pt-1 transition-[top,background-color,box-shadow,padding] duration-300 ease-out',
                stuck && 'bg-surface/75 px-2.5 pb-[7px] pt-[7px] shadow-xs ring-1 ring-inset ring-border backdrop-blur-md dark:bg-surface-secondary/80',
              )}
            >
              <span className={cn('size-2 rounded-full ring-[3px]', lane.dot)} aria-hidden="true" />
              <h3 className="text-[13px] font-semibold text-text">{lane.label}</h3>
              <span className={cn('text-[13px] font-semibold tabular-nums', lane.count)}>{items.length}</span>
              <span className="ml-auto truncate text-[11px] text-text-muted">{lane.hint}</span>
            </header>
            {/* While dragging: what dropping here does */}
            {action && (
              <p
                className={cn(
                  'mb-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-3 text-xs font-medium transition-colors',
                  isOver ? 'border-primary/50 bg-surface text-primary-text' : 'border-border-strong text-text-muted',
                )}
              >
                {action === 'close' ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <RotateCcw className="size-4" aria-hidden="true" />}
                {action === 'close' ? 'Drop to close' : 'Drop to reopen'}
              </p>
            )}
            {items.length ? (
              <ul className="flex flex-col gap-2">
                {items.map((t) => (
                  <li key={t.id}>
                    <BoardCard
                      t={t}
                      onOpen={onOpen}
                      onChat={onChat}
                      dragging={dragId === t.id}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', t.id);
                        setDragId(t.id);
                      }}
                      onDragEnd={endDrag}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              !action && <p className="rounded-xl border border-dashed border-border-strong px-3 py-6 text-center text-xs text-text-muted">Nothing here</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function BoardCard({ t, onOpen, onChat, dragging, onDragStart, onDragEnd }) {
  const files = ticketFiles(t, 'user').length;
  const last = lastMessage(t);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      title="Drag to another lane"
      className={cn(
        // Frosted glass (picked from previews: "Glass cards"): see-through white over the lane's tint with a hairline light
        // edge — the lane colour shows through softly instead of a flat block the same shade as the lane
        'group relative cursor-grab rounded-xl border border-white/80 bg-surface/90 p-3 shadow-xs backdrop-blur-md transition-[box-shadow,border-color,background-color,opacity] hover:border-primary/30 hover:bg-surface hover:shadow-sm active:cursor-grabbing dark:border-white/[0.09] dark:bg-white/[0.055] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.08]',
        t.status === 'closed' && 'opacity-80',
        dragging && 'opacity-40',
      )}
    >
      {/* The whole card opens the details (the subject is the button; its ::after covers the card) */}
      <div className="flex items-center gap-2">
        <Avatar name={t.name} src={t.photo} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-text">{t.name}</p>
          <p className="truncate text-[11px] text-text-muted">
            {FROM_LABEL[t.from]}
            {t.org && ` · ${t.org}`}
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-text-muted">{formatRelative(last.at)}</span>
      </div>
      <button
        type="button"
        onClick={() => onOpen(t)}
        className="mt-2.5 block w-full text-left text-[13px] font-medium leading-5 text-text transition-colors after:absolute after:inset-0 after:rounded-xl group-hover:text-primary-text focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus"
      >
        {t.subject}
      </button>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
        <span className="min-w-0 truncate">
          {t.category} › {t.subCategory}
        </span>
        {files > 0 && (
          <span className="inline-flex shrink-0 items-center gap-0.5" title="Files attached">
            <Paperclip className="size-3" aria-hidden="true" />
            {files}
          </span>
        )}
        <span className="ml-auto shrink-0 tabular-nums">{t.number}</span>
      </div>
      {/* Quick chat — over the card's click area, taking the time's corner on hover / focus */}
      <button
        type="button"
        onClick={() => onChat(t)}
        aria-label={`Open chat — ${t.number}`}
        title="Open chat"
        className="absolute right-2 top-2.5 z-10 inline-flex size-7 items-center justify-center rounded-full bg-surface text-text-secondary opacity-0 shadow-xs ring-1 ring-inset ring-border-strong transition-opacity hover:text-primary-text focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus group-hover:opacity-100 dark:bg-surface-secondary"
      >
        <MessageSquareText className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

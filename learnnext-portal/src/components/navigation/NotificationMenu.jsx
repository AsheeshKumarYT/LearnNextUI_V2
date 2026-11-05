import { useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Popover } from '@/components/ui/Popover';
import { Overlay } from '@/components/ui/Overlay';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { NOTIFICATION_TYPES, NotificationItem } from '@/components/notifications/NotificationItem';
import { SegmentedControl } from '@/components/ui';
import { formatRelative } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

/**
 * Header bell with the latest notifications. Shares state with the Notifications page.
 * Desktop: a dropdown under the bell. Phones: a bottom sheet rising from the bottom (like the More sheet) — a narrow
 * dropdown hanging off the header cut every message to one line and floated over the page.
 */
export function NotificationMenu() {
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const mobile = useIsMobile();
  const latest = items.slice(0, 5);
  // Phone sheet: All / Unread, grouped New (unread) / Earlier (read)
  const [filter, setFilter] = useState('all');
  const fresh = items.filter((n) => !n.read);
  const earlier = items.filter((n) => n.read);

  const bell = (
    <IconButton icon={Bell} label={unreadCount ? `Notifications (${unreadCount} unread)` : 'Notifications'} onClick={mobile ? () => setOpen(true) : undefined}>
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-background">
          {unreadCount}
        </span>
      )}
    </IconButton>
  );
  const summary = unreadCount ? `${unreadCount} unread` : 'You’re all caught up';
  const markAll = unreadCount > 0 && (
    <button type="button" onClick={markAllRead} className="rounded text-[13px] font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      Mark all read
    </button>
  );
  const empty = <EmptyState compact icon={BellOff} title="No notifications" description="We’ll let you know when something needs your attention." />;

  if (mobile) {
    return (
      <>
        {bell}
        <Overlay
          open={open}
          onClose={() => setOpen(false)}
          labelledBy="notif-sheet-title"
          containerClassName="items-end justify-center"
          panelClassName="max-h-[85dvh] w-full overflow-hidden rounded-t-3xl border border-b-0 border-border bg-elevated"
          enterClassName="animate-slide-in-bottom"
          exitClassName="translate-y-full"
        >
          <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
          {/* Header: just the title and × (the unread count lives in the Unread switch; Mark all read sits beside it) */}
          <div className="flex items-center gap-3 px-5 pb-1 pt-2">
            <h2 id="notif-sheet-title" className="min-w-0 flex-1 text-[17px] font-semibold text-text">
              Notifications
            </h2>
            <IconButton icon={X} label="Close notifications" onClick={() => setOpen(false)} tooltip={false} className="-mr-2" />
          </div>
          {/* "New / Earlier + filter" (picked from previews): All / Unread switch (+ Mark all read on the right), then unread
              under NEW and the rest under EARLIER; each row = icon, title with the time on the right, up to two lines of
              message; unread rows carry a thin blue edge and a faint tint instead of dots */}
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 pb-3 pt-2">
            <SegmentedControl
              size="sm"
              tabs={[
                { value: 'all', label: 'All' },
                { value: 'unread', label: unreadCount ? `Unread · ${unreadCount}` : 'Unread' },
              ]}
              value={filter}
              onChange={setFilter}
              ariaLabel="Show notifications"
            />
            {markAll}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
            {fresh.length > 0 && <SheetGroup label="New" items={fresh} onOpen={markRead} />}
            {filter === 'all' && earlier.length > 0 && <SheetGroup label="Earlier" items={earlier} onOpen={markRead} />}
            {(filter === 'unread' ? fresh : items).length === 0 && (
              <div className="p-4">{filter === 'unread' ? <EmptyState compact icon={BellOff} title="You’re all caught up" description="No unread notifications." /> : empty}</div>
            )}
          </div>
        </Overlay>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-end" className="w-[min(380px,calc(100vw-16px))] p-0" trigger={bell} sheet={false}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-text">Notifications</p>
          <p className="text-xs text-text-muted">{summary}</p>
        </div>
        {markAll}
      </div>
      <div className="max-h-[min(420px,60dvh)] overflow-y-auto p-1.5">
        {latest.length ? latest.map((n) => <NotificationItem key={n.id} notification={n} compact onClick={() => markRead(n.id)} />) : empty}
      </div>
    </Popover>
  );
}

/** A NEW / EARLIER group in the phone sheet */
function SheetGroup({ label, items, onOpen }) {
  return (
    <section aria-label={label}>
      <p className="px-5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">{label}</p>
      <ul>
        {items.map((n) => {
          const t = NOTIFICATION_TYPES[n.type] ?? NOTIFICATION_TYPES.system;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onOpen(n.id)}
                className={cn(
                  'flex w-full gap-3 border-l-2 py-3 pl-[18px] pr-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus active:bg-surface-sunken',
                  n.read ? 'border-transparent' : 'border-primary bg-primary-soft/40',
                )}
              >
                <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full', t.cls)}>
                  <t.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className={cn('min-w-0 flex-1 truncate text-[13px] leading-5', n.read ? 'text-text-secondary' : 'font-semibold text-text')}>{n.title}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-text-muted">{formatRelative(n.at).replace(' ago', '')}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[13px] leading-5 text-text-muted">{n.body}</span>
                  {!n.read && <span className="sr-only">Unread</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

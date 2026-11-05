import { useMemo, useState } from 'react';
import { CalendarClock, CalendarOff, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatTime, isSameDay } from '@/utils/formatDate';
import { AvatarGroup, Button, Card, CardHeader } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { relativeDay } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

const PREVIEW = 4;

/**
 * Merge sessions of the same program (title + client) on the same day into one row,
 * keeping every time slot and the combined participant list.
 */
function mergeSameDaySessions(sessions) {
  const rows = [];
  [...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((s) => {
      const match = rows.find((r) => r.title === s.title && r.client === s.client && isSameDay(r.date, s.date));
      if (!match) {
        rows.push({ ...s, times: [s.date], participants: [...s.participants] });
        return;
      }
      match.times.push(s.date);
      s.participants.forEach((p) => {
        if (!match.participants.some((m) => (m.id ?? m.name) === (p.id ?? p.name))) match.participants.push(p);
      });
    });
  return rows;
}

/** Today's live programs + the next 10 days as one timeline. */
export function ProgramSchedule({ liveToday, upcoming, className }) {
  const [expanded, setExpanded] = useState(false);
  const programs = useMemo(() => mergeSameDaySessions(upcoming), [upcoming]);
  const rows = expanded ? programs : programs.slice(0, PREVIEW);
  const nextDay = programs[0]?.date;

  return (
    <Card tint="primary" softTint padding="none" className={cn('flex flex-col', className)}>
      <CardHeader
        divided
        icon={CalendarClock}
        title="Program schedule"
        badge={<PeriodChip label="Next 10 days" />}
        description={`${upcoming.length} upcoming sessions`}
      />

      {/* Today */}
      <div className="mx-5 mb-2 flex items-center gap-3 rounded-xl bg-surface-sunken/70 px-4 py-2.5 sm:mx-6">
        {liveToday.length ? (
          <>
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger-main opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-danger-main" />
            </span>
            <p className="text-[13px] font-semibold text-text">{liveToday.length} live today</p>
          </>
        ) : (
          <>
            <CalendarOff className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-[13px] text-text-secondary">Nothing live today</p>
          </>
        )}
      </div>

      {upcoming.length ? (
        <ol className="flex-1 px-3 pb-2 sm:px-4">
          {rows.map((p, i) => {
            const sameAsPrev = i > 0 && isSameDay(rows[i - 1].date, p.date);
            const soonest = isSameDay(p.date, nextDay);
            const d = new Date(p.date);
            return (
              <li
                key={p.id}
                className="flex animate-rise items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-sunken/60 sm:gap-4"
                style={{ animationDelay: `${200 + i * 60}ms` }}
              >
                {sameAsPrev ? (
                  // Same day as the row above: a connector line + dot instead of repeating the date tile
                  <div className="relative flex w-12 shrink-0 justify-center self-stretch" aria-hidden="true">
                    <span className={cn('absolute -top-3 bottom-1/2 w-px', soonest ? 'bg-primary/40' : 'bg-border-strong')} />
                    <span className={cn('relative mt-auto mb-auto size-2.5 rounded-full ring-4 ring-surface', soonest ? 'bg-primary' : 'bg-primary/40')} />
                  </div>
                ) : (
                  // Date tile — shown once per day
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-primary-soft py-1.5 text-center text-primary-text">
                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                    <span className="text-lg font-bold leading-6 tabular-nums">{d.getDate()}</span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {/* Wraps (max 2 lines) rather than truncating when the card is half-width */}
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-text" title={p.title}>
                    {p.title}
                  </p>
                  <p className="truncate text-xs text-text-muted">{p.client}</p>
                </div>

                <div className="hidden md:block">
                  <AvatarGroup people={p.participants} max={3} size="xs" />
                </div>

                <div className="w-24 shrink-0 text-right">
                  <p className={cn('text-xs font-semibold', soonest ? 'text-primary-text' : 'text-text')}>{relativeDay(p.date)}</p>
                  {/* Every time slot for this program on this day, one per line */}
                  {p.times.map((t) => (
                    <p key={t} className="text-[11px] tabular-nums text-text-muted">
                      {formatTime(t)}
                    </p>
                  ))}
                  {p.times.length > 1 && <span className="sr-only">{p.times.length} sessions</span>}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState compact icon={CalendarOff} title="Nothing scheduled" description="No programs in the next 10 days." className="flex-1" />
      )}

      {programs.length > PREVIEW && (
        <div className="border-t border-border px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            rightIcon={expanded ? ChevronUp : ChevronDown}
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Show less' : `Show all ${programs.length}`}
          </Button>
        </div>
      )}
    </Card>
  );
}

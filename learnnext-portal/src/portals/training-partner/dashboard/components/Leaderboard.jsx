import { useState } from 'react';
import { Crown, Trophy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar, Card, CardHeader, SegmentedControl } from '@/components/ui';
import { CountUp } from './CountUp';
import { PeriodChip } from './PeriodChip';

const TABS = [
  { value: 'trainer', label: 'Trainers' },
  { value: 'coach', label: 'Coaches' },
  { value: 'channel', label: 'Partners' },
];

// Toggle spans the card on phones (equal-width options), natural width from sm up
const FULL_ON_PHONE = 'flex w-full [&>button]:flex-1 sm:inline-flex sm:w-auto sm:[&>button]:flex-none';

// Podium order 2 · 1 · 3 — short, soft pedestals; medal colours from tokens (silver / gold / bronze)
const PODIUM = [
  { rank: 2, height: 'h-9', medal: 'bg-text-muted', pedestal: 'from-chart-1/20 to-chart-1/0', avatar: 'md', delay: 300 },
  { rank: 1, height: 'h-14', medal: 'bg-warning-main', pedestal: 'from-warning-main/30 to-warning-main/0', avatar: 'lg', delay: 150 },
  { rank: 3, height: 'h-6', medal: 'bg-chart-5', pedestal: 'from-chart-5/20 to-chart-5/0', avatar: 'md', delay: 450 },
];

export function Leaderboard({ leaderboard, className }) {
  const [tab, setTab] = useState('trainer');
  const rows = leaderboard[tab] ?? [];
  const rest = rows.slice(3);

  return (
    <Card tint="warning" softTint padding="none" className={cn('flex flex-col', className)}>
      <CardHeader
        divided
        icon={Trophy}
        iconTone="warning"
        title="Leaderboard"
        badge={<PeriodChip label="Current" />}
        action={<SegmentedControl size="sm" tabs={TABS} value={tab} onChange={setTab} ariaLabel="Leaderboard type" className={FULL_ON_PHONE} />}
        // Toggles on their own row (same as Usage ranking) so the title + chip never get squeezed
        className="flex-col items-stretch"
        actionClassName="w-full sm:w-auto"
      />

      <div key={tab} className="flex flex-1 animate-fade-in flex-col">
        {/* Podium */}
        <div className="grid grid-cols-3 items-end gap-3 px-5 pt-6 sm:px-6">
          {PODIUM.map((slot) => {
            const p = rows[slot.rank - 1];
            if (!p) return <div key={slot.rank} />;
            return (
              <div key={p.id} className="flex min-w-0 flex-col items-center text-center">
                <div className="relative">
                  {slot.rank === 1 && <Crown className="absolute -top-5 left-1/2 size-5 -translate-x-1/2 text-warning-main" aria-hidden="true" />}
                  <Avatar name={p.name} size={slot.avatar} className="rounded-full ring-2 ring-surface" />
                  <span
                    className={cn('absolute -bottom-1.5 -right-2 inline-flex size-[18px] items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-surface', slot.medal)}
                  >
                    {slot.rank}
                  </span>
                </div>
                {/* Two lines on narrow phones (first + last name) instead of cutting the name short */}
                <p className="mt-2 line-clamp-2 w-full text-[13px] font-semibold leading-tight text-text sm:line-clamp-1" title={p.name}>
                  {p.name}
                </p>
                <p className="text-xs font-bold text-primary-text">
                  <CountUp value={p.points} delay={slot.delay} /> pts
                </p>
                <div
                  className={cn('mt-2 w-full origin-bottom animate-bar rounded-t-lg bg-gradient-to-b', slot.height, slot.pedestal)}
                  style={{ animationDelay: `${slot.delay}ms` }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Ranks 4–5 */}
        <ol className="border-t border-border px-3 py-2 sm:px-4">
          {rest.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
              <span className="w-5 text-center text-xs font-bold tabular-nums text-text-muted">{i + 4}</span>
              <Avatar name={p.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-text">{p.name}</p>
                <p className="truncate text-xs text-text-muted">{p.meta}</p>
              </div>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-text">
                {p.points}
                <span className="ml-0.5 text-xs font-medium text-text-muted">pts</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

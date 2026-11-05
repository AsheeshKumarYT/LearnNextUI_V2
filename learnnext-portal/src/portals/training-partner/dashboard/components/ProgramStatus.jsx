import { ChartPie, CircleCheck, Hourglass } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, ProgressCircle } from '@/components/ui';
import { CountUp } from './CountUp';
import { SegmentBar } from './SegmentBar';
import { COLORS, percent } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

/** Completion ring + where every program stands + the approval queue pinned to the bottom. */
export function ProgramStatus({ programs, periodLabel, className }) {
  const done = percent(programs.completed, programs.total);
  const pendingShare = percent(programs.pending, programs.total);
  const segments = [
    { key: 'completed', label: 'Completed', value: programs.completed, color: COLORS.success },
    { key: 'inProgress', label: 'In progress', value: programs.inProgress, color: COLORS.primary },
    { key: 'upcoming', label: 'Upcoming', value: programs.upcoming, color: COLORS.info },
    { key: 'pending', label: 'Pending approval', value: programs.pending, color: COLORS.warning },
  ];
  const QueueIcon = programs.pending ? Hourglass : CircleCheck;

  return (
    <Card tint="success" softTint className={cn('flex flex-col', className)}>
      <CardHeader
        icon={ChartPie}
        iconTone="success"
        title="Program status"
        badge={<PeriodChip label={periodLabel} follows />}
        description={`${programs.total} programs`}
      />
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <ProgressCircle value={done} size={112} stroke={10} tone="success" showValue={false} animateIn label="Programs completed" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-text">
              <CountUp value={done} delay={300} />%
            </span>
            <span className="text-[11px] text-text-muted">completed</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[28px] font-bold leading-9 text-text">
            <CountUp value={programs.completed} />
          </p>
          <p className="text-[13px] text-text-secondary">of {programs.total} delivered</p>
        </div>
      </div>
      <SegmentBar segments={segments} className="mt-6" />

      {/* Approval queue — pinned to the bottom so the card always fills its row */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-3">
          <span
            className={cn(
              'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
              programs.pending ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success',
            )}
          >
            <QueueIcon className="size-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text">
              {programs.pending ? `${programs.pending} awaiting approval` : 'Approval queue is clear'}
            </p>
            <p className="truncate text-xs text-text-muted">
              {programs.pending ? `${pendingShare}% of all programs` : 'Every program has been reviewed'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

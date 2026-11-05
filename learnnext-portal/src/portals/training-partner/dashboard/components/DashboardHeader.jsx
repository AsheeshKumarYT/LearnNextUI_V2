import { CalendarRange, RotateCw } from 'lucide-react';
import { formatLongDate, greeting } from '@/utils/formatDate';
import { IconButton, SegmentedControl, Select } from '@/components/ui';
import { PERIODS } from './dashboardTheme';

/** Quiet page header: greeting + period controls. */
export function DashboardHeader({ user, period, onPeriodChange, onRefresh, refreshing }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      {/* Phones: no date + greeting (asked away) — the page opens straight on the period switch and the numbers */}
      <div className="min-w-0 max-sm:hidden">
        <p className="text-xs font-medium text-text-muted">{formatLongDate()}</p>
        <h1 className="mt-0.5 text-xl font-semibold text-text">
          {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Phones: a dropdown (four options don't fit beside the refresh button); larger screens: segmented toggle */}
        <Select
          options={PERIODS}
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          leftIcon={CalendarRange}
          aria-label="Reporting period"
          className="min-w-0 flex-1 sm:hidden"
        />
        <SegmentedControl tabs={PERIODS} value={period} onChange={onPeriodChange} ariaLabel="Reporting period" className="hidden sm:inline-flex" />
        <IconButton icon={RotateCw} label="Refresh" variant="secondary" onClick={onRefresh} loading={refreshing} />
      </div>
    </header>
  );
}

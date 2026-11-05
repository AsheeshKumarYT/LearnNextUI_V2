import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/services/api';
import { ErrorState, Skeleton, SkeletonCards } from '@/components/feedback';
import { PERIOD_LABEL } from './components/dashboardTheme';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiStrip } from './components/KpiStrip';
import { ProgramSchedule } from './components/ProgramSchedule';
import { ProgramStatus } from './components/ProgramStatus';
import { EntitySplit } from './components/EntitySplit';
import { TopClients } from './components/TopClients';
import { PartnerNetwork } from './components/PartnerNetwork';
import { PartnerAgreements } from './components/PartnerAgreements';
import { Leaderboard } from './components/Leaderboard';
import { UsageRanking } from './components/UsageRanking';

/** Staggered entrance for each row */
const rise = (ms) => ({ animationDelay: `${ms}ms` });

/** One row of paired cards: stacked < 1024px, two equal columns 1024–1439px, 12-column grid ≥ 1440px (cards set their span). */
// grid-cols-1 = minmax(0, 1fr): without it the single mobile column sizes to its widest content and overflows the screen
const ROW = 'animate-rise grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 wide:grid-cols-12';

/**
 * Admin dashboard. DashboardHeader replaces PageHeader (greeting, period, refresh).
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('last_month');
  const { data, loading, error, reload } = useAsync(() => dashboardApi.overview(period), [period]);
  const periodLabel = PERIOD_LABEL[period];

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise" style={rise(0)}>
        <DashboardHeader user={user} period={period} onPeriodChange={setPeriod} onRefresh={reload} refreshing={loading && Boolean(data)} />
      </div>

      {error && !data ? (
        <ErrorState title="Couldn’t load the dashboard" description={error.message} onRetry={reload} />
      ) : !data ? (
        <DashboardSkeleton />
      ) : (
        // Dim slightly while a new period loads, instead of flashing skeletons
        <div className={cn('flex flex-col gap-6 transition-opacity duration-200', loading && 'opacity-60')} aria-busy={loading}>
          <div className="animate-rise" style={rise(80)}>
            <KpiStrip data={data} />
          </div>

          {/* Layout: stacked < 1024px · two equal columns 1024–1439px · 12-column grid ≥ 1440px */}
          <div className={ROW} style={rise(160)}>
            <ProgramSchedule liveToday={data.liveToday} upcoming={data.upcoming} className="wide:col-span-8" />
            <ProgramStatus programs={data.programs} periodLabel={periodLabel} className="wide:col-span-4" />
          </div>

          <div className={ROW} style={rise(240)}>
            <EntitySplit billing={data.billing} periodLabel={periodLabel} className="wide:col-span-6" />
            <TopClients clients={data.topClients} className="wide:col-span-6" />
          </div>

          <div className={ROW} style={rise(320)}>
            <PartnerNetwork partners={data.partners} className="wide:col-span-4" />
            <PartnerAgreements agreements={data.agreements} className="wide:col-span-8" />
          </div>

          <div className={ROW} style={rise(400)}>
            <Leaderboard leaderboard={data.leaderboard} className="wide:col-span-6" />
            <UsageRanking usage={data.usage} periodLabel={periodLabel} className="wide:col-span-6" />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading dashboard">
      <SkeletonCards count={4} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 wide:grid-cols-12">
        <Skeleton className="h-96 rounded-card wide:col-span-8" />
        <Skeleton className="h-96 rounded-card wide:col-span-4" />
      </div>
    </div>
  );
}

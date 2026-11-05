import { cn } from '@/utils/cn';
import { phoneShort } from '@/utils/phoneCopy';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/feedback/Skeleton';
import { ChartLegend } from './ChartLegend';

/**
 * Card frame for any chart: title, description, filter/actions slot, legend, summary value.
 *
 * <ChartContainer title="Enrollments" description="Last 12 months" actions={<SegmentedControl…/>}
 *   legend={series} summary={<span>1,690</span>}>
 *   <AreaChart … />
 * </ChartContainer>
 */
export function ChartContainer({ title, description, actions, legend, summary, loading, height = 280, className, children }) {
  return (
    <Card padding="none" className={cn('flex flex-col', className)}>
      <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:pt-5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-text">{title}</h3>
          {description && <p className="mt-0.5 text-[13px] text-text-muted">{phoneShort(description)}</p>}
          {summary && <div className="mt-3">{summary}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {legend && <ChartLegend series={legend} className="px-4 pt-3 sm:px-5" />}
      <div className="px-2 pb-3 pt-4 sm:px-3" style={{ height }}>
        {loading ? <Skeleton className="mx-2 h-full" /> : children}
      </div>
    </Card>
  );
}

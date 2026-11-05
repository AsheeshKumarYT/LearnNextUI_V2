import { FileSignature } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge, Card, CardHeader } from '@/components/ui';
import { SegmentBar } from './SegmentBar';
import { COLORS } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

// Urgency drives colour: the sooner an agreement expires, the hotter the bar
const URGENCY = {
  30: { bar: 'bg-danger-main', badge: 'danger', note: 'Renew now' },
  60: { bar: 'bg-warning-main', badge: 'warning', note: 'Plan renewal' },
  90: { bar: 'bg-info-main', badge: 'info', note: 'On the radar' },
};

/** Agreement status + an expiry runway, combined so renewals are read in context of what's active. */
export function PartnerAgreements({ agreements, className }) {
  const { active, pending, expired, expiring } = agreements;
  const total = active + pending + expired;
  const max = Math.max(active, ...expiring.map((b) => b.count), 1);
  const segments = [
    { key: 'active', label: 'Active', value: active, color: COLORS.success },
    { key: 'pending', label: 'Pending signature', value: pending, color: COLORS.warning },
    { key: 'expired', label: 'Expired', value: expired, color: COLORS.danger },
  ];

  return (
    // @container: status + expiry sit side by side only when the card itself is wide enough
    <Card tint="success" softTint className={cn('@container', className)}>
      <CardHeader
        icon={FileSignature}
        iconTone="success"
        title="Partner agreements"
        badge={<PeriodChip label="Current" />}
        description={`${total} on file`}
      />
      <div className="grid grid-cols-1 gap-8 @md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Status</h4>
          <SegmentBar segments={segments} size="lg" />
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Expiring soon</h4>
          <ul className="grid grid-cols-1 gap-4">
            {expiring.map((b, i) => {
              const u = URGENCY[b.key];
              return (
                <li key={b.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[13px]">
                    <span className="text-text-secondary">{b.label}</span>
                    <span className="flex items-center gap-2">
                      {b.count > 0 && <Badge tone={u.badge}>{u.note}</Badge>}
                      <span className="w-5 text-right font-semibold tabular-nums text-text">{b.count}</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className={cn('h-full origin-left animate-grow-x rounded-full', u.bar)}
                      style={{ width: `${(b.count / max) * 100}%`, animationDelay: `${300 + i * 120}ms` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}

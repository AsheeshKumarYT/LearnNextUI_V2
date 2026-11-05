import { Handshake } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { CountUp } from './CountUp';
import { SegmentBar } from './SegmentBar';
import { COLORS } from './dashboardTheme';
import { PeriodChip } from './PeriodChip';

export function PartnerNetwork({ partners, className }) {
  const segments = [
    { key: 'trainers', label: 'Trainers', value: partners.trainers, color: COLORS.primary },
    { key: 'channel', label: 'Channel partners', value: partners.channelPartners, color: COLORS.info },
    { key: 'coaches', label: 'Coaches', value: partners.coaches, color: COLORS.violet },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0);

  return (
    <Card tint="violet" softTint className={className}>
      <CardHeader icon={Handshake} iconTone="violet" title="Partner network" badge={<PeriodChip label="Current" />} description="Onboarded partners" />
      <p className="text-[30px] font-bold leading-10 text-text">
        <CountUp value={total} />
      </p>
      <p className="text-[13px] text-text-secondary">partners across 3 roles</p>
      <SegmentBar segments={segments} size="lg" className="mt-5" />
    </Card>
  );
}

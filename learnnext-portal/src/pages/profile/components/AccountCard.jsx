import { useState } from 'react';
import { BadgeCheck, Check, Clock, Copy, Fingerprint, IdCard } from 'lucide-react';
import { formatRelative } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import { Card, CardHeader, IconButton } from '@/components/ui';

/** Read-only account facts managed by the organisation. */
export function AccountCard({ user, className }) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.employeeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  const rows = [
    {
      icon: IdCard,
      label: 'Employee ID',
      value: user.employeeId,
      action: <IconButton icon={copied ? Check : Copy} label={copied ? 'Copied' : 'Copy employee ID'} size="sm" onClick={copyId} className={copied ? 'text-success' : 'text-text-muted'} />,
    },
    { icon: BadgeCheck, label: 'Access level', value: user.role },
    { icon: Clock, label: 'Last sign-in', value: formatRelative(user.lastLoginAt) },
  ];

  return (
    // Column flex: when the card is stretched to match its neighbour, the rows spread evenly instead of leaving a gap
    <Card tint="info" softTint className={cn('flex flex-col', className)}>
      <CardHeader icon={Fingerprint} iconTone="info" title="Account" description={<><span className="sm:hidden">Set by your organisation.</span><span className="max-sm:hidden">Managed by your organisation.</span></>} />
      <dl className="flex flex-1 flex-col divide-y divide-dashed divide-border-strong">
        {rows.map(({ icon: Icon, label, value, action }) => (
          <div key={label} className="flex min-h-11 flex-1 items-center gap-3 py-2 first:pt-0 last:pb-0">
            <Icon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
            <dt className="flex-1 text-[13px] text-text-secondary">{label}</dt>
            <dd className="truncate text-[13px] font-semibold tabular-nums text-text">{value ?? '—'}</dd>
            {action}
          </div>
        ))}
      </dl>
    </Card>
  );
}

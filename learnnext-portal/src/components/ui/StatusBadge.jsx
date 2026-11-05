import { cn } from '@/utils/cn';

/**
 * Maps domain status strings to consistent badge tones.
 * Add new statuses to STATUS_MAP instead of styling badges ad hoc.
 */
export const STATUS_MAP = {
  active: { tone: 'success', label: 'Active' },
  published: { tone: 'success', label: 'Published' },
  completed: { tone: 'success', label: 'Completed' },
  approved: { tone: 'success', label: 'Approved' },
  'on-track': { tone: 'success', label: 'On track' },
  'in-progress': { tone: 'primary', label: 'In progress' },
  upcoming: { tone: 'info', label: 'Upcoming' },
  attention: { tone: 'warning', label: 'Needs attention' },
  blocked: { tone: 'danger', label: 'Blocked' },
  rejected: { tone: 'danger', label: 'Rejected' },
  draft: { tone: 'neutral', label: 'Draft' },
  inactive: { tone: 'neutral', label: 'Inactive' },
  archived: { tone: 'neutral', label: 'Archived' },
  review: { tone: 'warning', label: 'In review' },
  pending: { tone: 'warning', label: 'Pending' },
  away: { tone: 'warning', label: 'Away' },
  invited: { tone: 'info', label: 'Invited' },
  failed: { tone: 'danger', label: 'Failed' },
  suspended: { tone: 'danger', label: 'Suspended' },
  // Support tickets
  open: { tone: 'success', label: 'Open' },
  closed: { tone: 'neutral', label: 'Closed' },
  // Facilitator onboarding
  'kyc-pending': { tone: 'warning', label: 'KYC pending' },
  'approval-pending': { tone: 'violet', label: 'Approval pending' },
  'payment-pending': { tone: 'info', label: 'Payment setup pending' },
  'agreement-expired': { tone: 'danger', label: 'Agreement expired' },
};

// The dot and its soft halo per tone (static class names so Tailwind can see them)
const DOT = {
  success: 'bg-success-main ring-success-main/20',
  warning: 'bg-chart-3 ring-chart-3/25',
  danger: 'bg-danger-main ring-danger-main/20',
  info: 'bg-info ring-info/20',
  primary: 'bg-chart-1 ring-chart-1/20',
  violet: 'bg-chart-4 ring-chart-4/20',
  neutral: 'bg-text-muted ring-text-muted/20',
};

/**
 * A status, the same way everywhere — picked from previews: "Halo dot pill". A small white pill with a hairline edge,
 * a coloured dot wrapped in a soft halo of its colour, and the status in plain text (the colour lives in the dot only,
 * so lists stay calm). `tone` (success | warning | danger | info | primary | violet | neutral) sets the colour directly
 * for status-like labels that aren't in STATUS_MAP (e.g. "All projects", "42% collected").
 */
export function StatusBadge({ status, label, tone, className }) {
  const s = { ...(STATUS_MAP[status] ?? { tone: 'neutral', label: status }), ...(tone && { tone }) };
  return (
    <span
      className={cn(
        'inline-flex h-6 max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-border-strong bg-surface pl-2 pr-2.5 text-xs font-medium text-text dark:bg-surface-secondary',
        className,
      )}
    >
      <span className={cn('size-[7px] shrink-0 rounded-full ring-[3px]', DOT[s.tone] ?? DOT.neutral)} aria-hidden="true" />
      <span className="truncate">{label ?? s.label}</span>
    </span>
  );
}
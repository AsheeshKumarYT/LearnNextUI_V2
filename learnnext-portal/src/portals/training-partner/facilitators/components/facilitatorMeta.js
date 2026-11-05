/** Facilitator types (the form's "Type" and the list's filter) */
export const TYPES = [
  { value: 'facilitator', label: 'Facilitator' },
  { value: 'partner', label: 'Channel partner' },
  { value: 'both', label: 'Both' },
];
export const TYPE_LABEL = { facilitator: 'Facilitator', partner: 'Channel partner', both: 'Facilitator & channel partner' };

/**
 * The statuses, in journey order: `badge` = the StatusBadge key, `tone` = the StatPills tone.
 * KYC pending → Approval pending (KYC submitted, waiting for an admin) → Payment setup pending → Active → Agreement expired.
 * `review` isn't stored: it's a KYC-pending facilitator who has submitted (see stageOf).
 */
export const STATUS = {
  kyc: { badge: 'kyc-pending', label: 'KYC pending', tone: 'amber' },
  review: { badge: 'approval-pending', label: 'Approval pending', tone: 'violet' },
  payment: { badge: 'payment-pending', label: 'Payment setup pending', tone: 'cyan' },
  active: { badge: 'active', label: 'Active', tone: 'green' },
  expired: { badge: 'agreement-expired', label: 'Agreement expired', tone: 'red' },
};
export const STATUS_ORDER = ['kyc', 'review', 'payment', 'active', 'expired'];

/** Where a facilitator is: their status, or `review` once they've submitted their KYC */
export const stageOf = (f) => (f.status === 'kyc' && f.kycSubmittedAt ? 'review' : f.status);

/** Whole days since an ISO date (0 = today) */
export const daysSince = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 864e5));

/** "today" / "1 day" / "9 days" */
export const dayWord = (n) => (n === 0 ? 'today' : `${n} day${n === 1 ? '' : 's'}`);

/** How long they've been waiting at their current step (KYC: since the link was sent; approval: since they submitted; payment: since KYC was done) */
export const waitingSince = (f) => ({ kyc: f.kycSentAt, review: f.kycSubmittedAt, payment: f.kycDoneAt })[stageOf(f)] ?? null;

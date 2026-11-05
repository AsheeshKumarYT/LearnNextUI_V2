import { startOfDay } from '@/utils/formatDate';

/** Semantic colours for dashboard segments (CSS variables → follow light/dark). */
export const COLORS = {
  primary: 'var(--ln-primary)',
  success: 'var(--ln-success-main)',
  warning: 'var(--ln-warning-main)',
  danger: 'var(--ln-danger-main)',
  info: 'var(--ln-info-main)',
  violet: 'var(--ln-chart-4)',
  muted: 'var(--ln-border-strong)',
};

export const PERIODS = [
  { value: 'month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

export const PERIOD_LABEL = { month: 'This month', last_month: 'Last month', quarter: 'This quarter', year: 'This year' };

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

/** "Today", "Tomorrow", "In 4 days" */
export function relativeDay(value) {
  const days = Math.round((startOfDay(value) - startOfDay(new Date())) / 864e5);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return days > 1 ? `In ${days} days` : `${-days} days ago`;
}

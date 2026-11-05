/**
 * Chart styling shared by every Recharts wrapper. Colors are CSS variables,
 * so charts follow light/dark mode automatically.
 */
export const CHART_COLORS = [
  'var(--ln-chart-1)',
  'var(--ln-chart-2)',
  'var(--ln-chart-3)',
  'var(--ln-chart-4)',
  'var(--ln-chart-5)',
];

export const colorAt = (i, series) => series?.color ?? CHART_COLORS[i % CHART_COLORS.length];

export const axisProps = {
  stroke: 'var(--ln-text-muted)',
  tick: { fill: 'var(--ln-text-muted)', fontSize: 12 },
  tickLine: false,
  axisLine: false,
  tickMargin: 10,
};

export const gridProps = {
  stroke: 'var(--ln-chart-grid)',
  strokeDasharray: '0',
  vertical: false,
};

export const cursorLine = { stroke: 'var(--ln-border-strong)', strokeWidth: 1, strokeDasharray: '4 4' };
export const cursorBar = { fill: 'var(--ln-surface-sunken)', opacity: 0.7, radius: 6 };

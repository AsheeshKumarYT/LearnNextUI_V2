import { Bar, BarChart as RBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, colorAt, cursorBar } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

/**
 * Horizontal bars — good for ranked categories.
 * <HorizontalBarChart data={[{ name, value }]} labelKey="name" series={[{ key: 'value', label: 'Learners' }]} />
 */
export function HorizontalBarChart({ data, labelKey = 'name', series = [{ key: 'value', label: 'Value' }], valueFormatter, labelWidth = 96 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RBarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid stroke="var(--ln-chart-grid)" horizontal={false} />
        <XAxis type="number" {...axisProps} tickFormatter={valueFormatter} />
        <YAxis type="category" dataKey={labelKey} {...axisProps} width={labelWidth} tick={{ ...axisProps.tick, fill: 'var(--ln-text-secondary)' }} />
        <Tooltip cursor={cursorBar} content={<ChartTooltip valueFormatter={valueFormatter} />} />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={colorAt(i, s)} radius={[0, 5, 5, 0]} maxBarSize={22} background={{ fill: 'var(--ln-surface-secondary)', radius: 5 }} />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}

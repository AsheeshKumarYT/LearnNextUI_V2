import { Bar, BarChart as RBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, colorAt, cursorBar, gridProps } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

/**
 * Vertical bars. Multiple series render grouped (or stacked with `stacked`).
 * <BarChart data={rows} xKey="label" series={[{ key: 'active', label: 'Active learners' }]} />
 */
export function BarChart({ data, xKey = 'label', series = [], valueFormatter, yTickFormatter, stacked, showYAxis = true, barSize }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RBarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} interval="preserveStartEnd" />
        <YAxis {...axisProps} width={showYAxis ? 44 : 0} hide={!showYAxis} tickFormatter={yTickFormatter} />
        <Tooltip cursor={cursorBar} content={<ChartTooltip valueFormatter={valueFormatter} />} />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={colorAt(i, s)}
            stackId={stacked ? 'a' : undefined}
            radius={stacked && i < series.length - 1 ? 0 : [5, 5, 0, 0]}
            maxBarSize={barSize ?? 36}
          />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}

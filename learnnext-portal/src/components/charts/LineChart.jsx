import { CartesianGrid, Line, LineChart as RLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, colorAt, cursorLine, gridProps } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

/**
 * <LineChart data={rows} xKey="label" series={[{ key: 'enrollments', label: 'Enrollments' }]} valueFormatter={formatNumber} />
 */
export function LineChart({ data, xKey = 'label', series = [], valueFormatter, yTickFormatter, showYAxis = true }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RLineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} interval="preserveStartEnd" minTickGap={16} />
        <YAxis {...axisProps} width={showYAxis ? 44 : 0} hide={!showYAxis} tickFormatter={yTickFormatter} />
        <Tooltip cursor={cursorLine} content={<ChartTooltip valueFormatter={valueFormatter} />} />
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={colorAt(i, s)}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '5 5' : undefined}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--ln-surface)' }}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}

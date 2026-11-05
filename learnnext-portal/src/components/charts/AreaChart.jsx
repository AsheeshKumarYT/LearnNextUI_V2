import { useId } from 'react';
import { Area, AreaChart as RAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, colorAt, cursorLine, gridProps } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

/**
 * Soft gradient area chart.
 * <AreaChart data={rows} xKey="label" series={[{ key: 'enrollments', label: 'Enrollments' }, { key: 'completions', label: 'Completions' }]} />
 */
export function AreaChart({ data, xKey = 'label', series = [], valueFormatter, yTickFormatter, showYAxis = true, stacked }) {
  const id = useId().replace(/:/g, '');
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RAreaChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorAt(i, s)} stopOpacity={i === 0 ? 0.24 : 0.12} />
              <stop offset="100%" stopColor={colorAt(i, s)} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} interval="preserveStartEnd" minTickGap={16} />
        <YAxis {...axisProps} width={showYAxis ? 44 : 0} hide={!showYAxis} tickFormatter={yTickFormatter} />
        <Tooltip cursor={cursorLine} content={<ChartTooltip valueFormatter={valueFormatter} />} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stackId={stacked ? 'a' : undefined}
            stroke={colorAt(i, s)}
            strokeWidth={2}
            fill={`url(#${id}-${s.key})`}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--ln-surface)' }}
          />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
  );
}

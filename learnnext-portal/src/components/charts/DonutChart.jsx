import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

/**
 * Donut with optional center label.
 * <DonutChart data={[{ name, value }]} centerLabel="Learners" centerValue="3,404" />
 */
export function DonutChart({ data, nameKey = 'name', valueKey = 'value', valueFormatter, centerLabel, centerValue, colors = CHART_COLORS }) {
  return (
    <div className="relative size-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
          {/* Starts at 12 o'clock, clockwise. Gaps come from paddingAngle (no stroke, which distorts rounded ends);
              minAngle keeps tiny shares visible as a proper rounded segment instead of a squashed notch. */}
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            startAngle={90}
            endAngle={-270}
            innerRadius="70%"
            outerRadius="94%"
            paddingAngle={3}
            minAngle={6}
            cornerRadius={3}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={d[nameKey]} fill={d.color ?? colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums text-text">{centerValue}</span>
          <span className="text-xs text-text-muted">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

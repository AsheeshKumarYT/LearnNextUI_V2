/**
 * Custom Recharts tooltip content: <Tooltip content={<ChartTooltip valueFormatter={fmt} />} />
 */
export function ChartTooltip({ active, payload, label, valueFormatter = (v) => v, labelFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border border-border bg-elevated px-3 py-2.5 shadow-pop">
      {label != null && <p className="mb-1.5 text-xs font-medium text-text-muted">{labelFormatter ? labelFormatter(label) : label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((p) => (
          <div key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4 text-[13px]">
            <span className="flex items-center gap-2 text-text-secondary">
              <span className="size-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-text">{valueFormatter(p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

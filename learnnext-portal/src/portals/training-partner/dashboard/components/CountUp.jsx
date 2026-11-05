import { useCountUp } from '@/hooks/useCountUp';

/** Animated number. `format` receives the in-between value (e.g. formatRupeesCompact). */
export function CountUp({ value, format = (v) => Math.round(v).toLocaleString('en-IN'), duration, delay, title }) {
  const shown = useCountUp(value, { duration, delay });
  return (
    <span title={title} className="tabular-nums">
      {format(shown)}
    </span>
  );
}

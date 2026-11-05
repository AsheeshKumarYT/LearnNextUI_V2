import { useEffect, useRef, useState } from 'react';

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Animates a number from its previous value to `target` (ease-out).
 * const shown = useCountUp(1234, { duration: 900 });
 * Always settles on the exact target — a timer backs up requestAnimationFrame, which pauses in background tabs.
 */
export function useCountUp(target, { duration = 1000, delay = 0 } = {}) {
  const [value, setValue] = useState(() => (reduceMotion() ? target : 0));
  const from = useRef(value);

  useEffect(() => {
    if (reduceMotion() || !Number.isFinite(target)) {
      setValue(target);
      return undefined;
    }
    const start = from.current;
    let raf;
    let t0;
    const tick = (now) => {
      t0 ??= now;
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - p) ** 3;
      setValue(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const begin = setTimeout(() => (raf = requestAnimationFrame(tick)), delay);
    const settle = setTimeout(() => setValue(target), delay + duration + 50);
    return () => {
      clearTimeout(begin);
      clearTimeout(settle);
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, duration, delay]);

  return value;
}

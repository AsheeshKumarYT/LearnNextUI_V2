import { useEffect, useState } from 'react';

/**
 * Keeps an element mounted long enough to play its exit transition.
 * const { mounted, closing } = usePresence(open);
 * Render when `mounted`; apply exit classes when `closing`.
 * Mounts in the same render that `open` becomes true (so focus management works immediately).
 */
export function usePresence(open, duration = 160) {
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
      return undefined;
    }
    const t = setTimeout(() => setRendered(false), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  return { mounted: open || rendered, closing: !open && rendered };
}

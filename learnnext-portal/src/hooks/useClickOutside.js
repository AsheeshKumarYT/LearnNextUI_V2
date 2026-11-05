import { useEffect } from 'react';

/** Calls handler when a pointerdown happens outside every ref in `refs`. */
export function useClickOutside(refs, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const list = Array.isArray(refs) ? refs : [refs];
    const onDown = (e) => {
      if (list.some((r) => r.current && r.current.contains(e.target))) return;
      handler(e);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [refs, handler, enabled]);
}

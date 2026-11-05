import { useEffect, useRef } from 'react';

/**
 * useHotkey('mod+k', handler) — "mod" is Cmd on macOS and Ctrl elsewhere.
 */
export function useHotkey(combo, handler, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!enabled) return undefined;
    const parts = combo.toLowerCase().split('+');
    const key = parts.pop();
    const needMod = parts.includes('mod');
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (needMod && !mod) return;
      if (e.key?.toLowerCase() !== key) return;
      e.preventDefault();
      ref.current(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [combo, enabled]);
}

export const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

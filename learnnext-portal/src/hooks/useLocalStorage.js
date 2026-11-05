import { useCallback, useEffect, useState } from 'react';

const EVENT = 'ln:storage';

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * useState that persists to localStorage (JSON).
 * Every hook instance using the same key stays in sync (same tab and other tabs).
 * Safe when storage is unavailable (falls back to in-memory state).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValueState] = useState(() => read(key, initialValue));

  const setValue = useCallback(
    (next) => {
      setValueState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          if (resolved === undefined) window.localStorage.removeItem(key);
          else window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable */
        }
        queueMicrotask(() => window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } })));
        return resolved;
      });
    },
    [key],
  );

  useEffect(() => {
    const sync = (e) => {
      const changedKey = e.type === 'storage' ? e.key : e.detail?.key;
      if (changedKey === key) setValueState(read(key, initialValue));
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const remove = useCallback(() => setValue(undefined), [setValue]);
  return [value, setValue, remove];
}

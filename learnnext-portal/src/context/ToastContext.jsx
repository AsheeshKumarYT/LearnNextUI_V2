import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer } from '@/components/feedback/ToastContainer';
import { uid } from '@/utils/helpers';

export const ToastContext = createContext(null);
const PendingContext = createContext(null);

const DEFAULT_DURATION = 4000;
const LEAVE_MS = 260; // matches the toast's exit transition
const SETTLE_MS = 300; // after the next page has loaded, before a held toast appears
const FALLBACK_MS = 6000; // a held toast never waits longer than this

/**
 * Global toast queue. Use via the useToast() hook:
 *   toast.success('Saved'); toast.error('Failed', { description, action: { label, onClick } });
 * Each toast closes after its `duration` (0 = stays until dismissed). Hovering a toast pauses its timer — and its
 * time line — and moving away carries on from where it stopped.
 * A toast sent right before moving to another page should pass { afterLoad: true }: it waits until that page has
 * loaded (see PendingToasts below) instead of popping up over the loader.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({}); // id → { handle, remaining, started }

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]?.handle);
    delete timers.current[id];
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), LEAVE_MS);
  }, []);

  const start = useCallback(
    (id, ms) => {
      timers.current[id] = { remaining: ms, started: Date.now(), handle: setTimeout(() => dismiss(id), ms) };
    },
    [dismiss],
  );

  const pause = useCallback((id) => {
    const t = timers.current[id];
    if (!t?.handle) return;
    clearTimeout(t.handle);
    timers.current[id] = { remaining: Math.max(0, t.remaining - (Date.now() - t.started)), handle: null };
  }, []);

  const resume = useCallback(
    (id) => {
      const t = timers.current[id];
      if (t && !t.handle) start(id, t.remaining);
    },
    [start],
  );

  const pending = useRef([]); // toasts waiting for the next page to finish loading
  const fallback = useRef(null);

  const show = useCallback(
    (variant, title, opts = {}) => {
      const id = uid('toast');
      const { afterLoad, ...rest } = opts;
      const duration = rest.duration ?? DEFAULT_DURATION;
      const item = { id, variant, title, ...rest, duration };
      if (afterLoad) {
        // Held until <PendingToasts /> on the next page says it has loaded (safety net: shown anyway after a while)
        pending.current.push(item);
        clearTimeout(fallback.current);
        fallback.current = setTimeout(() => flushRef.current(), FALLBACK_MS);
        return id;
      }
      setToasts((list) => [...list.slice(-3), item]);
      if (duration > 0) start(id, duration);
      return id;
    },
    [start],
  );

  // Shows every held toast now
  const flushRef = useRef(() => {});
  flushRef.current = () => {
    clearTimeout(fallback.current);
    const items = pending.current;
    pending.current = [];
    if (!items.length) return;
    setToasts((list) => [...list, ...items].slice(-4));
    items.forEach((t) => t.duration > 0 && start(t.id, t.duration));
  };
  const hasPending = useCallback(() => pending.current.length > 0, []);
  const flush = useCallback(() => flushRef.current(), []);
  const pendingApi = useMemo(() => ({ hasPending, flush }), [hasPending, flush]);

  const api = useMemo(
    () => ({
      show: (title, opts) => show('default', title, opts),
      success: (title, opts) => show('success', title, opts),
      error: (title, opts) => show('error', title, opts),
      warning: (title, opts) => show('warning', title, opts),
      info: (title, opts) => show('info', title, opts),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      <PendingContext.Provider value={pendingApi}>
        {children}
        <ToastContainer toasts={toasts} onDismiss={dismiss} onPause={pause} onResume={resume} />
      </PendingContext.Provider>
    </ToastContext.Provider>
  );
}

/**
 * Put once inside each layout's page area (inside its Suspense). It mounts only when the page's code has loaded, then
 * waits until the page has finished its first data load (no shimmer skeletons / busy areas left) and lets any toast
 * sent with { afterLoad: true } appear — e.g. "Welcome back" lands on the finished dashboard, not over the loader.
 */
export function PendingToasts() {
  const pendingApi = useContext(PendingContext);
  useEffect(() => {
    if (!pendingApi?.hasPending()) return undefined;
    const began = Date.now();
    let timer;
    const check = () => {
      const busy = document.querySelector('.animate-shimmer, [aria-busy="true"], [role="status"][aria-label="Loading"]');
      if (busy && Date.now() - began < FALLBACK_MS) {
        timer = setTimeout(check, 100);
        return;
      }
      timer = setTimeout(pendingApi.flush, SETTLE_MS); // a beat after the page appears
    };
    timer = setTimeout(check, 50);
    return () => clearTimeout(timer);
  }, [pendingApi]);
  return null;
}

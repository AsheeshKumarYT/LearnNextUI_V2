import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Run an async loader (usually a services/api.js call) with loading/error state.
 * const { data, loading, error, reload, setData } = useAsync(() => coursesApi.list(), []);
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: undefined, loading: true, error: null });
  const alive = useRef(true);

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await loader();
      if (alive.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (alive.current) setState((s) => ({ ...s, loading: false, error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    alive.current = true;
    run();
    return () => {
      alive.current = false;
    };
  }, [run]);

  const setData = useCallback(
    (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    [],
  );

  return { ...state, reload: run, setData };
}

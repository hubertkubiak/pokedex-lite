import { useEffect, useState } from 'react';

/**
 * Runs an async function whenever `deps` change.
 * Returns `[state, retry]`, where `state.status` is `loading` | `ok` | `error`.
 */
export function useAsync(fn, deps) {
  const [state, setState] = useState({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    fn().then(
      (data) => alive && setState({ status: 'ok', data }),
      (error) => alive && setState({ status: 'error', error })
    );
    return () => {
      alive = false;
    };
  }, [...deps, attempt]); // `fn` is left out on purpose: it changes every render, `deps` decide when to refetch

  return [state, () => setAttempt((a) => a + 1)];
}

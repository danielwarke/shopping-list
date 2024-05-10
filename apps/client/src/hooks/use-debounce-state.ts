import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";

export function useDebounceState<T>(
  initialState: T,
  debouncedFunc: (newState: T) => void,
  wait = 300,
): [T, (newState: T) => void] {
  const [state, setState] = useState<T>(initialState);

  const withDebounce = useMemo(
    () => debounce(debouncedFunc, wait),
    [debouncedFunc, wait],
  );

  const setStateWithDebounce = useCallback(
    (newState: T) => {
      setState(newState);
      withDebounce(newState);
    },
    [withDebounce],
  );

  // this is necessary so that it re-renders when another user makes a change
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setStateWithDebounce];
}

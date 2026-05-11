// src/hooks/useSafeAsync.ts

import { useEffect, useRef, useCallback } from 'react';

type SafeSetter<T> = (value: T | ((prev: T) => T)) => void;
type SafeDispatch = <T>(setter: SafeSetter<T>) => SafeSetter<T>;
type UseSafeAsyncReturn = {
  safeDispatch: SafeDispatch;
  isMounted: () => boolean;
};

export function useSafeAsync(): UseSafeAsyncReturn {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeDispatch = useCallback<SafeDispatch>((setter) => {
    return (value) => {
      if (mountedRef.current) {
        setter(value);
      }
    };
  }, []);

  const isMounted = useCallback((): boolean => mountedRef.current, []);

  return { safeDispatch, isMounted };
}

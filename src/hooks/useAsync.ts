/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, type DependencyList } from 'react';

import useIsMountedRef from './useIsMountedRef';

type AsyncReturnType<T> = {
  loading: boolean;
  call: T;
};

const useAsync = <T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): AsyncReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const isMountedRef = useIsMountedRef();

  const call = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      const response = await callback(...args);
      return response;
    } finally {
      setTimeout(() => {
        if (!isMountedRef.current) {
          return;
        }
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps) as T;

  return {
    loading,
    call,
  };
};

export default useAsync;

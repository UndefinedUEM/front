import { useEffect, type DependencyList, type EffectCallback } from 'react';

const useDidMountAndUpdate = (
  callback: EffectCallback,
  deps?: DependencyList
  // eslint-disable-next-line react-hooks/exhaustive-deps
): void => useEffect(callback, deps);

export default useDidMountAndUpdate;

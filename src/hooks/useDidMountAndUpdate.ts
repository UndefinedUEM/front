import { useEffect, type DependencyList, type EffectCallback } from 'react';

const useDidMountAndUpdate = (
  callback: EffectCallback,
  deps?: DependencyList
): void => useEffect(callback, deps);

export default useDidMountAndUpdate;

import { useEffect, type EffectCallback } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useDidMount = (callback: EffectCallback): void => useEffect(callback, []);

export default useDidMount;

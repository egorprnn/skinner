import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function shallowCompare<T extends Record<string, any>>(prevProps: T, nextProps: T) {
  const prevPropsEntries = Object.entries(prevProps);
  const nextPropsEntries = Object.entries(nextProps);

  return (
    prevPropsEntries.length === nextPropsEntries.length &&
    prevPropsEntries.every(([key, prop]) => Object.is(prop, nextProps[key]))
  );
}

export function useMemoizeProps<T extends Record<string, any>>(
  props: T,
  equalityCheck: (prevProps: T, nextProps: T) => boolean = shallowCompare,
) {
  const ref = useRef<T | undefined>(undefined);

  if (ref.current === undefined || !equalityCheck(ref.current, props)) {
    ref.current = props;
  }

  return [ref.current];
}

export function usePostponedEffect(fn: EffectCallback, deps?: DependencyList | undefined) {
  const firstCall = useRef<boolean>(true);

  useEffect(() => {
    if (!firstCall.current) {
      return fn();
    } else {
      firstCall.current = false;
    }
  }, deps);
}

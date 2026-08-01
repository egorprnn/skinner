import { useRef } from 'react';
import { isEqual } from '@vkontakte/vkjs';

export function useObjectMemo<T>(object: T): T {
  const cache = useRef(object);

  if (!isEqual(cache.current, object)) {
    cache.current = object;
  }

  return cache.current;
}
